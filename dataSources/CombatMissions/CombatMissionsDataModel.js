const DataModel = require('../DataModel');
const { mapObject, unmapObject } = require('../helpers');

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
  path: 'trajectory',
};

const addMissionInputTestData = (data) => ({
  ...data,
  targetType: '1',
  timeIntervals: {
    start: 0,
    order: 300,
    marching: 1000,
    attack: 300,
    reset: 500,
    returning: 300,
  },
});

const queues = {
  GET_MISSIONS: 'get_mission_rpc',
  ADD_MISSION: 'add_mission_rpc',
  REMOVE_MISSION: 'delete_mission_rpc',
  START_MISSION: 'start_mission_rpc',
  GET_TARGETS_IMAGE: 'get_target_image',
  CONFIRM_ATTACK_TARGETS: 'confirm_strike_target_rpc',
  SET_MANUAL_CONTROL: 'manual_controll_rpc',
};

class CombatMissionsDataModel extends DataModel {
  async getMissions() {
    const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapCombatMission);
      const mission = this.prepareMissionData(data);
      return { id, ...mission };
    });
  }

  async getMissionsByStatus(status) {
    const missions = await this.getMissions();
    const foundMissions = missions ? missions.filter((mission) => mission.status === status) : [];
    return foundMissions;
  }

  async getMission(id) {
    const dataResponse = await this.getData({ queue: queues.GET_MISSIONS, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapCombatMission);
    const mission = this.prepareMissionData(data);
    return { id, ...mission };
  }

  async getLaunchedMission() {
    const dataResponse = await this.getMissionsByStatus(CombatMissionsDataModel.Status.LAUNCHED);
    const [mission] = dataResponse || [];
    return mission || null;
  }

  async addMission(data) {
    const input = unmapObject(addMissionInputTestData(data), mapCombatMission);
    input.targets_number = 3;
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
    return id;
  }

  async startMission(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.START_MISSION, message: input });
    if (this.checkFailedResponse(dataResponse)) return false;
    return true;
  }

  async confirmAttackTargets() {
    const dataResponse = await this.getData({ queue: queues.CONFIRM_ATTACK_TARGETS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }

  async confirmUnitsManualControl() {
    const dataResponse = await this.getData({ queue: queues.SET_MANUAL_CONTROL, message: {} });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }

  async confirmUnitManualControl(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.SET_MANUAL_CONTROL, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }

  subscribeMissions() {
    return this.subscribe({ name: 'mission', type: 'topic' });
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }

  prepareMissionData(data) {
    const mission = { ...data };

    mission.accomplished = !!mission.accomplished;

    const targetCoords = mission.targetsCoordinates && JSON.parse(mission.targetsCoordinates);
    mission.targetsCoordinates =
      targetCoords &&
      targetCoords.map(({ latitude, longitude }) => ({ x: latitude, y: longitude }));

    mission.landingPoint = JSON.parse(mission.landingPoint);
    mission.dumpAmmoPoint = JSON.parse(mission.dumpAmmoPoint);
    mission.departurePoint = JSON.parse(mission.departurePoint);
    mission.scoutingArea = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: JSON.parse(mission.scoutingArea) },
    };

    mission.uavs = JSON.parse(mission.uavs);

    const pathData = mission.path && JSON.parse(mission.path);
    mission.path = pathData && pathData.points.map((point) => ({ x: point[0], y: point[1] }));

    return mission;
  }
}

CombatMissionsDataModel.Status = {
  REGISTRED: 'created',
  ANALYSED: 'processed',
  LAUNCHED: 'launched',
  REJECTED: 'rejected',
  FINISHED: 'finished',
};

module.exports = CombatMissionsDataModel;
