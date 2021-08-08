const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

// const mockMission = {
//   id: '1',
//   directive_time_secs: 11,
//   time_out_of_launches: 123,
//   simultaneous_launch_number: 123,
//   reset_point: 123,
//   landing_point: 123,
//   uavs: 123,
//   payload: 123,
//   target_type: 123,
//   dest_poligon: 123,
//   targets_number: 123,
//   targets_coords: 123,
//   time_intervals: 123,
//   success_level: 123,
// };

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

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    const data = {};
    Object.entries(mapCombatMission).forEach(([name, key]) => {
      if (dataResponse[key]) {
        data[name] = dataResponse[key];
      } else {
        data[name] = null;
      }
    });

    return {
      id,
      ...data,
    };
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

    if (!dataResponse || dataResponse.status) {
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

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return dataResponse;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = CombatMissionsDataModel;
