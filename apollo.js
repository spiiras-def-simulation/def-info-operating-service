const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLDateTime } = require('graphql-iso-date');
const config = require('config');

const Environment = require('./components/Environment');
const CombatUnits = require('./components/CombatUnits');
const CombatUnitsStatus = require('./components/CombatUnitStatus');
const CombatMissions = require('./components/CombatMissions');
const CombatMissionStatus = require('./components/CombatMissionStatus');
const TargetObjects = require('./components/TargetObjects');
const TargetObjecStatus = require('./components/TargetObjectStatus');
const MapObjects = require('./components/MapObjects');

const CombatMissionsDataModel = require('./dataSources/CombatMissionsDataModel');
const EnvironmentDataModel = require('./dataSources/EnvironmentDataModel');
const TargetObjectsDataModel = require('./dataSources/TargetObjectsDataModel');
const CombatUnitsDataModel = require('./dataSources/CombatUnitsDataModel');
const MapObjectsDataModel = require('./dataSources/MapObjectsDataModel');

const typeDefs = gql`
  type Query
  type Mutation
  type Subscription

  type Point2 {
    x: Float
    y: Float
  }

  type Point3 {
    x: Float!
    y: Float!
    z: Float!
  }

  type Point4 {
    x: Float!
    y: Float!
    z: Float!
    w: Float!
  }

  type Range {
    min: Float
    max: Float
  }

  scalar JSON
  scalar DateTime
`;

const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,
};

module.exports = {
  createApolloServer: async function (app, httpServer) {
    const dataModels = {
      combatMissionsData: new CombatMissionsDataModel({ connection: config.amqp.connection }),
      environmentData: new EnvironmentDataModel({ connection: config.amqp.connection }),
      targetObjectsData: new TargetObjectsDataModel({ connection: config.amqp.connection }),
      combatUnitsData: new CombatUnitsDataModel({ connection: config.amqp.connection }),
      mapObjectsData: new MapObjectsDataModel({ connection: config.amqp.connection }),
    };

    Object.values(dataModels).forEach((model) =>
      model.connect().catch((error) => {
        console.error(`Connection failed: ${error.message}`);
      }),
    );

    const server = new ApolloServer({
      typeDefs: [
        typeDefs,
        Environment.typeDef,
        CombatUnits.typeDef,
        CombatUnitsStatus.typeDef,
        CombatMissions.typeDef,
        CombatMissionStatus.typeDef,
        TargetObjects.typeDef,
        TargetObjecStatus.typeDef,
        MapObjects.typeDef,
      ],
      resolvers: [
        resolvers,
        Environment.resolvers,
        CombatUnits.resolvers,
        CombatUnitsStatus.resolvers,
        CombatMissions.resolvers,
        CombatMissionStatus.resolvers,
        TargetObjects.resolvers,
        TargetObjecStatus.resolvers,
        MapObjects.resolvers,
      ],
      context: (context) => {
        if (context) {
          return {
            models: dataModels,
            ...context,
          };
        }
        return context;
      },
    });

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);
  },
};
