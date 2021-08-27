const DataModel = require('./DataModel');

const { mapObject, unmapObject, saveMessageFile } = require('./helpers');

const { testUnits, testUnitParams, testUnitTypes, testUnitRoles } = require('./CombatUnitsData');

const CombatUnitStatus = {
  REGISTRED: 'registered',
  LAUNCHED: 'launched',
  LOST: 'lost_connection',
  STOPPED: 'stopped',
  ATTACK_TARGET: 'attacking',
};

const testUnitsData = {
  0: {
    status: CombatUnitStatus.LAUNCHED,
    tail_number: '1',
    fuel_resource: 16,
    time_for_prepare: 30,
    detection_radius: 1000,
    uav_type: '1',
    uav_role: '1',
  },
  1: {
    status: CombatUnitStatus.ATTACK_TARGET,
    tail_number: '1',
    fuel_resource: 16,
    time_for_prepare: 30,
    uav_type: '2',
    uav_role: '2',
  },
  2: {
    status: CombatUnitStatus.ATTACK_TARGET,
    tail_number: '1',
    fuel_resource: 16,
    time_for_prepare: 30,
    uav_type: '2',
    uav_role: '2',
  },
};

const testUnitParamsData = {
  0: {
    globalPosition: {
      lattitude: 42.69442249442193,
      longtitude: 45.171403884887695,
      altitude: 1200,
    },
  },
  1: {
    globalPosition: {
      lattitude: 42.69940592189281,
      longtitude: 45.17801284790039,
      altitude: 1200,
    },
  },
  2: {
    globalPosition: {
      lattitude: 42.69934284303157,
      longtitude: 45.16779899597167,
      altitude: 1200,
    },
  },
  26: {
    globalPosition: {
      lattitude: 42.69934284303157,
      longtitude: 45.16779899597167,
      altitude: 1200,
    },
  },
};

const testUnitTypesData = {
  1: {
    name: 'Орлан-Р',
  },
  2: {
    name: 'Орлан-У',
  },
};

const testUnitRolesData = {
  1: {
    name: 'Разведчик',
    uav_type: '1',
  },
  2: {
    name: 'Ударный',
    uav_type: '2',
  },
};

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
    // const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: {} });
    const dataResponse = testUnits;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnit);
      return { id, ...data };
    });
  }
  async getUnit(id) {
    // const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: { id } });
    const [dataResponse = null] = Object.entries(testUnits)
      .filter(([unit]) => unit === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
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

    const data = { localPosition: dataResponse.coordinates || null };

    return { id, ...data };
  }
  async getUnitGlobalPosition(id) {
    // const input = { id, param: 'global_pose' };
    // const dataResponse = await this.getData({ queue: queues.GET_UNIT_PARAMETER, message: input });
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
  async getUnitPath(id) {
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

  async addUnitsToMap({ units }) {
    const existUnits = await this.getUnits();
    const addedUnitGroups = await Promise.all(
      units.map(({ role, number }) =>
        Promise.all(
          Array(number)
            .fill()
            .map((_, order) =>
              this.addUnit({
                role,
                tailNumber: existUnits.length + order + 1,
                fuelResource: 16,
                timePrepare: 30,
              }),
            ),
        ),
      ),
    );
    const addedUnits = addedUnitGroups.flat().filter((unit) => !!unit);
    const dataResponse = addedUnits;
    return !!dataResponse;
  }

  async getUnitTypes() {
    // const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: {} });
    const dataResponse = testUnitTypes;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitType);
      return { id, ...data };
    });
  }
  async getUnitType(id) {
    // const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: { id } });
    const [dataResponse] = Object.entries(testUnitTypes)
      .filter(([type]) => type === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitType);
    return { id, ...data };
  }
  async addUnitType(data) {
    const input = unmapObject(data, mapUnitType);
    const dataResponse = await this.getData({ queue: queues.ADD_UNIT_TYPE, message: { ...input } });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async removeUnitTypes() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_TYPE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }
  async removeUnitType(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_TYPE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return id;
  }

  async getUnitWeaponTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_WEAPON_TYPES, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
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
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitWeaponType);
    return { id, ...data };
  }

  async getUnitRoles() {
    // const dataResponse = await this.getData({ queue: queues.GET_UNIT_ROLES, message: {} });
    const dataResponse = testUnitRoles;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitRole);
      return { id, ...data };
    });
  }
  async getUnitRole(id) {
    // const dataResponse = await this.getData({ queue: queues.GET_UNIT_ROLES, message: { id } });
    const [dataResponse] = Object.entries(testUnitRoles)
      .filter(([role]) => role === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitRole);
    return { id, ...data };
  }
  async addUnitRole(data) {
    const input = unmapObject(data, mapUnitRole);
    const dataResponse = await this.getData({ queue: queues.ADD_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async removeUnitRoles() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }
  async removeUnitRole(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
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
