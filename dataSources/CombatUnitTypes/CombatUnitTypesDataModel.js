const DataModel = require('../DataModel');
const { mapObject, unmapObject } = require('../helpers');

const mapUnitType = {
  name: 'name',
  rangeVelocity: 'vel',
  rangeVelocityUpVertical: 'vertical_vel_up',
  rangeVelocityDownVertical: 'vertical_vel_down',
  cargoType: 'cargo_type',
  maxCargoQuantity: 'cargo_quantity',
  maxFuelConsume: 'fuel_consume',
  maxFuelResourse: 'fuel_resource',
  maxTurningRadius: 'radius_of_turn',
};

const mapUnitWeaponType = {
  name: 'name',
  hRange: 'range_horizontal',
  vRange: 'range_vertical',
  rapidity: 'rapidity',
};

const queues = {
  GET_UNIT_TYPES: 'get_uav_type_rpc',
  ADD_UNIT_TYPE: 'add_uav_type_rpc',
  REMOVE_UNIT_TYPE: 'delete_uav_type_rpc',

  GET_UNIT_WEAPONS: 'get_co_weapon_rpc',
};

class CombatUnitTypesDataModel extends DataModel {
  async getTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitType);
      return { id, ...data };
    });
  }
  async getType(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitType);
    return { id, ...data };
  }
  async addType(data) {
    const input = unmapObject(data, mapUnitType);
    const dataResponse = await this.getData({ queue: queues.ADD_UNIT_TYPE, message: { ...input } });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async removeTypes() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_TYPE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }
  async removeType(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_TYPE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return id;
  }

  async getWeaponTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_WEAPONS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitWeaponType);
      return { id, ...data };
    });
  }
  async getWeaponType(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_WEAPONS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitWeaponType);
    return { id, ...data };
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

module.exports = CombatUnitTypesDataModel;
