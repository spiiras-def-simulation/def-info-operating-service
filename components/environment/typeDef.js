const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getEnvironmentStatus: Environment!
  }

  type Environment {
    wind: WindStatus!
    temperature: Float
    pressure: Float
  }

  type WindStatus {
    x: Float
    y: Float
    z: Float
    velocity: Float
  }
`;

module.exports = {
  typeDef,
};
