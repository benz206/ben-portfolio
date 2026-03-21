import { useCallback } from "react";
import { gsap } from "gsap";

type HorizontalLoopConfig = {
    repeat?: number;
    paused?: boolean;
    reversed?: boolean;
    speed?: number;
    snap?: number | false;
    paddingRight?: number | string;
};

export function useHorizontalLoop() {
    return useCallback(
        (
            items: Element[] | NodeListOf<Element>,
            config: HorizontalLoopConfig = {},
        ) => {
            const tl = gsap.timeline({
                repeat: config.repeat,
                paused: config.paused,
                defaults: { ease: "none" },
                onReverseComplete: () => {
                    tl.totalTime(tl.rawTime() + tl.duration() * 100);
                },
            });
            const elements = gsap.utils.toArray(items) as HTMLElement[];
            const length = elements.length;
            if (length === 0) return tl;
            const startX = elements[0].offsetLeft;
            const times: number[] = [];
            const widths: number[] = [];
            const xPercents: number[] = [];
            let curIndex = 0;
            const pixelsPerSecond = (config.speed || 1) * 100;
            const snap =
                config.snap === false
                    ? (v: number) => v
                    : gsap.utils.snap(config.snap || 1);
            let totalWidth: number;
            let curX: number;
            let distanceToStart: number;
            let distanceToLoop: number;

            gsap.set(elements, {
                xPercent: (i: number, el: HTMLElement) => {
                    const w = (widths[i] = parseFloat(
                        gsap.getProperty(el, "width", "px") as string,
                    ));
                    xPercents[i] = snap(
                        (parseFloat(gsap.getProperty(el, "x", "px") as string) /
                            w) *
                            100 +
                            (gsap.getProperty(el, "xPercent") as number),
                    );
                    return xPercents[i];
                },
            });
            gsap.set(elements, { x: 0 });
            totalWidth =
                elements[length - 1].offsetLeft +
                (xPercents[length - 1] / 100) * widths[length - 1] -
                startX +
                elements[length - 1].offsetWidth *
                    (gsap.getProperty(
                        elements[length - 1],
                        "scaleX",
                    ) as number) +
                (parseFloat(String(config.paddingRight)) || 0);
            for (let i = 0; i < length; i += 1) {
                const item = elements[i];
                curX = (xPercents[i] / 100) * widths[i];
                distanceToStart = item.offsetLeft + curX - startX;
                distanceToLoop =
                    distanceToStart +
                    widths[i] * (gsap.getProperty(item, "scaleX") as number);
                tl.to(
                    item,
                    {
                        xPercent: snap(
                            ((curX - distanceToLoop) / widths[i]) * 100,
                        ),
                        duration: distanceToLoop / pixelsPerSecond,
                    },
                    0,
                )
                    .fromTo(
                        item,
                        {
                            xPercent: snap(
                                ((curX - distanceToLoop + totalWidth) /
                                    widths[i]) *
                                    100,
                            ),
                        },
                        {
                            xPercent: xPercents[i],
                            duration:
                                (curX - distanceToLoop + totalWidth - curX) /
                                pixelsPerSecond,
                            immediateRender: false,
                        },
                        distanceToLoop / pixelsPerSecond,
                    )
                    .add("label" + i, distanceToStart / pixelsPerSecond);
                times[i] = distanceToStart / pixelsPerSecond;
            }
            function toIndex(index: number, vars: gsap.TweenVars = {}) {
                Math.abs(index - curIndex) > length / 2 &&
                    (index += index > curIndex ? -length : length);
                const newIndex = gsap.utils.wrap(0, length, index) as number;
                let time = times[newIndex];
                if (time > tl.time() !== index > curIndex) {
                    vars.modifiers = {
                        time: gsap.utils.wrap(0, tl.duration()),
                    } as gsap.TweenVars["modifiers"];
                    time += tl.duration() * (index > curIndex ? 1 : -1);
                }
                curIndex = newIndex;
                vars.overwrite = true;
                return tl.tweenTo(time, vars);
            }
            (
                tl as gsap.core.Timeline & {
                    next: (vars?: gsap.TweenVars) => void;
                }
            ).next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
            (
                tl as gsap.core.Timeline & {
                    previous: (vars?: gsap.TweenVars) => void;
                }
            ).previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
            (tl as gsap.core.Timeline & { current: () => number }).current =
                () => curIndex;
            (
                tl as gsap.core.Timeline & {
                    toIndex: (index: number, vars?: gsap.TweenVars) => void;
                }
            ).toIndex = (index: number, vars?: gsap.TweenVars) =>
                toIndex(index, vars);
            (tl as gsap.core.Timeline & { times: number[] }).times = times;
            tl.progress(1, true).progress(0, true);
            if (config.reversed) {
                tl.vars.onReverseComplete?.();
                tl.reverse();
            }
            return tl;
        },
        [],
    );
}
