import { gql } from "@apollo/client";
import client from "./apolloClient";
import getContributions, { ContributionYear } from "./getContributions";

const GET_USER_CREATED_AT = (username: string) => gql`
    query {
        user(login: "${username}") {
            createdAt
        }
    }
`;

export default async function getAllContributions(
  username: string
): Promise<ContributionYear[]> {
  const { data } = await client.query({
    query: GET_USER_CREATED_AT(username),
  });
  const createdAt = new Date(data.user.createdAt);

  const contributionYears: ContributionYear[] = [];
  for (
    let year = createdAt.getFullYear();
    year <= new Date().getFullYear();
    year++
  ) {
    const contributions = await getContributions(username, year);
    contributionYears.push(contributions);
  }

  return contributionYears;
}
