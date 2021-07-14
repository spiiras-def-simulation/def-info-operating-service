resolvers = {};

module.exports = {
  resolvers: {
    CombatUnit: {
      status: async ({ id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitStatus(id);

        return data || null;
      },
    },
  },
};
