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
      getDetectedTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getDetectedObjects();
        return data || [];
      },
    },

    Mutation: {
      addTargetObject: async (_, { id }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.addObject(id);
        return result || null;
      },
      removeTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.removeObjects();
        return !!result;
      },
      removeTargetObject: async (_, { id }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.removeObject(id);
        return result || null;
      },
      addTargetObjectsToMap: async (_, { input }, { models: { targetObjectsData } }) => {
        const result = await targetObjectsData.addObjectsToMap(input);
        return !!result;
      },
      loadDetectedTargetObjects: async (_, __, { models: { targetObjectsData } }) => {
        const data = await targetObjectsData.getDetectedObjects();
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
          return { id, coordinates };
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
      onDetectTargetObjects: {
        subscribe: withFilter(
          (_, __, { models: { targetObjectsData } }) => {
            const pubsub = targetObjectsData.subscribeTargetObjects();
            return pubsub.asyncIterator('status');
          },
          ({ status }) => {
            return status === 'detected';
          },
        ),
        resolve: async (_, __, { models: { targetObjectsData } }) => {
          console.log('detected');
          const data = await targetObjectsData.getDetectedObjects();
          console.log(data && data.length);
          return data || [];
        },
        // subscribe: (_, __, { models: { targetObjectsData } }) => {
        //   const pubsub = targetObjectsData.subscribeDetectedObjects();
        //   return pubsub.asyncIterator('TARGETS_DETECTED');
        // },
        // resolve: (payload) => {
        //   const data = payload.objects;
        //   return data || [];
        // },
      },
    },

    TargetObject: {
      // coordinates: async ({ id, coordinates }, _, { models: { targetObjectsData } }) => {
      //   if (coordinates) return coordinates;
      //   const data = await targetObjectsData.getObjectPosition(id);
      //   return (data && data.coordinates) || null;
      // },
      image: async ({ id, image }, _, { models: { targetObjectsData } }) => {
        if (image) return image;
        const data = await targetObjectsData.getDetectedObjectImage(id);
        return (data && data.image) || null;
      },
    },
  },
};
