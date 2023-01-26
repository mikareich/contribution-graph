import { CONTRIBUTION_BOX_OPTIONS } from "./index";
import { ContributionLevel } from "../getContributions";
import { ColorTheme } from "../themes";
import drawContributionGrid from "./drawContributionGrid";

function errorAnimation(canvas: HTMLCanvasElement, theme: ColorTheme) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const { size: BOX_SIZE, spacing: BOX_SPACING } = CONTRIBUTION_BOX_OPTIONS;

  const cols = 12;
  const rows = 8;

  const WIDTH = cols * (BOX_SIZE + BOX_SPACING);
  const HEIGHT = rows * (BOX_SIZE + BOX_SPACING);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // set background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // generate random grid
  const grid: ContributionLevel[][] = [];
  for (let row = 0; row < rows; row++) {
    grid.push([]);
    for (let col = 0; col < cols; col++) {
      const showError = Math.random();
      grid[row].push(showError > 0.5 ? -1 : 0);
    }
  }

  const startPosition = { x: 0, y: 0 };
  drawContributionGrid(
    ctx,
    startPosition,
    grid,
    CONTRIBUTION_BOX_OPTIONS,
    theme
  );
}

export default errorAnimation;
