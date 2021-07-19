const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getTargetObjects: [TargetObject]!
    getTargetObject(id: ID!): TargetObject
  }

  extend type Mutation {
    addTargetObject(id: ID!): Boolean
    removeTargetObject(id: ID!): Boolean
    addTargetObjectsToMap(input: JSON!): Boolean
  }

  extend type Subscription {
    onUpdateTargetObjectsList: [TargetObject]!
    onUpdateTargetObjectPosition(id: ID!): TargetObject!
    # targetObjectVelocity(id: ID!): TargetObject!
    # targetObjectTrajectory(id: ID!): [TargetObject]!
    # targetObjectWaypoint(id: ID!): TargetObject!
  }

  type TargetObject {
    id: ID!
    coordinates: Point3
  }
`;

module.exports = {
  typeDef,
};
