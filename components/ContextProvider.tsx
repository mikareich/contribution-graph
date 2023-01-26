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
  initialTheme: ColorTheme;
  font: NextFontWithVariable;
}

interface Context {
  theme: [ColorTheme, Dispatch<SetStateAction<ColorTheme>>];
  blobURL: [string, Dispatch<SetStateAction<string>>];
}

const ThemeContext = createContext<Context | null>(null);

export const useTheme = () => {
  const [theme, setTheme] = useContext(ThemeContext)!.theme;

  return [theme, setTheme] as const;
};

export const useBlobURL = () => {
  const [blobURL, setBlobURL] = useContext(ThemeContext)!.blobURL;

  return [blobURL, setBlobURL] as const;
};

export default function ContextProvider({
  initialTheme,
  font,
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  const [theme, setTheme] = useState(initialTheme);
  const [blobURL, setBlobURL] = useState("");

  useEffect(() => {
    if (!theme) return;

    const variables: Record<string, string> = {
      "--primary-color": theme.primary,
      "--text-color": theme.text,
      "--text-color-light": theme.textLight,
      "--text-on-primary-color": theme.textOnPrimary,
      "--link-color": theme.link,
      "--background-color": theme.background,
      "--border-color": theme.border,
    };

    theme.contributionLevels.forEach((level, index) => {
      variables[`--contribution-level-${index + 1}`] = level;
    });

    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    document.documentElement.classList.add(font.variable);
  }, [theme, font]);

  return (
    <ThemeContext.Provider
      value={{
        theme: [theme, setTheme],
        blobURL: [blobURL, setBlobURL],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
