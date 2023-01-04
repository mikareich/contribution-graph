import { gql } from "@apollo/client";
import client from "./apolloClient";

export interface ContributionDay {
  contributionLevel: string;
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

const CONTRIBUTIONS_BY_YEAR = (username: string) => gql`
  query {
    user(login: "${username}") {
      contributionsCollection {
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
  try {
    const { data } = await client.query({
      query: CONTRIBUTIONS_BY_YEAR(username),
    });

    // format raw data
    const yearlyContributionCount =
      data.user.contributionsCollection.contributionCalendar.totalContributions;

    // format weeks
    const contributionWeeks: ContributionWeek[] =
      data.user.contributionsCollection.contributionCalendar.weeks.map(
        (week: any) => {
          let weeklyContributionCount = 0;
          // format days
          const contributionDays: ContributionDay[] = week.contributionDays.map(
            (day: any) => {
              weeklyContributionCount += day.contributionCount;

              return {
                contributionCount: day.contributionCount,
                contributionLevel: day.contributionLevel,
                date: new Date(day.date).toISOString(),
              };
            }
          );

          return {
            contributionCount: weeklyContributionCount,
            contributionDays,
            date: new Date(week.contributionDays[0].date).toISOString(),
          };
        }
      );

    // format year
    const contributionYear: ContributionYear = {
      contributionCount: yearlyContributionCount,
      contributionWeeks,
      date: new Date(year, 0, 1).toISOString(),
    };

    return contributionYear;
  } catch (error) {
    throw error;
  }
}
