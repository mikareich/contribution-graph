const { GITHUB_API_URL, GITHUB_TOKEN } = process.env;

module.exports = {
  client: {
    service: {
      name: "GitHub Contribution Graph",
      url: GITHUB_API_URL,
      headers: {
        authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      skipSSLValidation: true,
    },
  },
};
