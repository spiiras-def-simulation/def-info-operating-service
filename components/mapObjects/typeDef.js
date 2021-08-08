const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getMapObjects: [MapObject]!
    getMapObject(id: ID!): MapObject
  }

  extend type Mutation {
    addMapObject(input: JSON!): String
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
