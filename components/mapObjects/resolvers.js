module.exports = {
  resolvers: {
    Query: {
      getMapObjects: async (_, { type }, { models: { mapObjectsData } }) => {
        const data = await mapObjectsData.getObjects(type);

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
    },
  },
};
