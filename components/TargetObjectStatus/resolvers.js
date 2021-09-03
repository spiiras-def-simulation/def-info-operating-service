const { withFilter } = require('apollo-server-express');

module.exports = {
  resolvers: {
    Subscription: {
      onChangeStatusTargetObjects: {
        subscribe: (_, __, { models: { targetObjectsData } }) => {
          const pubsub = targetObjectsData.subscribeTargetObjects();
          return pubsub.asyncIterator('status');
        },
        resolve: async (_, __, { models: { targetObjectsData } }) => {
          const data = await targetObjectsData.getObjects();

          return data || [];
        },
      },
      onChangeStatusTargetObject: {
        subscribe: withFilter(
          (_, __, { models: { targetObjectsData } }) => {
            const pubsub = targetObjectsData.subscribeTargetObjects();
            return pubsub.asyncIterator('status');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: async ({ status }, __) => {
          return status || null;
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
          const data = await targetObjectsData.getDetectedObjects();
          return data || [];
        },
      },
    },

    TargetObjectStatus: {
      REGISTRED: 'created',
      LAUNCHED: 'launched',
      DETECTED: 'detected',
      LOST: 'lost',
      DESTROYED: 'destroyed',
      STOPPED: 'stopped',
    },
  },
};
