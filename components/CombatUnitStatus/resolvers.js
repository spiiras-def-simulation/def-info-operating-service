const { withFilter } = require('apollo-server-express');

module.exports = {
  resolvers: {
    Subscription: {
      onChangeStatusCombatUnits: {
        subscribe: (_, __, { models: { combatUnitsData } }) => {
          const pubsub = combatUnitsData.subscribeUnitObjects();
          return pubsub.asyncIterator('status');
        },
        resolve: async (_, __, { models: { combatUnitsData } }) => {
          const data = await combatUnitsData.getUnits();
          return data || [];
        },
      },
      onChangeStatusCombatUnit: {
        subscribe: withFilter(
          (_, __, { models: { combatUnitsData } }) => {
            const pubsub = combatUnitsData.subscribeUnitObjects();
            return pubsub.asyncIterator('status');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: async (_, { id }, { models: { combatUnitsData } }) => {
          const data = await combatUnitsData.getUnit(id);
          return data || null;
        },
      },
    },

    CombatUnitStatus: {
      REGISTRED: 'registered',
      SPAWNED: 'spawned',
      LAUNCHED: 'launched',
      LOST: 'lost_connection',
      STOPPED: 'stopped',
      ATTACK_TARGET: 'attacking',
    },
  },
};
