import {
  ContributionYear,
  CONTIBUTION_LEVELS,
  ContributionLevel,
} from "../getContributions";
import drawContributionBox from "./drawContributionBox";
import { GlobalOptions } from "./index";
import measureText from "./measureText";

interface Metadata {
  readonly name: string;
  readonly contributions: ContributionYear[];
}

interface MetadataOptions {
  drawHorizontalLine?: boolean;
  drawLegend?: boolean;
  showTotalContributions?: boolean;
}

function drawMetadata(
  ctx: CanvasRenderingContext2D,
  globalOptions: GlobalOptions,
  metadata: Metadata,
  options: MetadataOptions = {
    drawHorizontalLine: true,
    drawLegend: true,
    showTotalContributions: false,
  }
) {
  const { name } = metadata;
  const {
    colorTheme,
    padding,
    fontFamily,
    typeScale,
    contributionBox,
    totalWidth,
  } = globalOptions;

  // draw header
  const headerText = `@${name} on GitHub`;
  ctx.font = `${typeScale.header}rem ${fontFamily}`;
  ctx.fillStyle = colorTheme.text;

  ctx.fillText(headerText, padding, padding);
  const headerHeight = measureText(headerText, ctx).height;

  // draw legend
  if (options.drawLegend) {
    const legendDescriptionMargin = 10;
    const legendText = ["less", "more"];

    ctx.font = `${typeScale.small}rem ${fontFamily}`;
    ctx.fillStyle = colorTheme.textLight;
    const legendSize = [
      measureText(legendText[0], ctx),
      measureText(legendText[1], ctx),
    ];

    const legendHeight = Math.max(legendSize[0].height, legendSize[1].height);
    const baseline = padding + (headerHeight - legendHeight);

    const rightLegendX = totalWidth - padding - legendSize[1].width;
    const leftLegendX =
      rightLegendX -
      2 * legendDescriptionMargin -
      5 * (contributionBox.spacing + contributionBox.size) -
      legendSize[0].width;

    // draw "less" and "more"

    ctx.fillText(legendText[0], leftLegendX, baseline);
    ctx.fillText(legendText[1], rightLegendX, baseline);

    // draw boxes

    let boxX = rightLegendX - legendDescriptionMargin;
    CONTIBUTION_LEVELS.forEach((level) => {
      if (level === -1) return;
      boxX = boxX - contributionBox.spacing - contributionBox.size;

      drawContributionBox(
        ctx,
        globalOptions,
        (4 - level) as ContributionLevel,
        {
          x: boxX,
          y: baseline + (legendHeight - contributionBox.size),
        }
      );
    });
  }

  // draw line
  if (options.drawHorizontalLine) {
    const lineY = padding + headerHeight + 10;
    ctx.strokeStyle = colorTheme.contributionLevels[0];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, lineY);
    ctx.lineTo(totalWidth - padding, lineY);
    ctx.stroke();
  }
}

export default drawMetadata;
