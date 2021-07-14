resolvers = {
  Query: {
    getWeatherStatus: async (_, __, { models: { environmentData } }) => {
      const data = await environmentData.getWeatherState();

      return data || null;
    },
    getEnvironmentTime: async (_, __, { models: { environmentData } }) => {
      const data = await environmentData.getEnvironmentTime();

      return data || null;
    },
  },
  // Subscription: {
  //   weatherStatusUpdated: {
  //     subscribe: (_, __, { models: { environmentData } }) => {
  //       environmentData.subscribe({});
  //     },
  //     resolve: async (_, __, { models: { environmentData } }) => {
  //       const data = await environmentData.getWeatherState();

  //       return data || null;
  //     },
  //   },
  // },
};

module.exports = {
  resolvers,
};
