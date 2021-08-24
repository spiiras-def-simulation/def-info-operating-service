const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Subscription {
    onChangeStatusTargetObjects: [TargetObject]!
    onChangeStatusTargetObject(id: ID!): TargetObjectStatus
  }

  extend type TargetObject {
    status: TargetObjectStatus
  }

  enum TargetObjectStatus {
    REGISTRED
    LAUNCHED
    DETECTED
    LOST
    DESTROYED
    STOPPED
  }
`;

module.exports = {
  typeDef,
};
