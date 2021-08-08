const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatMissions: [CombatMission]!
    getCombatMission(id: ID!): CombatMission
  }

  extend type Mutation {
    addCombatMission(input: JSON!): String
    removeCombatMissions: Boolean
    removeCombatMission(id: ID!): String
  }

  type CombatMission {
    id: ID!
    name: String
    directiveTime: Int
    numLaunch: Int
    timeLaunch: Int
    scoutingArea: JSON
    dumpAmmoPoint: JSON
    landingPoint: JSON
  }
`;

module.exports = {
  typeDef,
};
