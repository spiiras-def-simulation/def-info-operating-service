const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getMapObjects(type: String!): [MapObject]!
    getMapObject(id: ID!): MapObject
  }

  extend type Mutation {
    addMapObject(input: JSON!): String
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
