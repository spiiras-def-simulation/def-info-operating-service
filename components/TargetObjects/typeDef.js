const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getTargetObjects: [TargetObject]!
    getTargetObject(id: ID!): TargetObject
    getDetectedTargetObjects: [TargetObject]
  }

  extend type Mutation {
    addTargetObject(id: ID!): TargetObject
    removeTargetObject(id: ID!): String
    addTargetObjectsToMap(input: JSON!): Boolean
    loadDetectedTargetObjects: [TargetObject]
  }

  extend type Subscription {
    onUpdateTargetObjectsList: [TargetObject]
    onUpdateTargetObjectPosition(id: ID!): TargetObject!
    onUpdateTargetObjectPath(id: ID!): TargetObject!
  }

  type TargetObject {
    id: ID!
    type: String
    coordinates: Point3
    detectedCoordinates: Point3
    path: [Point3]
    image: String
  }
`;

module.exports = {
  typeDef,
};
