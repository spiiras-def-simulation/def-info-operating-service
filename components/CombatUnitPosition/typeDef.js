const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type CombatUnit {
    localPosition: CombatUnitPosition
    globalPosition: CombatUnitPosition
  }

  type CombatUnitPosition {
    coordinates: Point3
    angles: Point4
  }
`;

module.exports = {
  typeDef,
};
