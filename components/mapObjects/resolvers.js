module.exports = {
  resolvers: {
    Query: {
      getMapObjects: async (_, __, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObjects();
        return data || [];
      },
      getMapObjectsByType: async (_, { type }, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObjectsByType(type);
        return data || [];
      },
      getMapObject: async (_, { id }, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObject(id);
        return data || [];
      },
    },

    Mutation: {
      addMapObject: async (_, { type, object }, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.addObject(type, object);
        return result || null;
      },
      updateMapObject: async (_, { id, object }, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.updateObject(id, object);
        return result || null;
      },
      removeMapObjects: async (_, __, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.removeObjects();
        return result || null;
      },
      removeMapObject: async (_, { id }, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.removeObject(id);
        return result || null;
      },
    },
  },
};
