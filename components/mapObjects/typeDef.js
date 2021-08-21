const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getMapObjects: [MapObject]!
    getMapObjectsByType(type: String!): [MapObject]!
    getMapObject(id: ID!): MapObject
  }

  extend type Mutation {
    addMapObject(object: JSON!): String
    updateMapObject(id: ID!, object: JSON!): Boolean
    removeMapObjects: [String]
    removeMapObject(id: ID!): String
  }

  type MapObject {
    id: ID!
    type: String
    coordinates: JSON
  }
`;

module.exports = {
  typeDef,
};
