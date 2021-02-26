const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');

const typeDefs = gql`
  scalar JSON

  type Query
  type Mutation
  type Subscription
`;

const resolvers = {
  JSON: GraphQLJSON,
};

module.exports = {
  createApolloServer: async function (app, httpServer) {
    const server = new ApolloServer({
      typeDefs: [typeDefs],
      resolvers: [resolvers],
    });

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);
  },
};
