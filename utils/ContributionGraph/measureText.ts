/**
 * Measures the width and height of the given text.
 *
 * @param text text to measure
 * @param ctx canvas context to use
 */
function measureText(text: string, ctx: CanvasRenderingContext2D) {
  const metrics = ctx.measureText(text);

  const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const height = metrics.actualBoundingBoxDescent;

  return { width, height };
}

export default measureText;
