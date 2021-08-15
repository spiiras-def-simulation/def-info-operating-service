const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const queues = {
  GET_COMBAT_MISSIONS: 'get_mission_rpc',
  ADD_COMBAT_MISSION: 'add_mission_rpc',
  REMOVE_COMBAT_MISSION: 'delete_mission_rpc',
};

const mapCombatMission = {
  directiveTime: 'directive_time_secs',
  numLaunch: 'simultaneous_launch_number',
  timeLaunch: 'time_out_of_launches',
  scoutingArea: 'destination',
  dumpAmmoPoint: 'reset_point',
  departurePoint: 'departure_point',
  landingPoint: 'landing_point',
  uavs: 'uavs',
  payload: 'payload',
  targetType: 'target_type',
  targetsNumber: 'targets_number',
  targetsCoords: 'targets_coords',
  timeIntervals: 'time_intervals',
  successLevel: 'success_level',
};

class CombatMissionsDataModel extends DataModel {
  async getMissions() {
    const dataResponse = await this.getData({ queue: queues.GET_COMBAT_MISSIONS, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapCombatMission);
      return { id, ...data };
    });
  }

  async getMission(id) {
    const dataResponse = await this.getData({ queue: queues.GET_COMBAT_MISSIONS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapCombatMission);

    data.numLaunch = 3;
    data.landingPoint = { x: 60.42868573770251, y: 57.196174375247814 };
    data.departurePoint = { x: 60.427966053813364, y: 57.17429784515233 };
    data.dumpAmmoPoint = { x: 60.41805819775825, y: 57.19308592394023 };
    data.uavs = ['23', '24', '25'];
    data.successLevel = 0.98;
    data.strikeLevel = 0.98;

    return { id, ...data };
  }

  async addMission(data) {
    const input = unmapObject(
      {
        targetType: '1',
        timeIntervals: {
          start: 0,
          order: 2400,
          marching: 2000,
          attack: 300,
          reset: 500,
          returning: 2000,
        },
        ...data,
      },
      mapCombatMission,
    );

    const dataResponse = await this.getData({
      queue: queues.ADD_COMBAT_MISSION,
      message: { ...input },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }

  async removeMissions() {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_COMBAT_MISSION,
      message: { key: 'table' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return true;
  }

  async removeMission(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_COMBAT_MISSION,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = CombatMissionsDataModel;
