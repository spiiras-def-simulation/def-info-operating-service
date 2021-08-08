const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const mapUnit = {
  fuelResource: 'fuel_resource',
  tailNumber: 'tail_number',
  timePrepare: 'time_for_prepare',
  type: 'uav_type',
  role: 'uav_role',
};

const mapUnitType = {
  name: 'name',
  rangeVelocity: 'vel',
  rangeVelocityUpVertical: 'vertical_vel_up',
  rangeVelocityDownVertical: 'vertical_vel_down',
  cargoType: 'cargo_type',
  maxCargoQuantity: 'cargo_quantity',
  maxFuelConsume: 'fuel_consume',
  maxTurningRadius: 'radius_of_turn',
};

const mapUnitWeaponType = {
  name: 'name',
  hRange: 'range_horizontal',
  vRange: 'range_vertical',
  rapidity: 'rapidity',
};

const mapUnitRole = {
  name: 'name',
  unitType: 'uav_type',
};

const queues = {
  GET_UNITS: 'get_uav_rpc',
  ADD_UNIT: 'add_uav_rpc',
  REMOVE_UNIT: 'delete_uav_rpc',

  GET_UNIT_PARAMETER: 'uav_get_params_rpc',

  GET_UNIT_TYPES: 'get_uav_type_rpc',
  ADD_UNIT_TYPE: 'add_uav_type_rpc',
  REMOVE_UNIT_TYPE: 'delete_uav_type_rpc',

  GET_UNIT_WEAPON_TYPES: 'get_co_weapon_rpc',

  GET_UNIT_ROLES: 'get_uav_role_rpc',
  ADD_UNIT_ROLE: 'add_uav_role_rpc',
  REMOVE_UNIT_ROLE: 'delete_uav_role_rpc',
};

class CombatUnitsDataModel extends DataModel {
  async getUnits() {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnit);
      return { id, ...data };
    });
  }
  async getUnit(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnit);
    return { id, ...data };
  }
  async addUnit(data) {
    const input = unmapObject(data, mapUnit);

    const dataResponse = await this.getData({ queue: queues.ADD_UNIT, message: { ...input } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }
  async removeUnits() {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT,
      message: { key: 'table' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return true;
  }
  async removeUnit(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }

  async getUnitAltitude(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_PARAMETER,
      message: { id, param: 'altitude' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse.altitude;
  }
  async getUnitBattery(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_PARAMETER,
      message: { id, param: 'battery' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse.battery;
  }
  async getUnitLocalPosition(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_PARAMETER,
      message: { id, param: 'local_pose' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse.coordinates;
  }
  async getUnitGlobalPosition(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_PARAMETER,
      message: { id, param: 'global_pose' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const { altitude = null, lattitude = null, longtitude = null } = dataResponse;
    return { x: lattitude, y: longtitude, z: altitude };
  }

  async addUnitsToMap({ units, location }) {
    const existUnits = await this.getUnits();
    const addedUnitGroups = await Promise.all(
      units.map(({ role, number }) =>
        Promise.all(
          Array(number).map((_, order) =>
            this.addUnit({
              role,
              tailNumber: existUnits.length + order + 1,
              fuelResource: 10,
              timePrepare: 30,
            }),
          ),
        ),
      ),
    );
    const addedUnits = addedUnitGroups.flat().filter((unit) => !!unit);

    const dataResponse = addedUnits;
    // const dataResponse = await this.getData({
    //   queue: queues.ADD_OBJECTS,
    //   message: { ...input },
    // });

    // if (!dataResponse || dataResponse.status) {
    //   return null;
    // }

    return !!dataResponse;
  }

  async getUnitTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitType);
      return { id, ...data };
    });
  }
  async getUnitType(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: { id } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnitType);
    return { id, ...data };
  }
  async addUnitType(data) {
    const input = unmapObject(data, mapUnitType);

    const dataResponse = await this.getData({ queue: queues.ADD_UNIT_TYPE, message: { ...input } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }
  async removeUnitTypes() {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT,
      message: { key: 'table' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return true;
  }
  async removeUnitType(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT_TYPE,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }

  async getUnitWeaponTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_WEAPON_TYPES, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitWeaponType);
      return { id, ...data };
    });
  }
  async getUnitWeaponType(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_WEAPON_TYPES,
      message: { id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnitWeaponType);
    return { id, ...data };
  }

  async getUnitRoles() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_ROLES, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitRole);
      return { id, ...data };
    });
  }
  async getUnitRole(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_ROLES,
      message: { id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnitRole);
    return { id, ...data };
  }
  async addUnitRole(data) {
    const input = unmapObject(data, mapUnitRole);

    const dataResponse = await this.getData({
      queue: queues.ADD_UNIT_ROLE,
      message: { ...input },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }
  async removeUnitRoles() {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT,
      message: { key: 'table' },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return true;
  }
  async removeUnitRole(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT_ROLE,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse.id;
  }

  async getUnitRoleTypes() {
    const unitRoleTypes = [
      { id: '1', name: 'Разведчик' },
      { id: '2', name: 'Ударный' },
    ];

    const dataResponse = unitRoleTypes;

    return dataResponse;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = CombatUnitsDataModel;
