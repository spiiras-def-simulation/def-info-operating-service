const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Subscription {
    onChangeStatusCombatUnits: [CombatUnit]!
    onChangeStatusCombatUnit(id: ID!): CombatUnit
  }

  extend type CombatUnit {
    status: CombatUnitStatus
  }

  enum CombatUnitStatus {
    REGISTRED
    SPAWNED
    LAUNCHED
    LOST
    STOPPED
    ATTACK_TARGET
  }
`;

module.exports = {
  typeDef,
};
