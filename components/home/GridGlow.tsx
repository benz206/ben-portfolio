"use client";

import { useEffect, useRef } from "react";
import type { Glyph, SymbolPath } from "@/data/symbols";

// Magical gradient beams that travel along a faint graph-paper grid.
// Pure-canvas: a static low-alpha grid + additive colored pulses that
// trace individual gridlines and fade as they pass, plus a soft pointer halo.
//
// On hover (driven by `activeKey`) the field eases into "symbol mode": the
// company's bespoke glyph is mapped onto the grid and a glowing tracer runs
// around it, accelerating as it goes.

const GRID = 30; // px between gridlines (CSS pixels)
const SCALE = 2; // grid cells per symbol unit

// tracer acceleration: starts slow on hover, winds up to a fast steady speed
const TRACER_BASE = 110; // px/s
const TRACER_MAX = 560; // px/s

const PALETTE: Array<[number, number, number]> = [
    [167, 139, 250], // violet
    [103, 232, 249], // cyan
    [253, 186, 116], // tangerine
    [110, 231, 183], // emerald
    [244, 114, 182], // rose
];

type Beam = {
    axis: "h" | "v"; // h = travels along x on a horizontal line; v = along y
    line: number; // fixed coordinate of the gridline (px)
    head: number; // position of the leading edge along the travel axis (px)
    dir: 1 | -1;
    speed: number; // px / second
    len: number; // length of the glowing tail (px)
    color: [number, number, number];
};

type Pt = { x: number; y: number };
type LogoDot = { x: number; y: number; lit: number };
// One path of a glyph, mapped to canvas pixels, with a tracer running along it.
type LogoLoop = {
    pts: Pt[];
    closed: boolean;
    seg: number[]; // length of each segment
    total: number; // path length
    dist: number; // tracer position along the path (px)
    speed: number; // current tracer speed (ramps up while hovered)
    head: Pt; // current tracer position, refreshed each frame
};

export type GridGlowOrg = {
    key: string;
    accent: string;
    symbol: Glyph;
};

function parseAccent(accent: string): [number, number, number] {
    const [r, g, b] = accent.split(",").map((n) => Number(n.trim()));
    return [r || 255, g || 255, b || 255];
}

