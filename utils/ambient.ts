export type AmbientOptions = {
    colors?: [string, string];
    blur?: number;
    noise?: number;
    spotColor?: string;
    spotSize?: string | number;
    opacity?: number;
    followStrength?: number;
    damping?: number;
};

export function attachAmbient(element: HTMLElement | null, options: AmbientOptions = {}) {
    if (!element) return { destroy() {}, update() {} } as const;

    const {
        colors = ["#6d5efc", "#ff6ec7"],
        blur = 80,
        noise = 0.04,
        spotColor = "rgba(255,255,255,0.18)",
        spotSize = "40%",
        opacity = 0.9,
        followStrength = 0.06,
        damping = 0.12,
    } = options;

    element.style.setProperty("--ambient-color-1", colors[0] || "#6d5efc");
    element.style.setProperty("--ambient-color-2", colors[1] || "#ff6ec7");
    element.style.setProperty("--ambient-blur", `${blur}px`);
    element.style.setProperty("--ambient-noise-opacity", String(noise));
    element.style.setProperty("--ambient-spot-color", spotColor);
    element.style.setProperty(
        "--ambient-spot-size",
        typeof spotSize === "number" ? `${spotSize}%` : spotSize
    );
    element.style.setProperty("--ambient-opacity", String(opacity));

    let rect = element.getBoundingClientRect();
    let targetTx = 0;
    let targetTy = 0;
    let currentTx = 0;
    let currentTy = 0;
    let rafId: number | null = null;
    let isInside = false;

    function updateRect() {
        rect = element.getBoundingClientRect();
    }

    function onPointerMove(e: PointerEvent) {
        isInside = true;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = Math.max(0, Math.min(1, x / rect.width));
        const py = Math.max(0, Math.min(1, y / rect.height));
        element.style.setProperty("--mx", `${px * 100}%`);
        element.style.setProperty("--my", `${py * 100}%`);

        const cx = px - 0.5;
        const cy = py - 0.5;
        targetTx = cx * rect.width * followStrength;
        targetTy = cy * rect.height * followStrength;
        loop();
    }

    function onPointerLeave() {
        isInside = false;
        targetTx = 0;
        targetTy = 0;
        loop();
    }

    function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    function loop() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
    }

    function tick() {
        currentTx = lerp(currentTx, targetTx, damping);
        currentTy = lerp(currentTy, targetTy, damping);
        element.style.setProperty("--tx", `${currentTx}px`);
        element.style.setProperty("--ty", `${currentTy}px`);

        const moving =
            Math.abs(currentTx - targetTx) > 0.1 ||
            Math.abs(currentTy - targetTy) > 0.1;
        if (moving || isInside) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
        }
    }

    const ro = new ResizeObserver(updateRect);
    ro.observe(element);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });

    updateRect();

    return {
        destroy() {
            if (rafId) cancelAnimationFrame(rafId);
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            element.removeEventListener("pointerleave", onPointerLeave);
        },
        update(next: AmbientOptions = {}) {
            if (next.colors) {
                element.style.setProperty(
                    "--ambient-color-1",
                    next.colors[0] || colors[0]
                );
                element.style.setProperty(
                    "--ambient-color-2",
                    next.colors[1] || colors[1]
                );
            }
            if (next.blur != null)
                element.style.setProperty("--ambient-blur", `${next.blur}px`);
            if (next.noise != null)
                element.style.setProperty(
                    "--ambient-noise-opacity",
                    String(next.noise)
                );
            if (next.spotColor)
                element.style.setProperty(
                    "--ambient-spot-color",
                    next.spotColor
                );
            if (next.spotSize)
                element.style.setProperty(
                    "--ambient-spot-size",
                    typeof next.spotSize === "number"
                        ? `${next.spotSize}%`
                        : next.spotSize
                );
            if (next.opacity != null)
                element.style.setProperty(
                    "--ambient-opacity",
                    String(next.opacity)
                );
        },
    } as const;
}


