const { withFilter } = require('apollo-server-express');

module.exports = {
  resolvers: {
    Query: {
      getTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getObjects();

        return data || [];
      },
      getTargetObject: async (_, { id }, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getObject(id);

        return data || null;
      },
    },
    Mutation: {
      addTargetObjectsToMap: async (_, { input }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.addTargetObjectsToMap(input);

        return !!result;
      },
    },
    Subscription: {
      onUpdateTargetObjectPosition: {
        subscribe: withFilter(
          (_, __, { models: { targetObjectsData } }) => {
            const pubsub = targetObjectsData.subscribeTargetObjects();
            return pubsub.asyncIterator('geoposition');
          },
          (payload, params) => {
            return !!payload[params.id];
          },
        ),
        resolve: (payload, { id }) => {
          const target = payload[id];
          const { position: coordinates } = target;
          return {
            id,
            coordinates,
          };
        },
      },
    },
  },
};
