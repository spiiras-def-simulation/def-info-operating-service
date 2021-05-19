resolvers = {};

module.exports = {
  resolvers: {
    CombatUnit: {
      status: async ({ id }, _, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitStatus(id);

        return data || null;
      },
    },
  },
};
