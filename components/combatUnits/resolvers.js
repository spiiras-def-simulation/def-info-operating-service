const { withFilter } = require('apollo-server-express');

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

      getCombatUnitTypes: async (_, __, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getTypes();
        return data || [];
      },
      getCombatUnitType: async (_, { id }, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getType(id);
        return data || null;
      },

      getCombatUnitWeaponTypes: async (_, __, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getWeaponTypes();
        return data || [];
      },
      getCombatUnitWeaponType: async (_, { id }, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getWeaponType(id);
        return data || null;
      },

      getCombatUnitRoles: async (_, __, { models: { combatUnitRolesData } }) => {
        const data = await combatUnitRolesData.getRoles();
        return data || [];
      },
      getCombatUnitRole: async (_, { id }, { models: { combatUnitRolesData } }) => {
        const data = await combatUnitRolesData.getRole(id);
        return data || null;
      },
      getCombatUnitRoleTypes: async (_, __, { models: { combatUnitRolesData } }) => {
        const data = await combatUnitRolesData.getRoleTypes();
        return data || [];
      },
    },

    Mutation: {
      addCombatUnits: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnits(input);
        return !!result;
      },
      addCombatUnit: async (_, { input }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.addUnit(input);
        return result || null;
      },
      // removeCombatUnits: async (_, __, { models: { combatUnitsData } }) => {
      //   const result = await combatUnitsData.removeUnits();
      //   return result || null;
      // },
      removeCombatUnit: async (_, { id }, { models: { combatUnitsData } }) => {
        const result = await combatUnitsData.removeUnit(id);
        return result || null;
      },

      addCombatUnitType: async (_, { input }, { models: { combatUnitTypesData } }) => {
        const result = await combatUnitTypesData.addType(input);
        return result || null;
      },
      removeCombatUnitTypes: async (_, __, { models: { combatUnitTypesData } }) => {
        const result = await combatUnitTypesData.removeTypes();
        return result || null;
      },
      removeCombatUnitType: async (_, { id }, { models: { combatUnitTypesData } }) => {
        const result = await combatUnitTypesData.removeType(id);
        return result || null;
      },

      addCombatUnitRole: async (_, { input }, { models: { combatUnitRolesData } }) => {
        const result = await combatUnitRolesData.addRole(input);
        return result || null;
      },
      removeCombatUnitRoles: async (_, __, { models: { combatUnitRolesData } }) => {
        const result = await combatUnitRolesData.removeRoles();
        return result || null;
      },
      removeCombatUnitRole: async (_, { id }, { models: { combatUnitRolesData } }) => {
        const result = await combatUnitRolesData.removeRole(id);
        return result || null;
      },
    },

    Subscription: {
      onUpdateCombatUnitTimeLeft: {
        subscribe: withFilter(
          (_, __, { models: { combatUnitsData } }) => {
            const pubsub = combatUnitsData.subscribeUnitObjects();
            return pubsub.asyncIterator('battery');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: (payload, { id }) => {
          const { battery: timeLeft } = payload;
          return { id, timeLeft };
        },
      },
      onUpdateCombatUnitGlobalPosition: {
        subscribe: withFilter(
          (_, __, { models: { combatUnitsData } }) => {
            const pubsub = combatUnitsData.subscribeUnitObjects();
            return pubsub.asyncIterator('geoposition_global');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: (payload, { id }) => {
          const { coordinates: globalPosition } = payload;
          return { id, globalPosition };
        },
      },
      onUpdateCombatUnitLocalPosition: {
        subscribe: withFilter(
          (_, __, { models: { combatUnitsData } }) => {
            const pubsub = combatUnitsData.subscribeUnitObjects();
            return pubsub.asyncIterator('geoposition_local');
          },
          (payload, params) => {
            return parseInt(payload.id) === parseInt(params.id);
          },
        ),
        resolve: (payload, { id }) => {
          const { coordinates: localPosition } = payload;
          return { id, localPosition };
        },
      },
    },

    CombatUnit: {
      type: async ({ type: id }, _, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getType(id);
        return data;
      },
      role: async ({ role: id }, _, { models: { combatUnitRolesData } }) => {
        const data = await combatUnitRolesData.getRole(id);
        return data;
      },
      // altitude: async ({ id, altitude }, _, { models: { combatUnitsData } }) => {
      //   if (altitude) return altitude;
      //   const data = await combatUnitsData.getUnitAltitude(id);
      //   return (data && data.altitude) || null;
      // },
      // timeLeft: async ({ id, timeLeft }, _, { models: { combatUnitsData } }) => {
      //   if (timeLeft) return timeLeft;
      //   const data = await combatUnitsData.getUnitTimeLeft(id);
      //   return (data && data.timeLeft) || null;
      // },
      // globalPosition: async ({ id, globalPosition }, _, { models: { combatUnitsData } }) => {
      //   if (globalPosition) return globalPosition;
      //   const data = await combatUnitsData.getUnitGlobalPosition(id);
      //   return (data && data.globalPosition) || null;
      // },
      // localPosition: async ({ id, localPosition }, _, { models: { combatUnitsData } }) => {
      //   if (localPosition) return localPosition;
      //   const data = await combatUnitsData.getUnitLocalPosition(id);
      //   return (data && data.localPosition) || null;
      // },
    },

    CombatUnitRole: {
      unitType: async ({ unitType }, _, { models: { combatUnitTypesData } }) => {
        const data = await combatUnitTypesData.getType(unitType);
        return data;
      },
    },
  },
};
