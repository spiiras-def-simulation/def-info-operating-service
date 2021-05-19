const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type CombatUnit {
    status: CombatUnitStatus
  }

  type CombatUnitStatus {
    altitude: Float
    battery: Float
  }
`;

module.exports = {
  typeDef,
};
