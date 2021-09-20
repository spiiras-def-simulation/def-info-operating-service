const { mapObject } = require('../helpers');
const CombatUnitsDataModel = require('./CombatUnitsDataModel');
const { testUnits, testUnitParams } = require('./TestCombatUnitsData');

const mapUnit = {
  status: 'status',
  fuelResource: 'fuel_resource',
  tailNumber: 'tail_number',
  timePrepare: 'time_for_prepare',
  detectionRadius: 'detection_radius',
  type: 'uav_type',
  role: 'uav_role',
  attackPoints: 'attack_coords',
};

class TestCombatUnitsDataModel extends CombatUnitsDataModel {
  async getUnits() {
    const dataResponse = testUnits;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnit);
      data.attackPoints = JSON.parse(data.attackPoints);
      return { id, ...data };
    });
  }
  async getUnit(id) {
    const [dataResponse = null] = Object.entries(testUnits)
      .filter(([unit]) => unit === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnit);
    data.attackPoints = JSON.parse(data.attackPoints);
    return { id, ...data };
  }

  async getUnitAltitude(id) {
    const dataResponse = testUnitParams[id] || null;
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { altitude: dataResponse.altitude || null };
    return { id, ...data };
  }
  async getUnitTimeLeft(id) {
    const dataResponse = testUnitParams[id] || null;
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { timeLeft: dataResponse.battery || null };
    return { id, ...data };
  }
  async getUnitTVS(id) {
    const dataResponse = testUnitParams[id] || null;
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { tvsSize: dataResponse.tvsSize || null };
    return { id, ...data };
  }
  async getUnitLocalPosition(id) {
    const dataResponse = testUnitParams[id] || null;
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { localPosition: dataResponse.coordinates || null };
    return { id, ...data };
  }
  async getUnitGlobalPosition(id) {
    const { globalPosition: dataResponse = null } = testUnitParams[id] || {};
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = {
      globalPosition: {
        x: dataResponse.lattitude || null,
        y: dataResponse.longtitude || null,
        z: dataResponse.altitude || null,
      },
    };
    return { id, ...data };
  }
}

module.exports = TestCombatUnitsDataModel;
