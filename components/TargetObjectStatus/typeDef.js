const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type TargetObject {
    status: TargetObjectStatus
  }

  enum TargetObjectStatus {
    REGISTRED
    LAUNCHED
    LOST
    DESTROYED
    STOPPED
  }
`;

module.exports = {
  typeDef,
};
