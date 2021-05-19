const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatUnits: [CombatUnit]!
    getCombatUnit(id: ID!): CombatUnit
    getCombatUnitTypes: [CombatUnitType]!
    getCombatUnitType: CombatUnitType
    getCombatUnitRoles: [CombatUnitRole]!
    getCombatUnitRole: CombatUnitRole
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
    maxCargoQuantity: Range
    maxFuelConsume: Range
    maxTurningRadius: Range
  }

  type CombatUnitRole {
    id: ID!
    name: String!
    unitType: CombatUnitType
  }
`;

module.exports = {
  typeDef,
};
