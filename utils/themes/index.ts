export interface ColorTheme {
  name: string;

  primary: string;
  error: string;

  background: string;

  text: string;
  textLight: string;
  textOnPrimary: string;
  link: string;

  border: string;

  contributionLevels: [string, string, string, string, string];
}

import DRACULA from "./dracula";
import { GITHUB_LIGHT, GITHUB_DARK } from "./github";
import MATERIAL_THEME from "./material";
import VSCODE from "./vscode";

const themes = [GITHUB_LIGHT, GITHUB_DARK, DRACULA, MATERIAL_THEME, VSCODE];
export default themes;

export { DRACULA, GITHUB_LIGHT, GITHUB_DARK, MATERIAL_THEME, VSCODE };
