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
      addTargetObject: async (_, { id }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.addObject(id);
        return result || null;
      },
      removeTargetObject: async (_, { id }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.removeObject(id);
        return result || null;
      },
      addTargetObjectsToMap: async (_, { input }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.addObjectsToMap(input);

        return !!result;
      },
    },
    Subscription: {
      onUpdateTargetObjectsList: {
        subscribe: (_, __, { models: { targetObjectsData } }) => {
          const pubsub = targetObjectsData.subscribeTargetObjects();
          return pubsub.asyncIterator('co_statuses');
        },
        resolve: async (_, __, { models: { targetObjectsData } }) => {
          const data = await targetObjectsData.getObjects();

          return data || [];
        },
      },
      onUpdateTargetObjectPosition: {
        subscribe: withFilter(
          (_, __, { models: { targetObjectsData } }) => {
            const pubsub = targetObjectsData.subscribeTargetObjects();
            return pubsub.asyncIterator('geoposition');
          },
          (payload, params) => {
            return payload.id === params.id;
          },
        ),
        resolve: (payload, { id }) => {
          const { position: coordinates } = payload;
          return {
            id,
            coordinates,
          };
        },
      },
    },
  },
};
