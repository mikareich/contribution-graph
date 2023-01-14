import type { NextApiRequest, NextApiResponse } from "next";
import generateGraph from "../../utils/generateGraph";
import getContributions, {
  ContributionYear,
} from "../../utils/getContributions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { error: string }>
) {
  const { username } = req.query;

  try {
    if (!username) {
      throw new Error("Missing username");
    }

    const years = [2018, 2016, 2019, 2020, 2022, 2023];
    const contributions = await Promise.all(
      years.map((year) => getContributions(username as string, year))
    );

    const graph = generateGraph(username as string, contributions);
    const data = graph.replace(/^data:image\/png;base64,/, "");
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
