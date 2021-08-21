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

    CombatMissionStatus: {
      REGISTRED: 'created',
      ANALYSED: 'processed',
      LAUNCHED: 'launched',
      REJECTED: 'rejected',
      FINISHED: 'finished',
    },
  },
};
