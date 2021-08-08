module.exports = {
  resolvers: {
    Query: {
      getMapObjects: async (_, __, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObjects();

        return data || [];
      },
      getMapObject: async (_, { id }, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObject(id);

        return data || [];
      },
    },

    Mutation: {
      addMapObject: async (_, { input }, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.addObject(input);
        return result || null;
      },
      removeObject: async (_, { id }, { models: { mapObjectsData } }) => {
        const result = await mapObjectsData.removeObject(id);
        return result || null;
      },
    },
  },
};
