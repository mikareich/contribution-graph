import { ContributionYear } from "../getContributions";
import { ColorTheme } from "../themes";
import drawBackground from "./drawBackground";
import drawMetadata from "./drawMetadata";
import drawYear from "./drawYear";

interface UserDetail {
  name: string;
  contributions: ContributionYear[];
}

export interface GlobalOptions {
  readonly totalWidth: number;
  readonly totalHeight: number;
  readonly padding: number;

  readonly colorTheme: ColorTheme;

  readonly fontFamily: string;
  readonly typeScale: {
    header: number;
    body: number;
    small: number;
  };

  readonly contributionBox: {
    size: number;
    spacing: number;
  };

  readonly headerHeight: number;
  readonly yearHeight: number;
  readonly yearGap: number;
}

export const NUMBER_OF_WEEKS = 53;

export const NUMBER_OF_DAYS = 7 * NUMBER_OF_WEEKS;

export const MONTHS_OF_YEAR = [
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

export const CONTRIBUTION_BOX_OPTIONS: GlobalOptions["contributionBox"] = {
  size: 12,
  spacing: 5,
};

/** Generates a graph of the user's contributions on the given canvas. */
function generateGraph(
  user: UserDetail,
  canvas: HTMLCanvasElement,
  theme: ColorTheme,
  scale: number = 2
) {
  const PADDING = 20;
  const HEADER_HEIGHT = 100;
  const YEAR_HEIGHT = 200;
  const YEAR_GAP = 20;
  const BOX_SIZE = 12;
  const BOX_SPACING = 5;

  const WIDTH = 2 * PADDING + NUMBER_OF_WEEKS * (BOX_SIZE + BOX_SPACING);

  const HEIGHT =
    HEADER_HEIGHT +
    user.contributions.length * (YEAR_HEIGHT + YEAR_GAP) +
    2 * PADDING;

  const GLOBAL_OPTIONS: GlobalOptions = {
    padding: PADDING,
    fontFamily: "IBM Plex Mono",
    typeScale: {
      header: 1.5,
      body: 0.875,
      small: 0.75,
    },
    contributionBox: CONTRIBUTION_BOX_OPTIONS,
    headerHeight: HEADER_HEIGHT,
    yearGap: YEAR_GAP,
    yearHeight: YEAR_HEIGHT,
    colorTheme: theme,
    totalWidth: WIDTH,
    totalHeight: HEIGHT,
  };

  canvas.width = WIDTH * scale;
  canvas.height = HEIGHT * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  drawBackground(ctx, GLOBAL_OPTIONS);
  drawMetadata(ctx, GLOBAL_OPTIONS, user);

  // sort user contributions by year
  user.contributions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  user.contributions.forEach((year, index) => {
    const y = HEADER_HEIGHT + index * (YEAR_HEIGHT + YEAR_GAP) + PADDING;
    drawYear(ctx, GLOBAL_OPTIONS, year, y);
  });

  return canvas;
}

export default generateGraph;
