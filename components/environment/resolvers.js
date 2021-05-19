resolvers = {
  Query: {
    getWeatherStatus: async (_, __, { dataSources: { environmentData } }) => {
      const data = await environmentData.getWeatherState();

      return data || null;
    },
    getEnvironmentTime: async (_, __, { dataSources: { environmentData } }) => {
      const data = await environmentData.getEnvironmentTime();

      return data || null;
    },
  },
  Subscription: {
    weatherStatusUpdated: {
      subscribe: (_, __, { dataSourses: { environmentData } }) => {
        environmentData.subscribe({});
      },
      resolve: async (_, __, { dataSourses: { environmentData } }) => {
        const data = await environmentData.getWeatherState();

        return data || null;
      },
    },
  },
};

module.exports = {
  resolvers,
};
