const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatMissions: [CombatMission]!
    getCombatMission(id: ID!): CombatMission
  }

  type CombatMission {
    id: ID!
    name: String
    stage: Int!
    group: CombatGroup!
  }

  type CombatGroup {
    id: ID!
    leading: CombatUnit!
    slaves: [CombatUnit]!
  }
`;

module.exports = {
  typeDef,
};
