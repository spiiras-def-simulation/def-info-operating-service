const DataModel = require('./DataModel');

const { mapObject, unmapObject, saveMessageFile } = require('./helpers');
const { testData } = require('./CombatMissionsData');

const mapCombatMission = {
  status: 'status',
  accomplished: 'accomplished',
  directiveTime: 'directive_time_secs',
  numLaunch: 'simultaneous_launch_number',
  timeLaunch: 'time_out_of_launches',
  successLevel: 'success_level',
  strikeLevel: 'strike_level',
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
  path: 'path',
};

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

const queues = {
  GET_MISSIONS: 'get_mission_rpc',
  ADD_MISSION: 'add_mission_rpc',
  REMOVE_MISSION: 'delete_mission_rpc',
  START_MISSION: 'start_mission_rpc',
  GET_TARGETS_IMAGE: 'get_target_image',
  CONFIRM_ATTACK_TARGETS: 'confirm_attack_targets',
};

class CombatMissionsDataModel extends DataModel {
  async getMissions() {
    // const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: {} });
    const dataResponse = testData;
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
    // const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: { id } });
    const [dataResponse = null] = Object.entries(testData)
      .filter(([missionId]) => missionId === id)
      .map(([id, data]) => ({ id, ...data }));

    if (this.checkFailedResponse(dataResponse)) return null;
    // const data = mapObject(addMissionTestData(dataResponse), mapCombatMission);
    const data = mapObject(dataResponse, mapCombatMission);

    data.accomplished = !!data.accomplished;

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

    data.path = data.path && data.path.map((point) => ({ x: point[0], y: point[1] }));
    return { id, ...data };
  }

  async getLaunchedMission() {
    let [launched] = await this.getMissionsByStatus(MissionStatus.LAUNCHED);
    return launched || null;
  }

  async getMissionPath(id) {
    // const dataResponse = await this.getData({
    //   queue: queues.GET_UNIT_PARAMETER,
    //   message: { id, param: 'trajectory' },
    // });

    // if (this.checkFailedResponse(dataResponse)) {
    //   return null;
    // }

    // const data = { path: dataResponse.trajectory || null };

    const data = { path: null };

    return { id, ...data };
  }

  async addMission(data) {
    const createdData = data;
    createdData.uavs = [0, 1, 2];
    const input = unmapObject(addMissionInputTestData(createdData), mapCombatMission);
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

  async confirmAttackTargets() {
    const dataResponse = await this.getData({ queue: queues.CONFIRM_ATTACK_TARGETS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = CombatMissionsDataModel;
