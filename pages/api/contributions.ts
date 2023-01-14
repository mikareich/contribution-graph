import type { NextApiRequest, NextApiResponse } from "next";
import generateGraph from "../../utils/generateGraph";
import getContributions, {
  ContributionYear,
} from "../../utils/getContributions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContributionYear | { error: string }>
) {
  const { username, year } = req.query;

  try {
    if (!username || !year) {
      throw new Error("Missing username or year");
    }

    const contributions = await getContributions(
      username as string,
      Number(year)
    );

    res.status(200).json(contributions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message as string });
    }
  }
}
