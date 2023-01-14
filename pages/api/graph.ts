import type { NextApiRequest, NextApiResponse } from "next";
import ContributionGraph from "../../utils/ContributionGraph";
import getAllContributions from "../../utils/getAllContributions";
import themes from "../../utils/themes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { error: string }>
) {
  const { username, theme: themeName } = req.query as {
    username: string;
    theme?: string;
  };
  const theme = themes.find((theme) => theme.name === themeName);

  try {
    if (!username) {
      throw new Error("Missing username");
    }

    const contributions = await getAllContributions(username as string);
    const graph = new ContributionGraph(username, contributions, theme);

    const data = graph
      .generateImageDataURL()
      .replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(data, "base64");

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", buffer.length);
    res.status(200).send(buffer as unknown as string);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message as string });
    }
  }
}
