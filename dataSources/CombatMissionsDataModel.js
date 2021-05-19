const DataModel = require('./DataModel');

const mockData = [
  {
    id: 1,
    name: 'Разведка сектора 1',
    stage: 1,
    group: {
      leading: 1,
      slaves: [5, 6],
    },
  },
  {
    id: 2,
    name: 'Разведка сектора 2',
    stage: 2,
    group: {
      leading: 2,
      slaves: [7],
    },
  },
  {
    id: 3,
    name: 'Разведка сектора 3',
    stage: 2,
    group: {
      leading: 3,
      slaves: [8, 9, 10],
    },
  },
  {
    id: 4,
    name: 'Разведка сектора 4',
    stage: 4,
    group: {
      leading: 4,
      slaves: [11],
    },
  },
];

class CombatMissionsDataModel extends DataModel {
  async getMissions() {
    const foundMissions = mockData;

    return foundMissions;
  }

  getMission(id) {
    const foundMission = mockData.find((mission) => mission.id === id);

    return foundMission;
  }
}

module.exports = CombatMissionsDataModel;