export default function GridGlow({
    orgs = [],
    activeKey = null,
}: {
    orgs?: GridGlowOrg[];
    activeKey?: string | null;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const registryRef = useRef<
        Map<string, { accent: [number, number, number]; glyph: Glyph }>
    >(new Map());
    const activeKeyRef = useRef<string | null>(activeKey);

    // keep the live values for the animation loop in sync with props
    useEffect(() => {
        activeKeyRef.current = activeKey;
    }, [activeKey]);

    useEffect(() => {
        const reg = registryRef.current;
        reg.clear();
        for (const { key, accent, symbol } of orgs) {
            const base = parseAccent(accent);
            reg.set(key, {
                accent: symbol.color ? parseAccent(symbol.color) : base,
                glyph: symbol,
            });
        }
    }, [orgs]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let width = 0;
        let height = 0;
        let dpr = 1;
        let beams: (Beam | null)[] = [];
        let raf = 0;
        let last = 0;
        let visible = true;

        // symbol mode state
        let reveal = 0; // 0 = ambient, 1 = glyph fully formed
        const logoState: {
            key: string | null;
            dots: LogoDot[];
            loops: LogoLoop[];
            accent: [number, number, number];
        } = { key: null, dots: [], loops: [], accent: [255, 255, 255] };

        const pointer = { x: -9999, y: -9999, target: -9999, ty: -9999 };

        const rand = (a: number, b: number) => a + Math.random() * (b - a);
        const pick = <T,>(arr: T[]): T =>
            arr[Math.floor(Math.random() * arr.length)];

        function makeCandidate(): Beam {
            const axis: "h" | "v" = Math.random() < 0.5 ? "h" : "v";
            const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
            const lines = Math.max(
                1,
                Math.floor((axis === "h" ? height : width) / GRID)
            );
            const line = Math.floor(rand(1, lines)) * GRID;
            const travel = axis === "h" ? width : height;
            const len = rand(120, 320);
            const head =
                dir === 1
                    ? -len - rand(0, travel * 0.4)
                    : travel + len + rand(0, travel * 0.4);
            return {
                axis,
                line,
                head,
                dir,
                speed: rand(110, 240),
                len,
                color: pick(PALETTE),
            };
        }

        // Time window (relative to now) during which a beam's head — moving as
        // pos(t) = head + dir*speed*t — keeps the segment [head-len, head]
        // covering coordinate `p`. The segment covers p iff head ∈ [p, p+len].
        function coverWindow(b: Beam, p: number): [number, number] {
            const v = b.dir * b.speed;
            const t1 = (p - b.head) / v;
            const t2 = (p + b.len - b.head) / v;
            return t1 < t2 ? [t1, t2] : [t2, t1];
        }

        // Will these two beams ever occupy the same point at the same time?
        function willCollide(a: Beam, b: Beam): boolean {
            if (a.axis === b.axis) {
                // parallel lines only touch if they ARE the same line
                return a.line === b.line;
            }
            // perpendicular: the only shared point is the intersection
            // (vertical beam's x, horizontal beam's y)
            const h = a.axis === "h" ? a : b; // horizontal: fixed y, spans x
            const v = a.axis === "h" ? b : a; // vertical: fixed x, spans y
            const [hEnter, hExit] = coverWindow(h, v.line); // h covers x = v.line
            const [vEnter, vExit] = coverWindow(v, h.line); // v covers y = h.line
            const start = Math.max(hEnter, vEnter, 0);
            const end = Math.min(hExit, vExit);
            return start <= end; // windows overlap in the future → collision
        }

        // Try to produce a beam that collides with none of the live beams.
        // Returns null if no safe candidate is found this frame.
        function safeSpawn(live: (Beam | null)[]): Beam | null {
            for (let attempt = 0; attempt < 28; attempt++) {
                const c = makeCandidate();
                let ok = true;
                for (const o of live) {
                    if (o && willCollide(c, o)) {
                        ok = false;
                        break;
                    }
                }
                if (ok) return c;
            }
            return null;
        }

        function targetBeamCount() {
            return Math.max(5, Math.min(11, Math.round(width / 170)));
        }

        // Map a glyph's unit paths onto the canvas grid (centred vertically,
        // offset to the right so it clears the text) and prepare tracers.
        function placeSymbol(paths: SymbolPath[]): {
            dots: LogoDot[];
            loops: LogoLoop[];
        } {
            const xs: number[] = [];
            const ys: number[] = [];
            for (let x = GRID; x < width; x += GRID) xs.push(x);
            for (let y = GRID; y < height; y += GRID) ys.push(y);

            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;
            for (const p of paths) {
                for (const [x, y] of p.points) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
            if (!isFinite(minX)) return { dots: [], loops: [] };

            const spanCols = Math.round((maxX - minX) * SCALE);
            const spanRows = Math.round((maxY - minY) * SCALE);
            if (spanCols + 1 > xs.length || spanRows + 1 > ys.length) {
                return { dots: [], loops: [] }; // grid too small (e.g. mobile)
            }

            // bias toward the right so the centred text doesn't sit on it
            const targetCx = Math.min(
                width * 0.62,
                width - (spanCols / 2 + 2) * GRID
            );
            let baseCol = Math.round(targetCx / GRID - 1 - spanCols / 2);
            baseCol = Math.max(0, Math.min(baseCol, xs.length - 1 - spanCols));
            let baseRow = Math.round((ys.length - 1 - spanRows) / 2);
            baseRow = Math.max(0, Math.min(baseRow, ys.length - 1 - spanRows));

            const toPx = (x: number, y: number): Pt => ({
                x: xs[baseCol + Math.round((x - minX) * SCALE)],
                y: ys[baseRow + Math.round((y - minY) * SCALE)],
            });

            const dots: LogoDot[] = [];
            const dotSeen = new Set<string>();
            const loops: LogoLoop[] = [];

            paths.forEach((path, idx) => {
                const pts = path.points.map(([x, y]) => toPx(x, y));
                const closed = !!path.closed;
                for (const pt of pts) {
                    const k = `${Math.round(pt.x)}:${Math.round(pt.y)}`;
                    if (dotSeen.has(k)) continue;
                    dotSeen.add(k);
                    dots.push({ x: pt.x, y: pt.y, lit: 0 });
                }
                const seg: number[] = [];
                let total = 0;
                const segCount = closed ? pts.length : pts.length - 1;
                for (let p = 0; p < segCount; p++) {
                    const a = pts[p];
                    const b = pts[(p + 1) % pts.length];
                    const L = Math.hypot(b.x - a.x, b.y - a.y);
                    seg.push(L);
                    total += L;
                }
                loops.push({
                    pts,
                    closed,
                    seg,
                    total,
                    dist: idx * 36, // stagger so multiple tracers aren't synced
                    speed: TRACER_BASE,
                    head: pts[0],
                });
            });

            return { dots, loops };
        }

        // tracer position at distance `d` along a path — wrapping for closed
        // loops, ping-ponging for open ones (so it never teleports)
        function pointAt(lp: LogoLoop, d: number): Pt {
            let dd: number;
            if (lp.closed) {
                dd = ((d % lp.total) + lp.total) % lp.total;
            } else {
                const period = lp.total * 2;
                const p = ((d % period) + period) % period;
                dd = p <= lp.total ? p : period - p;
            }
            for (let p = 0; p < lp.seg.length; p++) {
                const L = lp.seg[p];
                if (dd <= L) {
                    const a = lp.pts[p];
                    const b = lp.pts[(p + 1) % lp.pts.length];
                    const t = L ? dd / L : 0;
                    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
                }
                dd -= L;
            }
            return lp.pts[lp.pts.length - 1];
        }

        function resize() {
            const rect = canvas!.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas!.width = Math.floor(width * dpr);
            canvas!.height = Math.floor(height * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
            const want = targetBeamCount();
            // start empty; the frame loop fills slots with collision-free beams
            beams = Array.from({ length: want }, () => null);
            // re-place an active glyph onto the new grid dimensions
            if (logoState.key) {
                const entry = registryRef.current.get(logoState.key);
                if (entry) {
                    const placed = placeSymbol(entry.glyph.paths);
                    logoState.dots = placed.dots;
                    logoState.loops = placed.loops;
                }
            }
        }

        function drawGrid() {
            ctx!.lineWidth = 1;
            ctx!.strokeStyle = "rgba(255,255,255,0.05)";
            ctx!.beginPath();
            for (let x = GRID; x < width; x += GRID) {
                ctx!.moveTo(x + 0.5, 0);
                ctx!.lineTo(x + 0.5, height);
            }
            for (let y = GRID; y < height; y += GRID) {
                ctx!.moveTo(0, y + 0.5);
                ctx!.lineTo(width, y + 0.5);
            }
            ctx!.stroke();

            // faint intersection dots, brighter near the pointer
            for (let x = GRID; x < width; x += GRID) {
                for (let y = GRID; y < height; y += GRID) {
                    let a = 0.05;
                    if (pointer.x > -9000) {
                        const dx = x - pointer.x;
                        const dy = y - pointer.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 160) a += (1 - d / 160) * 0.5;
                    }
                    ctx!.fillStyle = `rgba(255,255,255,${a})`;
                    ctx!.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
                }
            }
        }

        // endpoints of the segment of length `len` ending at the beam's head,
        // lying on the beam's gridline
        function segment(b: Beam, len: number) {
            const tail = b.head - b.dir * len;
            return b.axis === "h"
                ? { x0: tail, y0: b.line, x1: b.head, y1: b.line }
                : { x0: b.line, y0: tail, x1: b.line, y1: b.head };
        }

        function drawBeam(b: Beam) {
            const [r, g, bl] = b.color;
            const hx = b.axis === "h" ? b.head : b.line;
            const hy = b.axis === "h" ? b.line : b.head;

            // short comet tail riding the gridline, brightest at the head
            const trail = segment(b, b.len);
            const tg = ctx!.createLinearGradient(
                trail.x0,
                trail.y0,
                trail.x1,
                trail.y1
            );
            tg.addColorStop(0, `rgba(${r},${g},${bl},0)`);
            tg.addColorStop(0.8, `rgba(${r},${g},${bl},0.13)`);
            tg.addColorStop(1, `rgba(${r},${g},${bl},0.28)`);
            ctx!.lineCap = "round";
            ctx!.strokeStyle = tg;
            ctx!.shadowColor = `rgba(${r},${g},${bl},0.38)`;
            ctx!.shadowBlur = 9;
            ctx!.lineWidth = 1.4;
            ctx!.beginPath();
            ctx!.moveTo(trail.x0, trail.y0);
            ctx!.lineTo(trail.x1, trail.y1);
            ctx!.stroke();
            ctx!.shadowBlur = 0;

            // the head is a small second cursor: a colored light that pools on
            // the grid and brightens the intersections it passes over
            const R = 70;
            const orb = ctx!.createRadialGradient(hx, hy, 0, hx, hy, R);
            orb.addColorStop(0, `rgba(${r},${g},${bl},0.1)`);
            orb.addColorStop(0.45, `rgba(${r},${g},${bl},0.035)`);
            orb.addColorStop(1, `rgba(${r},${g},${bl},0)`);
            ctx!.fillStyle = orb;
            ctx!.fillRect(hx - R, hy - R, R * 2, R * 2);

            const sx = Math.ceil((hx - R) / GRID) * GRID;
            const sy = Math.ceil((hy - R) / GRID) * GRID;
            for (let x = sx; x <= hx + R; x += GRID) {
                for (let y = sy; y <= hy + R; y += GRID) {
                    const dx = x - hx;
                    const dy = y - hy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d >= R) continue;
                    const a = (1 - d / R) * 0.12;
                    ctx!.fillStyle = `rgba(${r},${g},${bl},${a})`;
                    ctx!.fillRect(x - 1.25, y - 1.25, 2.5, 2.5);
                }
            }
        }

        function drawLogoDots() {
            const [r, g, bl] = logoState.accent;
            const cr = Math.min(255, r + 45);
            const cg = Math.min(255, g + 45);
            const cb = Math.min(255, bl + 45);
            for (const d of logoState.dots) {
                // faint persistent corner + bright highlight as the tracer passes
                const b = reveal * (0.22 + 0.78 * d.lit);
                if (b < 0.01) continue;
                const R = 12;
                const grad = ctx!.createRadialGradient(d.x, d.y, 0, d.x, d.y, R);
                grad.addColorStop(0, `rgba(${r},${g},${bl},${0.55 * b})`);
                grad.addColorStop(0.5, `rgba(${r},${g},${bl},${0.12 * b})`);
                grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
                ctx!.fillStyle = grad;
                ctx!.fillRect(d.x - R, d.y - R, R * 2, R * 2);
                // crisp core
                ctx!.fillStyle = `rgba(${cr},${cg},${cb},${0.9 * b})`;
                ctx!.fillRect(d.x - 1.5, d.y - 1.5, 3, 3);
            }
        }

        // faint, persistent glyph so the shape always reads
        function drawLogoOutline() {
            const [r, g, bl] = logoState.accent;
            ctx!.strokeStyle = `rgba(${r},${g},${bl},${0.16 * reveal})`;
            ctx!.lineWidth = 1.2;
            ctx!.lineCap = "round";
            ctx!.lineJoin = "round";
            for (const lp of logoState.loops) {
                ctx!.beginPath();
                ctx!.moveTo(lp.pts[0].x, lp.pts[0].y);
                for (let p = 1; p < lp.pts.length; p++) {
                    ctx!.lineTo(lp.pts[p].x, lp.pts[p].y);
                }
                if (lp.closed) ctx!.closePath();
                ctx!.stroke();
            }
        }

        // a bright comet running along a path
        function drawTracer(lp: LogoLoop) {
            const [r, g, bl] = logoState.accent;
            const TAIL = GRID * 4;
            const steps = 9;
            ctx!.lineCap = "round";
            ctx!.lineJoin = "round";
            ctx!.lineWidth = 1.7;
            ctx!.shadowColor = `rgba(${r},${g},${bl},${0.55 * reveal})`;
            ctx!.shadowBlur = 8;
            let prev = pointAt(lp, lp.dist - TAIL);
            for (let s = 1; s <= steps; s++) {
                const pt = pointAt(lp, lp.dist - TAIL + (TAIL * s) / steps);
                const a = (s / steps) * 0.55 * reveal; // brightest at the head
                ctx!.strokeStyle = `rgba(${r},${g},${bl},${a})`;
                ctx!.beginPath();
                ctx!.moveTo(prev.x, prev.y);
                ctx!.lineTo(pt.x, pt.y);
                ctx!.stroke();
                prev = pt;
            }
            ctx!.shadowBlur = 0;

            const R = 26;
            const orb = ctx!.createRadialGradient(
                lp.head.x,
                lp.head.y,
                0,
                lp.head.x,
                lp.head.y,
                R
            );
            orb.addColorStop(0, `rgba(${r},${g},${bl},${0.24 * reveal})`);
            orb.addColorStop(1, `rgba(${r},${g},${bl},0)`);
            ctx!.fillStyle = orb;
            ctx!.fillRect(lp.head.x - R, lp.head.y - R, R * 2, R * 2);
        }

        function drawPointerHalo() {
            if (pointer.x < -9000) return;
            const halo = ctx!.createRadialGradient(
                pointer.x,
                pointer.y,
                0,
                pointer.x,
                pointer.y,
                170
            );
            halo.addColorStop(0, "rgba(180,170,255,0.10)");
            halo.addColorStop(1, "rgba(180,170,255,0)");
            ctx!.fillStyle = halo;
            ctx!.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);
        }

        function frame(now: number) {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            ctx!.clearRect(0, 0, width, height);
            ctx!.globalCompositeOperation = "source-over";

            // ease pointer toward its target for a smooth halo
            if (pointer.target > -9000) {
                pointer.x += (pointer.target - pointer.x) * 0.15;
                pointer.y += (pointer.ty - pointer.y) * 0.15;
            }

            drawGrid();

            // --- symbol mode bookkeeping ---
            const key = activeKeyRef.current;
            const entry = key ? registryRef.current.get(key) : undefined;
            const desiredKey = entry ? key : null;

            if (desiredKey && desiredKey !== logoState.key) {
                const placed = placeSymbol(entry!.glyph.paths);
                logoState.key = desiredKey;
                logoState.dots = placed.dots;
                logoState.loops = placed.loops;
                logoState.accent = entry!.accent;
            } else if (!desiredKey && logoState.key && reveal < 0.01) {
                logoState.key = null;
                logoState.dots = [];
                logoState.loops = [];
            }

            const targetReveal = desiredKey ? 1 : 0;
            reveal += (targetReveal - reveal) * 0.08;

            const showLogo = reveal > 0.02 && logoState.loops.length > 0;

            if (!showLogo) {
                // advance live beams; cull any that have fully left the canvas
                for (let i = 0; i < beams.length; i++) {
                    const b = beams[i];
                    if (!b) continue;
                    b.head += b.dir * b.speed * dt;
                    const travel = b.axis === "h" ? width : height;
                    const exited =
                        b.dir === 1
                            ? b.head - b.len > travel
                            : b.head + b.len < 0;
                    if (exited) beams[i] = null;
                }
                // refill empty slots, each checked against all currently-live
                // beams (including ones accepted earlier this pass)
                for (let i = 0; i < beams.length; i++) {
                    if (!beams[i]) beams[i] = safeSpawn(beams);
                }
            } else {
                // fade highlights back toward the baseline, then advance each
                // tracer (accelerating) and light the vertices it passes
                for (const d of logoState.dots) d.lit *= 0.9;
                for (const lp of logoState.loops) {
                    lp.speed += (TRACER_MAX - lp.speed) * 0.025;
                    lp.dist += lp.speed * dt;
                    lp.head = pointAt(lp, lp.dist);
                    for (const d of logoState.dots) {
                        if (
                            Math.abs(d.x - lp.head.x) < GRID * 0.6 &&
                            Math.abs(d.y - lp.head.y) < GRID * 0.6
                        ) {
                            d.lit = 1;
                        }
                    }
                }
            }

            ctx!.globalCompositeOperation = "lighter";
            drawPointerHalo();
            if (showLogo) {
                drawLogoOutline();
                drawLogoDots();
                for (const lp of logoState.loops) drawTracer(lp);
            } else {
                for (const b of beams) if (b) drawBeam(b);
            }
            ctx!.globalCompositeOperation = "source-over";

            raf = requestAnimationFrame(frame);
        }

        function start() {
            if (raf) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        }
        function stop() {
            cancelAnimationFrame(raf);
            raf = 0;
        }

        const onPointerMove = (e: PointerEvent) => {
            const rect = canvas!.getBoundingClientRect();
            pointer.target = e.clientX - rect.left;
            pointer.ty = e.clientY - rect.top;
            if (pointer.x < -9000) {
                pointer.x = pointer.target;
                pointer.y = pointer.ty;
            }
        };
        const onPointerLeave = () => {
            pointer.target = -9999;
            pointer.ty = -9999;
            pointer.x = -9999;
            pointer.y = -9999;
        };

        const ro = new ResizeObserver(() => resize());
        ro.observe(canvas);

        const io = new IntersectionObserver(
            (entries) => {
                visible = entries[0]?.isIntersecting ?? true;
                if (reduceMotion) return;
                if (visible) start();
                else stop();
            },
            { threshold: 0 }
        );
        io.observe(canvas);

        resize();

        if (reduceMotion) {
            // static frame only
            ctx.clearRect(0, 0, width, height);
            drawGrid();
        } else {
            window.addEventListener("pointermove", onPointerMove);
            canvas.addEventListener("pointerleave", onPointerLeave);
            const onVisibility = () => {
                if (document.hidden) stop();
                else if (visible) start();
            };
            document.addEventListener("visibilitychange", onVisibility);
            start();

            return () => {
                stop();
                ro.disconnect();
                io.disconnect();
                window.removeEventListener("pointermove", onPointerMove);
                canvas.removeEventListener("pointerleave", onPointerLeave);
                document.removeEventListener("visibilitychange", onVisibility);
            };
        }

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 w-full h-full"
        />
    );
}
