const { mapObject } = require('../helpers');
const CombatMissionsDataModel = require('./CombatMissionsDataModel');
const { testData } = require('./TestCombatMissionsData');

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

class TestCombatMissionsDataModel extends CombatMissionsDataModel {
  async getMissions() {
    const dataResponse = testData;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapCombatMission);
      const mission = this.prepareMissionData(data);
      return { id, ...mission };
    });
  }

  async getMission(id) {
    const [dataResponse = null] = Object.entries(testData)
      .filter(([missionId]) => missionId === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapCombatMission);
    const mission = this.prepareMissionData(data);
    return { id, ...mission };
  }
}

module.exports = TestCombatMissionsDataModel;
