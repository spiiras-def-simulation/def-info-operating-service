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
      getMissionTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getMissionObjects();
        return data || [];
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
      loadMissionTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getMissionObjects();
        return data || [];
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
      onUpdateTargetObjectPath: {
        subscribe: withFilter(
          (_, __, { models: { targetObjectsData } }) => {
            const pubsub = targetObjectsData.subscribeTargetObjects();
            return pubsub.asyncIterator('trajectory');
          },
          (payload, params) => {
            return payload.id === params.id;
          },
        ),
        resolve: async (_, { id }, { models: { targetObjectsData } }) => {
          const data = await targetObjectsData.getObjectPath(id);
          return { id, path: (data && data.path) || null };
        },
      },
    },

    TargetObject: {
      coordinates: async ({ id, coordinates }, _, { models: { targetObjectsData } }) => {
        if (coordinates) return coordinates;
        const data = await targetObjectsData.getObjectPosition(id);
        return (data && data.coordinates) || null;
      },
      path: async ({ id, path }, _, { models: { targetObjectsData } }) => {
        if (path) return path;
        const data = await targetObjectsData.getObjectPath(id);
        return (data && data.path) || null;
      },
      image: async ({ id, image }, _, { models: { targetObjectsData } }) => {
        if (image) return image;
        const data = await targetObjectsData.getObjectImage(id);
        return (data && data.image) || null;
      },
    },
  },
};
