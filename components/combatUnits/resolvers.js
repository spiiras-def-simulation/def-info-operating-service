resolvers = {};

module.exports = {
  resolvers: {
    Query: {
      getCombatUnits: async (_, __, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnits();

        return data || null;
      },
      getCombatUnit: async (_, { id }, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnit(id);

        return data || null;
      },
      getCombatUnitTypes: async (_, __, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitTypes();

        return data || null;
      },
      getCombatUnitType: async (_, { id }, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitType(id);

        return data || null;
      },
      getCombatUnitRoles: async (_, __, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRoles();

        return data || null;
      },
      getCombatUnitRole: async (_, { id }, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRole(id);

        return data || null;
      },
    },

    CombatUnitRole: {
      unitType: async ({ unitType }, _, { dataSources: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitType(unitType);

        return data;
      },
    },
  },
};
