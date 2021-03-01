const statusProxy = {
  wind: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
    velocity: 1.0,
  },
  temperature: 20.0,
  pressure: 760.0,
};

resolvers = {
  Query: {
    getEnvironmentStatus: () => {
      const status = statusProxy;

      return status && { ...status };
    },
  },
};

module.exports = {
  resolvers,
};
