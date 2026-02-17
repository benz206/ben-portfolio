import { useEffect, useState } from "react";

export function useTypedText(text: string, speedMs: number) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let i = 0;
        setTypedText("");
        const interval = setInterval(() => {
            i += 1;
            setTypedText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
            }
        }, speedMs);
        return () => clearInterval(interval);
    }, [text, speedMs]);

    return typedText;
}
