module.exports = {
  resolvers: {
    Query: {
      getCombatMissions: async (_, __, { models: { combatMissionsData } }) => {
        const data = await combatMissionsData.getMissions();

        return data || [];
      },
      getCombatMission: async (_, { id }, { models: { combatMissionsData } }) => {
        const data = await combatMissionsData.getMission(id);

        return data || null;
      },
    },
    Mutation: {
      addCombatMission: async (_, { input }, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.addMission(input);
        return result || null;
      },
      removeCombatMission: async (_, { id }, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.removeMission(id);
        return result || null;
      },
    },
  },
};
