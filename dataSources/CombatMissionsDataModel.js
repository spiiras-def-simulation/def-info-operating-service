const DataModel = require('./DataModel');

const { mapObject, unmapObject, saveMessageFile } = require('./helpers');

const mapCombatMission = {
  status: 'status',
  directiveTime: 'directive_time_secs',
  numLaunch: 'simultaneous_launch_number',
  timeLaunch: 'time_out_of_launches',
  scoutingArea: 'destination',
  dumpAmmoPoint: 'reset_point',
  departurePoint: 'start_point',
  landingPoint: 'landing_point',
  uavs: 'uavs',
  payload: 'payload',
  targetType: 'target_type',
  targetsNumber: 'targets_number',
  targetsCoordinates: 'targets_coords',
  timeIntervals: 'time_intervals',
  successLevel: 'success_level',
  strikeLevel: 'strike_level',
  accomplished: 'accomplished',
};

const addMissionTestData = (data) => ({
  directive_time_secs: 10000,
  simultaneous_launch_number: 3,
  landing_point: `{
    "x": 42.71372316507779,
    "y": 45.130462646484375
  }`,
  start_point: `{
    "x": 42.71019146477647,
    "y": 45.17578125
  }`,
  reset_point: `{
    "x": 42.558644041066486,
    "y": 45.22590637207031
  }`,
  destination: `[
    [
      [45.18663, 42.55468],
      [45.19438, 42.60618],
      [45.17865, 42.68137],
      [45.14161, 42.68171],
      [45.12635, 42.62644],
      [45.14234, 42.57288],
      [45.18663, 42.55468]
    ]
  ]`,
  uavs: ['0', '1', '2'],
  success_level: 0.98,
  strike_level: 0.98,
  ...data,
});

const addMissionInputTestData = (data) => ({
  ...data,
  targetType: '1',
  timeIntervals: {
    start: 0,
    order: 2400,
    marching: 2000,
    attack: 300,
    reset: 500,
    returning: 2000,
  },
});

const MissionStatus = {
  REGISTRED: 'created',
  ANALYSED: 'processed',
  LAUNCHED: 'launched',
  REJECTED: 'rejected',
  FINISHED: 'finished',
};

const testMissionsData = {
  171: addMissionTestData({
    status: MissionStatus.REGISTRED,
  }),
  172: addMissionTestData({
    status: MissionStatus.REGISTRED,
  }),
  173: addMissionTestData({
    status: MissionStatus.ANALYSED,
    accomplished: false,
  }),
  174: addMissionTestData({
    status: MissionStatus.ANALYSED,
    accomplished: true,
  }),
  175: addMissionTestData({
    status: MissionStatus.LAUNCHED,
    accomplished: true,
  }),
  176: addMissionTestData({
    status: MissionStatus.REJECTED,
    accomplished: false,
  }),
  177: addMissionTestData({
    status: MissionStatus.REJECTED,
    accomplished: false,
  }),
  178: addMissionTestData({
    status: MissionStatus.REJECTED,
    acomplished: true,
  }),
  179: addMissionTestData({
    status: MissionStatus.FINISHED,
    accomplished: true,
  }),
  180: addMissionTestData({
    status: MissionStatus.FINISHED,
    accomplished: true,
  }),
  181: addMissionTestData({
    status: MissionStatus.FINISHED,
    accomplished: true,
  }),
};

const queues = {
  GET_MISSIONS: 'get_mission_rpc',
  ADD_MISSION: 'add_mission_rpc',
  REMOVE_MISSION: 'delete_mission_rpc',
  START_MISSION: 'start_mission_rpc',
};

class CombatMissionsDataModel extends DataModel {
  async getMissions() {
    const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: {} });
    // const dataResponse = testMissionsData;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapCombatMission);

      const targetCoords = data.targetsCoordinates && JSON.parse(data.targetsCoordinates);
      data.targetsCoordinates =
        targetCoords &&
        targetCoords.map(({ latitude, longitude }) => ({ x: latitude, y: longitude }));

      data.landingPoint = JSON.parse(data.landingPoint);
      data.dumpAmmoPoint = JSON.parse(data.dumpAmmoPoint);
      data.departurePoint = JSON.parse(data.departurePoint);
      data.scoutingArea = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: JSON.parse(data.scoutingArea),
        },
      };
      data.accomplished = !!data.accomplished;
      return { id, ...data };
    });
  }

  async getMissionsByStatus(status) {
    const missions = await this.getMissions();
    const foundMissions = missions ? missions.filter((mission) => mission.status === status) : [];
    return foundMissions;
  }

  async getMission(id) {
    const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: { id } });
    // const [dataResponse = null] = Object.entries(testMissionsData)
    // .filter(([missionId]) => missionId === id)
    // .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(addMissionTestData(dataResponse), mapCombatMission);

    const targetCoords = data.targetsCoordinates && JSON.parse(data.targetsCoordinates);
    data.targetsCoordinates =
      targetCoords &&
      targetCoords.map(({ latitude, longitude }) => ({ x: latitude, y: longitude }));

    data.landingPoint = JSON.parse(data.landingPoint);
    data.dumpAmmoPoint = JSON.parse(data.dumpAmmoPoint);
    data.departurePoint = JSON.parse(data.departurePoint);
    data.scoutingArea = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: JSON.parse(data.scoutingArea) },
    };
    data.uavs = JSON.parse(data.uavs);
    data.accomplished = !!data.accomplished;
    return { id, ...data };
  }

  async getLaunchedMission() {
    let [launched] = await this.getMissionsByStatus(MissionStatus.LAUNCHED);
    return launched || null;
  }

  async addMission(data) {
    const input = unmapObject(addMissionInputTestData(data), mapCombatMission);
    const dataResponse = await this.getData({ queue: queues.ADD_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse.id;
  }

  async recalculateMission(id, data) {
    const input = { id, ...unmapObject(addMissionInputTestData(data), mapCombatMission) };
    const dataResponse = await this.getData({ queue: queues.ADD_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse.accomplished;
  }

  async removeMissions() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }

  async removeMission(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }

  async startMission(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queue.START_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return false;
    return true;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = CombatMissionsDataModel;
