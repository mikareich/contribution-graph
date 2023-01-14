import ContributionGraph from "./ContributionGraph";
import { ContributionYear } from "./getContributions";

export default function generateGraph(
  username: string,
  contributions: ContributionYear[]
) {
  const graph = new ContributionGraph(username, contributions);
  return graph.generateImageDataURL();
}
