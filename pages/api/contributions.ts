import type { NextApiRequest, NextApiResponse } from "next";
import getAllContributions from "../../utils/getAllContributions";
import getContributions, {
  ContributionYear,
} from "../../utils/getContributions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContributionYear[] | { error: string }>
) {
  const { username, year } = req.query;

  try {
    if (!username) throw new Error("Missing username");

    let contributions: ContributionYear[];

    if (year) {
      contributions = [
        await getContributions(username as string, Number(year)),
      ];
    } else {
      contributions = await getAllContributions(username as string);
    }

    res.status(200).json(contributions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message as string });
    }
  }
}
