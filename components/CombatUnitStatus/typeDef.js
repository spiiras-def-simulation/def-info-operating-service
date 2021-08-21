const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type CombatUnit {
    status: CombatUnitStatus
  }

  enum CombatUnitStatus {
    REGISTRED
    LAUNCHED
    LOST
    STOPPED
    PREPARE_TO_STRIKE
  }
`;

module.exports = {
  typeDef,
};
