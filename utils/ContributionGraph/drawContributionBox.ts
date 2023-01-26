import { ContributionLevel } from "../getContributions";
import { GlobalOptions } from "./index";

/**
 * Draws a contribution box at the given position with the given level of contribution.
 *
 * @param ctx the canvas context to draw the contribution box on
 * @param globalOptions the global options for the graph
 * @param level the level of contribution to draw
 * @param position the position at which to draw the contribution box
 * @param graph the graph generator to draw the contribution box on
 */

function drawContributionBox(
  ctx: CanvasRenderingContext2D,
  { contributionBox, colorTheme }: GlobalOptions,
  level: ContributionLevel,
  position: {
    x: number;
    y: number;
  }
) {
  const isError = level === -1;
  ctx.fillStyle = isError
    ? colorTheme.error
    : colorTheme.contributionLevels[level];

  ctx.fillRect(
    position.x,
    position.y,
    contributionBox.size,
    contributionBox.size
  );
}

export default drawContributionBox;
