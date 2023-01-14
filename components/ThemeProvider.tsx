import { NextFontWithVariable } from "@next/font/dist/types";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorTheme } from "../utils/themes";

interface ThemeProviderProps {
  theme: ColorTheme;
  font: NextFontWithVariable;
}

const ThemeContext = createContext<
  [ColorTheme, Dispatch<SetStateAction<ColorTheme>>] | null
>(null);

export const useTheme = () => {
  const [theme, setTheme] = useContext(ThemeContext)!;

  return [theme, setTheme] as const;
};

export default function ThemeProvider({
  theme,
  font,
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  const [currentTheme, setTheme] = useState(theme);
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentTheme) return;

    setCssVariables(() => {
      const variables: typeof cssVariables = {
        "--primary-color": currentTheme.primary,
        "--text-color": currentTheme.text,
        "--text-color-light": currentTheme.textLight,
        "--text-on-primary-color": currentTheme.textOnPrimary,
        "--link-color": currentTheme.link,
        "--background-color": currentTheme.background,
        "--border-color": currentTheme.border,
      };

      currentTheme.contributionLevels.forEach((level, index) => {
        variables[`--contribution-level-${index + 1}`] = level;
      });

      return variables;
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={[currentTheme, setTheme]}>
      <div className={font.variable} style={cssVariables}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
