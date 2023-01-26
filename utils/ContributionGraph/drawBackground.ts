import { GlobalOptions } from "./index";

function drawBackground(
  ctx: CanvasRenderingContext2D,
  { colorTheme, totalWidth, totalHeight }: GlobalOptions
) {
  ctx.fillStyle = colorTheme.background;
  ctx.fillRect(0, 0, totalWidth, totalHeight);
}

export default drawBackground;
