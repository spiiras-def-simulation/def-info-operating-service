resolvers = {};

module.exports = {
  resolvers: {
    CombatUnit: {
      localPosition: async ({ id }, _, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitLocalPosition(id);

        return data || null;
      },
      globalPosition: async ({ id }, _, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitGlobalPosition(id);

        return data || null;
      },
    },
  },
};
