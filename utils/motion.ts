import { easeInOut, type Variants } from "framer-motion";

/**
 * Shared Framer Motion presets. Use the factories when the offset/timing
 * varies per call site; keep bespoke one-off animations inline.
 */

/** Scroll-triggered fade-and-rise variants (GitHub views). */
export const fadeIn: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeInOut },
    },
};

/** Fade-and-rise on mount via initial/animate props. */
export function fadeUp(y = 24, duration = 0.6) {
    return {
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
        transition: { duration, ease: "easeInOut" as const },
    };
}

/** Fade-and-rise when scrolled into view via whileInView/viewport props. */
export function inView(y = 24, amount = 0.4, duration = 0.6) {
    return {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount },
        transition: { duration, ease: "easeInOut" as const },
    };
}
