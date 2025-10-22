import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa6";

export default function ToggleDLMode() {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white"
        >
            {currentTheme === "light" ? <FaSun /> : <FaMoon />}
        </button>
    );
}
