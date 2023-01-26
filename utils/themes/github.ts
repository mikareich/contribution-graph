import { ColorTheme } from "./index";

export const GITHUB_LIGHT: ColorTheme = {
  name: "GitHub Light",
  primary: "#2da44e",
  error: "#cb2431",
  background: "#ffffff",
  text: "#24292f",
  textLight: "#6e7781",
  textOnPrimary: "#ffffff",
  link: "#1a7f37",
  border: "#d0d7de",
  contributionLevels: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
};

export const GITHUB_DARK: ColorTheme = {
  name: "GitHub Dark",
  primary: "#238636",
  error: "#d73a49",
  background: "#0d1117",
  text: "#c9d1d9",
  textLight: "#6e7681",
  textOnPrimary: "#c9d1d9",
  link: "#3fb950",
  border: "#30363d",
  contributionLevels: ["#161b22", "#0e4429", "#006d32", "#26A641", "#39D353"],
};

export default GITHUB_LIGHT;
