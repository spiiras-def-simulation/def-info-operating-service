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
      recalculateCombatMission: async (_, { id, input }, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.recalculateMission(id, input);
        return !!result;
      },
      removeCombatMissions: async (_, __, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.removeMissions();
        return result || null;
      },
      removeCombatMission: async (_, { id }, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.removeMission(id);
        return result || null;
      },
      startCombatMission: async (_, { id }, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.startMission(id);
        return !!result;
      },
      confirmMissionAttackTargets: async (_, __, { models: { combatMissionsData } }) => {
        const result = await combatMissionsData.confirmAttackTargets();
        return !!result;
      },
    },
    CombatMission: {
      uavs: async ({ uavs: unitsGroup }, __, { models: { combatUnitsData } }) => {
        const units = await combatUnitsData.getUnits();
        const data = units.filter(({ id }) => unitsGroup.includes(id));
        return data || [];
      },
      path: async ({ id, path }, _, { models: { combatUnitsData } }) => {
        if (path) return path;
        const data = await combatUnitsData.getUnitPath(id);
        return (data && data.path) || null;
      },
    },
  },
};
