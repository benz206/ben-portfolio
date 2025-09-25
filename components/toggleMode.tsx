import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa6";

export default function ToggleDLMode() {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="p-2 my-auto -mr-5 text-2xl text-white transition-all duration-100 rounded-lg lg:text-lg lg:-ml-5 lg:mr-0"
        >
            {currentTheme === "light" ? <FaSun /> : <FaMoon />}
        </button>
    );
}
