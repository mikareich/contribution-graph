import { CONTRIBUTION_BOX_OPTIONS, GlobalOptions } from "./index";
import { ContributionLevel } from "../getContributions";
import { ColorTheme } from "../themes";
import drawContributionGrid from "./drawContributionGrid";

function loadingAnimation(canvas: HTMLCanvasElement, theme: ColorTheme) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const WIDTH = 204;
  const HEIGHT = 136;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const { size: BOX_SIZE, spacing: BOX_SPACING } = CONTRIBUTION_BOX_OPTIONS;

  // set background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const startPosition = { x: 0, y: 0 };

  const cols = Math.round(WIDTH / (BOX_SIZE + BOX_SPACING));
  const rows = Math.round(HEIGHT / (BOX_SIZE + BOX_SPACING));

  const ANIMATION_SPEED = 1000 / 10;

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // generate random grid
    const grid: ContributionLevel[][] = [];
    for (let row = 0; row < rows; row++) {
      grid.push([]);
      for (let col = 0; col < cols; col++) {
        grid[row].push(Math.floor(Math.random() * 4) as ContributionLevel);
      }
    }

    drawContributionGrid(
      ctx,
      startPosition,
      grid,
      CONTRIBUTION_BOX_OPTIONS,
      theme
    );
  }, ANIMATION_SPEED);

  return () => clearInterval(interval);
}

export default loadingAnimation;
