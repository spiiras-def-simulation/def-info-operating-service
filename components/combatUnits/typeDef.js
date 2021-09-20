const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatUnits: [CombatUnit]!
    getCombatUnit(id: ID!): CombatUnit

    getCombatUnitTypes: [CombatUnitType]!
    getCombatUnitType(id: ID!): CombatUnitType

    getCombatUnitWeaponTypes: [CombatUnitWeaponType]!
    getCombatUnitWeaponType(id: ID!): CombatUnitWeaponType

    getCombatUnitRoles: [CombatUnitRole]!
    getCombatUnitRole(id: ID!): CombatUnitRole

    getCombatUnitRoleTypes: [CombatUnitRoleType]!
  }

  extend type Mutation {
    addCombatUnit(input: JSON!): CombatUnit
    # removeCombatUnits: Boolean
    removeCombatUnit(id: ID!): String

    addCombatUnitType(input: JSON!): CombatUnitType
    removeCombatUnitTypes: Boolean
    removeCombatUnitType(id: ID!): String

    addCombatUnitRole(input: JSON!): CombatUnitRole
    removeCombatUnitRoles: Boolean
    removeCombatUnitRole(id: ID!): String

    addCombatUnitsToMap(input: JSON!): Boolean
  }

  extend type Subscription {
    onUpdateCombatUnitTimeLeft(id: ID!): CombatUnit!
    onUpdateCombatUnitGlobalPosition(id: ID!): CombatUnit!
    onUpdateCombatUnitLocalPosition(id: ID!): CombatUnit!
  }

  type CombatUnit {
    id: ID!
    tailNumber: String!
    timePrepare: Float
    detectionRadius: Float
    tvsSize: Float
    fuelResource: Int

    role: CombatUnitRole
    type: CombatUnitType

    altitude: Float
    timeLeft: Float
    globalPosition: Point3
    localPosition: Point3

    attackPoints: [Point2]
  }

  type CombatUnitType {
    id: ID!
    name: String
    rangeVelocity: Range
    rangeVelocityUpVertical: Range
    rangeVelocityDownVertical: Range
    cargoType: ID!
    maxCargoQuantity: Range
    maxFuelConsume: Range
    maxTurningRadius: Range
  }

  type CombatUnitWeaponType {
    id: ID!
    name: String
    hRange: Float
    vRange: Float
    rapidity: Float
  }

  type CombatUnitRole {
    id: ID!
    name: String
    unitType: CombatUnitType!
  }

  type CombatUnitRoleType {
    id: ID!
    name: String
  }
`;

module.exports = {
  typeDef,
};
