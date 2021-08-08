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

      getCombatUnitWeaponTypes: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitWeaponTypes();

        return data || [];
      },
      getCombatUnitWeaponType: async (_, { id }, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitWeaponType(id);

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

      getCombatUnitRoleTypes: async (_, __, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRoleTypes();

        return data || [];
      },
    },

    Mutation: {
      addCombatUnit: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnit(input);
        return result || null;
      },
      removeCombatUnits: async (_, __, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnits();
        return result || null;
      },
      removeCombatUnit: async (_, { id }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnit(id);
        return result || null;
      },

      addCombatUnitType: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnitType(input);
        return result || null;
      },
      removeCombatUnitTypes: async (_, __, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnitTypes();
        return result || null;
      },
      removeCombatUnitType: async (_, { id }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnitType(id);
        return result || null;
      },

      addCombatUnitRole: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnitRole(input);
        return result || null;
      },
      removeCombatUnitRoles: async (_, __, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnitRoles();
        return result || null;
      },
      removeCombatUnitRole: async (_, { id }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnitRole(id);
        return result || null;
      },

      addCombatUnitsToMap: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnitsToMap(input);
        return !!result;
      },
    },

    CombatUnit: {
      role: async ({ role: id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitRole(id);

        return data || null;
      },
      type: async ({ type: id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitType(id);

        return data || null;
      },
      altitude: async ({ id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitAltitude(id);

        return data || null;
      },
      battery: async ({ id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitBattery(id);

        return data || null;
      },
      globalPosition: async ({ id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitGlobalPosition(id);

        return data || null;
      },
      localPosition: async ({ id }, _, { models: { combatUnitsData } }) => {
        const data = await combatUnitsData.getUnitLocalPosition(id);

        return data || null;
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
