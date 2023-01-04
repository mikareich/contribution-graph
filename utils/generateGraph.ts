import { ContributionYear } from "./getContributions";

interface ColorPalette {
  background: string;
  text: string;
  textLight: string;
  levels: [string, string, string, string, string, string];
}

const DEFAULT_COLOR_PALETTE: ColorPalette = {
  background: "#ffffff",
  text: "#000000",
  textLight: "#666666",
  levels: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127", "#0f3d0f"],
};

export default function generateGraph(
  username: string,
  contributions: ContributionYear[],
  colorPalette: ColorPalette = DEFAULT_COLOR_PALETTE
) {
  const BOX_SIZE = 10;
  const BOX_SPACING = 2;
  const CANVAS_PADDING = 20;
}
