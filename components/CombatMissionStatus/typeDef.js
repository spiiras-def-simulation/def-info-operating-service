const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getCombatMissionsByStatus(status: CombatMissionStatus): [CombatMission]!
    getLaunchedCombatMission: CombatMission
  }

  extend type CombatMission {
    status: CombatMissionStatus
  }

  enum CombatMissionStatus {
    REGISTRED
    ANALYSED
    LAUNCHED
    REJECTED
    FINISHED
  }
`;

module.exports = {
  typeDef,
};
