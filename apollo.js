const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');

const environment = require('./components/environment');

const typeDefs = gql`
  scalar JSON

  type Query
`;

const resolvers = {
  JSON: GraphQLJSON,
};

module.exports = {
  createApolloServer: async function (app, httpServer) {
    const server = new ApolloServer({
      typeDefs: [typeDefs, environment.typeDef],
      resolvers: [resolvers, environment.resolvers],
    });

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);
  },
};
