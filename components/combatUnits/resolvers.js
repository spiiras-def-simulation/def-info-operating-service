module.exports = {
  resolvers: {
    Query: {
      getCombatUnits: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnits();

        return data || [];
      },
      getCombatUnit: async (_, { id }, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnit(id);

        return data || null;
      },
      getCombatUnitTypes: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitTypes();

        return data || [];
      },
      getCombatUnitType: async (_, { id }, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitType(id);

        return data || null;
      },
      getCombatUnitRoles: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRoles();

        return data || [];
      },
      getCombatUnitRole: async (_, { id }, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRole(id);

        return data || null;
      },
      getCombatUnitWeaponTypes: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitWeaponTypes();

        return data || [];
      },
      getCombatUnitWeaponType: async (_, { id }, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitWeaponType(id);

        return data || null;
      },
    },

    Mutation: {
      addUnitType: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnitType(input);
        return result || null;
      },
      removeUnitType: async (_, { id }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnitType(id);
        return result || null;
      },
    },

    CombatUnitRole: {
      unitType: async ({ unitType }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitType(unitType);

        return data;
      },
    },
  },
};
