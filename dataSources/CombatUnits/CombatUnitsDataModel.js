const DataModel = require('../DataModel');
const { mapObject, unmapObject } = require('../helpers');

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

const queues = {
  GET_UNITS: 'get_uav_rpc',
  ADD_UNIT: 'add_uav_rpc',
  REMOVE_UNIT: 'delete_uav_rpc',

  GET_UNIT_PARAMETER: 'uav_get_params_rpc',
};

class CombatUnitsDataModel extends DataModel {
  async getUnits() {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnit);
      data.attackPoints = JSON.parse(data.attackPoints);
      return { id, ...data };
    });
  }
  async getUnit(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnit);
    data.attackPoints = JSON.parse(data.attackPoints);
    return { id, ...data };
  }

  async addUnits(data) {
    const { number, ...unitData } = data;
    const existUnits = await this.getUnits();
    const addedUnits = await Promise.all(
      Array(number)
        .fill()
        .map((_, order) =>
          this.addUnit({
            tailNumber: existUnits.length + order + 1,
            ...unitData,
          }),
        ),
    );
    const dataResponse = addedUnits.filter((unit) => !!unit);
    return !!dataResponse.length;
  }
  async addUnit(data) {
    const input = unmapObject(data, mapUnit);
    const dataResponse = await this.getData({ queue: queues.ADD_UNIT, message: { ...input } });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  // async removeUnits() {
  //   const input = { key: 'table' };
  //   const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT, message: input });
  //   if (this.checkFailedResponse(dataResponse)) return null;
  //   return true;
  // }
  async removeUnit(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return id;
  }

  async getUnitAltitude(id) {
    const input = { id, param: 'altitude' };
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_PARAMETER, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { altitude: dataResponse.altitude || null };
    return { id, ...data };
  }
  async getUnitTimeLeft(id) {
    const input = { id, param: 'battery' };
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_PARAMETER, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { timeLeft: dataResponse.battery || null };
    return { id, ...data };
  }
  async getUnitLocalPosition(id) {
    const input = { id, param: 'local_pose' };
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_PARAMETER, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { localPosition: dataResponse.coordinates || null };
    return { id, ...data };
  }
  async getUnitGlobalPosition(id) {
    const input = { id, param: 'global_pose' };
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_PARAMETER, message: input });
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

  subscribeUnitObjects() {
    return this.subscribe({ name: 'UAV', type: 'topic' });
  }

  checkFailedResponse(response) {
    return (
      !response ||
      response.status === 'error' ||
      response.status === 'Not found' ||
      response.status === 'failed'
    );
  }
}

module.exports = CombatUnitsDataModel;
