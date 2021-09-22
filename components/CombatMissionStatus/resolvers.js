const { withFilter } = require('apollo-server-express');

module.exports = {
  resolvers: {
    Query: {
      getCombatMissionsByStatus: async (_, { status }, { models: { combatMissionsData } }) => {
        const data = await combatMissionsData.getMissionsByStatus(status);
        return data || [];
      },
      getLaunchedCombatMission: async (_, __, { models: { combatMissionsData } }) => {
        const data = await combatMissionsData.getLaunchedMission();
        return data || null;
      },
    },

    Subscription: {
      onChangeStatusCombatMissions: {
        subscribe: (_, __, { models: { combatMissionsData } }) => {
          const pubsub = combatMissionsData.subscribeMissions();
          return pubsub.asyncIterator('status');
        },
        resolve: async (_, __, { models: { combatMissionsData } }) => {
          const data = await combatMissionsData.getMissions();
          return data || [];
        },
      },
      onChangeStatusCombatMission: {
        subscribe: withFilter(
          (_, __, { models: { combatMissionsData } }) => {
            const pubsub = combatMissionsData.subscribeMissions();
            return pubsub.asyncIterator('status');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: async ({ status }, { id }, { models: { combatMissionsData } }) => {
          console.log(`Change mission's status id=${id} - ${status}`);
          const data = await combatMissionsData.getMission(id);
          return data || null;
        },
      },
    },

    CombatMissionStatus: {
      REGISTRED: 'created',
      ANALYSED: 'processed',
      LAUNCHED: 'launched',
      REJECTED: 'rejected',
      FINISHED: 'finished',
    },
  },
};
