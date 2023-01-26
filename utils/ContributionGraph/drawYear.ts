import { ContributionYear, getContributionsByDate } from "../getContributions";
import drawContributionBox from "./drawContributionBox";
import { MONTHS_OF_YEAR, NUMBER_OF_DAYS, GlobalOptions } from "./index";
import measureText from "./measureText";

/**
 * Draws a year of contributions on the graph.
 *
 * @param contributionYear the year of contributions to draw
 * @param startY the y coordinate at which to start drawing the year
 * @param graph the graph generator to draw the year on
 */
function drawYear(
  ctx: CanvasRenderingContext2D,
  globalOptions: GlobalOptions,
  contributionYear: ContributionYear,
  startY: number
) {
  const { padding, fontFamily, typeScale, contributionBox, colorTheme } =
    globalOptions;
  const { text, textLight } = colorTheme;

  const contributionDate = new Date(contributionYear.date);
  const fullYear = contributionDate.getFullYear();
  const firstDay = new Date(fullYear, 0, 1);

  // draw year text

  ctx.font = `${typeScale.small}rem ${fontFamily}`;
  ctx.fillStyle = text;

  const yearText = `${fullYear.toString()}: ${
    contributionYear.contributionCount
  } contributions`;
  const yearHeight = measureText(yearText, ctx).height;
  const yearBaseline = startY;

  ctx.fillText(
    `${fullYear.toString()}: ${
      contributionYear.contributionCount
    } contributions`,
    padding,
    yearBaseline
  );

  // calculate month coords and dimensions
  ctx.font = `${typeScale.small}rem ${fontFamily}`;
  ctx.fillStyle = textLight;

  const monthSizes = MONTHS_OF_YEAR.map((month) => measureText(month, ctx));
  const monthHeight = Math.max(...monthSizes.map((size) => size.height));
  const monthBaseline = yearBaseline + yearHeight + 10;

  // draw contributions

  const contributionDays = contributionYear.contributionWeeks
    .map((week) => week.contributionDays)
    .flat(2);

  for (let dayIndex = 0; dayIndex < NUMBER_OF_DAYS; dayIndex++) {
    const currentTimestamp =
      contributionDate.getTime() + dayIndex * 24 * 60 * 60 * 1000;
    const currentDate = new Date(currentTimestamp);

    const contributionDay = getContributionsByDate(
      contributionDays,
      currentDate
    );

    // if the current date is not in the current year, stop drawing
    if (currentDate.getFullYear() !== fullYear) return;

    const weekday = currentDate.getDay();
    const weekIndex = Math.floor((dayIndex + firstDay.getDay()) / 7);
    const month = currentDate.getMonth();

    const currentXCoord =
      padding + weekIndex * (contributionBox.size + contributionBox.spacing); // x coord of the contribution box
    const currentYCoord =
      weekday * (contributionBox.size + contributionBox.spacing) +
      monthBaseline +
      monthHeight +
      5; // y coord of the contribution box
    drawContributionBox(
      ctx,
      globalOptions,
      contributionDay?.contributionLevel || 0,
      {
        x: currentXCoord,
        y: currentYCoord,
      }
    );

    // draw month text
    ctx.font = `${typeScale.small}rem ${fontFamily}`;
    ctx.fillStyle = textLight;

    if (dayIndex === 0) {
      ctx.fillText(MONTHS_OF_YEAR[month], currentXCoord, monthBaseline);
    } else if (weekday === 0 && month !== 0) {
      const previousMonth = new Date(
        currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).getMonth();

      if (previousMonth !== month) {
        ctx.fillText(MONTHS_OF_YEAR[month], currentXCoord, monthBaseline);
      }
    }
  }
}

export default drawYear;
