import { createCanvas, CanvasRenderingContext2D, Canvas } from "canvas";
import {
  CONTIBUTION_LEVELS,
  ContributionDay,
  ContributionLevel,
  ContributionYear,
  getContributionsByDate,
} from "./getContributions";
import { ColorTheme, GITHUB_LIGHT } from "./themes";

const measureText = (ctx: CanvasRenderingContext2D, text: string) => {
  const metrics = ctx.measureText(text);

  const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const height = metrics.actualBoundingBoxDescent;

  return { width, height };
};

/**
 * Represents a contribution graph visualization for a user.
 */
class ContributionGraph {
  static OPTIONS = {
    padding: 20,
    fontFamily: "IBM Plex Mono",
    typeScale: {
      header: 1.5,
      body: 0.875,
      small: 0.75,
    },
    boxSize: 12,
    boxMargin: 5,
    headerHeight: 100,
    yearGap: 20,
  };

  public static readonly NUMBER_OF_WEEKS = 53;

  public static readonly NUMBER_OF_DAYS = 7 * ContributionGraph.NUMBER_OF_WEEKS;

  public static readonly MONTHS_OF_YEAR = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  public readonly contributions: ContributionYear[];

  public readonly username: string;

  public readonly colorTheme: ColorTheme;

  public readonly ctx: CanvasRenderingContext2D;

  public readonly canvas: Canvas;

  public readonly width: number;

  public readonly height: number;

  public headerHeight: number = 100;

  public yearHeight: number = 200;

  get contributionSpan() {
    const { contributions } = this;
    const firstDate = new Date(contributions[0].date);
    const lastDate = new Date(contributions[contributions.length - 1].date);

    return [firstDate.getFullYear(), lastDate.getFullYear()];
  }

  get totalContributions() {
    const total = this.contributions.reduce(
      (acc, curr) => acc + curr.contributionCount,
      0
    );

    return total;
  }

  constructor(
    username: string,
    contributions: ContributionYear[],
    colorPalette: ColorTheme = GITHUB_LIGHT,
    scale: number = 2
  ) {
    this.contributions = contributions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.username = username;
    this.colorTheme = colorPalette;

    // calucalte width and height
    this.width =
      2 * ContributionGraph.OPTIONS.padding +
      ContributionGraph.NUMBER_OF_WEEKS *
        (ContributionGraph.OPTIONS.boxSize +
          ContributionGraph.OPTIONS.boxMargin);

    this.height =
      this.headerHeight +
      this.contributions.length *
        (this.yearHeight + ContributionGraph.OPTIONS.yearGap) +
      2 * ContributionGraph.OPTIONS.padding;

    // create canvas
    this.canvas = createCanvas(this.width * scale, this.height * scale);
    this.ctx = this.canvas.getContext("2d");

    this.ctx.scale(scale, scale);

    this.ctx.textBaseline = "top";

    this.drawBackground();
    this.drawHeader();
    this.drawAllContributionYears();
  }

  drawBackground() {
    const { ctx, colorTheme } = this;
    const { background } = colorTheme;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawHeader() {
    const { ctx, colorTheme } = this;
    const { text, textLight } = colorTheme;
    const { padding, fontFamily, typeScale, boxSize, boxMargin } =
      ContributionGraph.OPTIONS;

    // draw header
    const headerText = `@${this.username} on GitHub`;
    ctx.font = `${typeScale.header}rem ${fontFamily}`;
    ctx.fillStyle = text;

    ctx.fillText(headerText, padding, padding);
    const headerHeight = measureText(ctx, headerText).height;

    // draw legend
    const legendDescriptionMargin = 10;
    const legendText = ["less", "more"];

    ctx.font = `${typeScale.small}rem ${fontFamily}`;
    ctx.fillStyle = textLight;
    const legendSize = [
      measureText(ctx, legendText[0]),
      measureText(ctx, legendText[1]),
    ];

    const legendHeight = Math.max(legendSize[0].height, legendSize[1].height);
    const baseline = padding + (headerHeight - legendHeight);

    const rightLegendX = this.width - padding - legendSize[1].width;
    const leftLegendX =
      rightLegendX -
      2 * legendDescriptionMargin -
      5 * (boxMargin + boxSize) -
      legendSize[0].width;

    // draw "less" and "more"

    ctx.fillText(legendText[0], leftLegendX, baseline);
    ctx.fillText(legendText[1], rightLegendX, baseline);

    // draw boxes

    let boxX = rightLegendX - legendDescriptionMargin;
    CONTIBUTION_LEVELS.forEach((level) => {
      boxX = boxX - boxMargin - boxSize;

      this.drawContribution(
        (4 - level) as ContributionLevel,
        boxX,
        baseline + (legendHeight - boxSize)
      );
    });

    // draw line
    const lineY = padding + headerHeight + 10;
    ctx.strokeStyle = colorTheme.contributionLevels[0];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, lineY);
    ctx.lineTo(this.width - padding, lineY);
    ctx.stroke();
  }

  drawYear(contributionYear: ContributionYear, yCoord: number) {
    const { ctx, colorTheme: colorPalette } = this;
    const { text, textLight } = colorPalette;
    const { padding, fontFamily, typeScale, boxSize, boxMargin } =
      ContributionGraph.OPTIONS;

    const { MONTHS_OF_YEAR, NUMBER_OF_DAYS } = ContributionGraph;

    const contributionDate = new Date(contributionYear.date);
    const fullYear = contributionDate.getFullYear();
    const firstDay = new Date(fullYear, 0, 1);

    // draw year text

    ctx.font = `${typeScale.small}rem ${fontFamily}`;
    ctx.fillStyle = text;

    const yearText = `${fullYear.toString()}: ${
      contributionYear.contributionCount
    } contributions`;
    const yearHeight = measureText(ctx, yearText).height;
    const yearBaseline = yCoord;

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

    const monthSizes = MONTHS_OF_YEAR.map((month) => measureText(ctx, month));
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

      const currentXCoord = padding + weekIndex * (boxSize + boxMargin); // x coord of the contribution box
      const currentYCoord =
        weekday * (boxSize + boxMargin) + monthBaseline + monthHeight + 5; // y coord of the contribution box
      this.drawContribution(
        contributionDay?.contributionLevel || 0,
        currentXCoord,
        currentYCoord
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

  drawAllContributionYears() {
    const { yearGap } = ContributionGraph.OPTIONS;

    this.contributions.forEach((year, index) => {
      this.drawYear(
        year,
        this.headerHeight + index * (this.yearHeight + yearGap)
      );
    });
  }

  drawContribution(
    level: ContributionDay["contributionLevel"],
    x: number,
    y: number
  ) {
    const { ctx, colorTheme: colorPalette } = this;
    const { contributionLevels } = colorPalette;
    const { boxSize } = ContributionGraph.OPTIONS;

    ctx.fillStyle = contributionLevels[level];
    ctx.fillRect(x, y, boxSize, boxSize);
  }

  generateImageDataURL() {
    return this.canvas.toDataURL();
  }
}

export default ContributionGraph;
