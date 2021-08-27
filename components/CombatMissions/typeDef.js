const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatMissions: [CombatMission]!
    getCombatMission(id: ID!): CombatMission
  }

  extend type Mutation {
    addCombatMission(input: JSON!): String
    recalculateCombatMission(id: ID!, input: JSON!): Boolean
    removeCombatMissions: Boolean
    removeCombatMission(id: ID!): String
    startCombatMission(id: ID!): Boolean
    confirmMissionAttackTargets: Boolean
  }

  type CombatMission {
    id: ID!
    accomplished: Boolean

    name: String
    directiveTime: Int
    numLaunch: Int
    timeLaunch: Int
    successLevel: Float
    strikeLevel: Float

    scoutingArea: JSON
    dumpAmmoPoint: Point2
    departurePoint: Point2
    landingPoint: Point2

    uavs: [CombatUnit]!

    targetNumber: Int
    targetCoordinates: [Point2]

    path: [Point2]
  }
`;

module.exports = {
  typeDef,
};
