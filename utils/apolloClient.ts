import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const { GITHUB_API_URL, GITHUB_TOKEN } = process.env;

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

/* It's a middleware that adds the authorization to the headers. */
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default client;
