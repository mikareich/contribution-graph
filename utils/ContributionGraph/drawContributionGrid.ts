import { GlobalOptions } from ".";
import { ContributionLevel } from "../getContributions";
import { ColorTheme } from "../themes";
import drawContributionBox from "./drawContributionBox";

function drawContributionGrid(
  ctx: CanvasRenderingContext2D,
  startPosition: { x: number; y: number },
  grid: ContributionLevel[][],
  contributionBoxOptions: GlobalOptions["contributionBox"],
  theme: ColorTheme
) {
  const { size, spacing } = contributionBoxOptions;
  const boxSize = size + spacing;

  const globalOptions = {
    contributionBox: contributionBoxOptions,
    colorTheme: theme,
  } as GlobalOptions;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const position = {
        x: col * boxSize + startPosition.x,
        y: row * boxSize + startPosition.y,
      };
      const level = grid[row][col];

      drawContributionBox(ctx, globalOptions, level, position);
    }
  }
}

export default drawContributionGrid;
