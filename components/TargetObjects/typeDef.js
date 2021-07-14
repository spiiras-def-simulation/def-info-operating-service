const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getTargetObjects: [TargetObject]!
    getTargetObject(id: ID!): TargetObject
  }

  extend type Mutation {
    addTargetObjectsToMap(input: JSON!): Boolean
  }

  extend type Subscription {
    onUpdateTargetObjectPosition(id: ID!): TargetObject!
    # targetObjectVelocity(id: ID!): TargetObject!
    # targetObjectTrajectory(id: ID!): [TargetObject]!
    # targetObjectWaypoint(id: ID!): TargetObject!
  }

  # extend type Mutation {}

  type TargetObject {
    id: ID!
    coordinates: Point3
  }
`;

module.exports = {
  typeDef,
};
