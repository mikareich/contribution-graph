import { gql } from "@apollo/client";
import client from "./apolloClient";

export const CONTIBUTION_LEVELS = [0, 1, 2, 3, 4] as const;

export type ContributionLevel = typeof CONTIBUTION_LEVELS[number];

export interface ContributionDay {
  contributionLevel: ContributionLevel;
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  contributionCount: number;
  date: string;
}

export interface ContributionYear {
  contributionWeeks: ContributionWeek[];
  contributionCount: number;
  date: string;
}

export const getContributionsByDate = (
  contributions: ContributionDay[],
  date: Date
): ContributionDay | undefined => {
  return contributions.find((contribution) => {
    const contributionDate = new Date(contribution.date);
    return (
      contributionDate.getFullYear() === date.getFullYear() &&
      contributionDate.getMonth() === date.getMonth() &&
      contributionDate.getDate() === date.getDate()
    );
  });
};

const CONTRIBUTIONS_BY_YEAR = (
  username: string,
  from: string,
  to: string
) => gql`
  query {
    user(login: "${username}") {
      contributionsCollection(from: "${from}", to: "${to}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionLevel
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export default async function getContributions(
  username: string,
  year: number
): Promise<ContributionYear> {
  const from = new Date(year, 0, 1).toISOString();
  const to = new Date(year, 11, 31).toISOString();

  const { data } = await client.query({
    query: CONTRIBUTIONS_BY_YEAR(username, from, to),
  });

  // format raw data
  const yearlyContributionCount =
    data.user.contributionsCollection.contributionCalendar.totalContributions;

  const rawLevels = [
    "NONE",
    "FIRST_QUARTILE",
    "SECOND_QUARTILE",
    "THIRD_QUARTILE",
    "FOURTH_QUARTILE",
  ];

  // format weeks
  const contributionWeeks: ContributionWeek[] =
    data.user.contributionsCollection.contributionCalendar.weeks
      .map(
        (week: any) => {
          let weeklyContributionCount = 0;
          // format days
          const contributionDays: ContributionDay[] = week.contributionDays
            .map((day: any) => {
              weeklyContributionCount += day.contributionCount;

              const level = rawLevels.indexOf(day.contributionLevel);

              return {
                contributionCount: day.contributionCount,
                contributionLevel: level,
                date: new Date(day.date).toISOString(),
              };
            })
            // filter out days with no contributions
            .filter((day: ContributionDay) => day.contributionCount > 0);

          return {
            contributionCount: weeklyContributionCount,
            contributionDays,
            date: new Date(week.contributionDays[0].date).toISOString(),
          };
        }
        // filter out weeks with no contributions
      )
      .filter((week: ContributionWeek) => week.contributionCount > 0);

  // format year
  const contributionYear: ContributionYear = {
    contributionCount: yearlyContributionCount,
    contributionWeeks,
    date: new Date(year, 0, 1).toISOString(),
  };

  return contributionYear;
}
