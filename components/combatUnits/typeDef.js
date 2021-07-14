const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatUnits: [CombatUnit]!
    getCombatUnit(id: ID!): CombatUnit
    getCombatUnitTypes: [CombatUnitType]!
    getCombatUnitType(id: ID!): CombatUnitType
    getCombatUnitRoles: [CombatUnitRole]!
    getCombatUnitRole(id: ID!): CombatUnitRole
    getCombatUnitWeaponTypes: [CombatUnitWeaponType]!
    getCombatUnitWeaponType(id: ID!): CombatUnitWeaponType
  }

  extend type Mutation {
    addUnitType(input: JSON!): CombatUnitType
    removeUnitType(id: ID!): String
  }

  type CombatUnit {
    id: ID!
  }

  type CombatUnitType {
    id: ID!
    name: String!
    rangeVelocity: Range
    rangeVelocityUpVertical: Range
    rangeVelocityDownVertical: Range
    cargoType: ID!
    maxCargoQuantity: Range
    maxFuelConsume: Range
    maxTurningRadius: Range
  }

  type CombatUnitRole {
    id: ID!
    name: String!
    unitType: CombatUnitType
  }

  type CombatUnitWeaponType {
    id: String!
    name: String!
    hRange: Float
    vRange: Float
    rapidity: Float
  }
`;

module.exports = {
  typeDef,
};
