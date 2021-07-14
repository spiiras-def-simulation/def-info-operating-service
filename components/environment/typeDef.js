const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getWeatherStatus: WeatherStatus
    getEnvironmentTime: TimeDate
  }

  # extend type Subscription {
  #   weatherStatusUpdated: WeatherStatus
  # }

  type WeatherStatus {
    wind: WindStatus!
    temperature: Float
    pressure: Float
  }

  type WindStatus {
    direction: Point3
    velocity: Float
  }
`;

module.exports = {
  typeDef,
};
