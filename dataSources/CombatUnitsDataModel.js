const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

// const mockUnitsData = [{ id: '1' }];

// const mockUnitTypesData = [
//   {
//     id: 1,
//     name: 'Orlan',
//     vel: [0, 10],
//     vertical_vel_up: [0, 10],
//     vertical_vel_down: [0, 10],
//     cargo_type: 1,
//     cargo_quantity: 10,
//     fuel_consume: 10,
//     radius_of_turn: 3,
//   },
// ];

// const mockUnitRolesData = [
//   {
//     id: 1,
//     name: 'Самолёт Разв.',
//     unitType: 1,
//   },
//   {
//     id: 2,
//     name: 'Самолёт Ударн.',
//     unitType: 2,
//   },
// ];

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

const queues = {
  GET_UNITS: 'get_uav_rpc',
  GET_UNIT_ALTITUDE: 'uav_altitude_rpc',
  GET_UNIT_BATTERY: 'uav_battery_rpc',
  GET_UNIT_LOCAL_POSITION: 'uav_local_pose_rpc',
  GET_UNIT_GLOBAL_POSITION: 'uav_global_pose_rpc',
  GET_UNIT_TYPES: 'get_uav_type_rpc',
  ADD_UNIT_TYPE: 'add_uav_type_rpc',
  REMOVE_UNIT_TYPE: 'delete_uav_type_rpc',
  GET_UNIT_WEAPON_TYPES: 'get_co_weapon_rpc',
};

class CombatUnitsDataModel extends DataModel {
  async getUnits() {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: {} });

    if (!dataResponse) {
      return null;
    }

    return Object.keys(dataResponse).map((id) => ({ id }));
  }
  async getUnit(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNITS, message: { id } });

    if (!dataResponse) {
      return null;
    }

    return dataResponse;
  }

  async getUnitStatus(id) {
    const [altitudeResponse, batteryResponse] = await Promise.all([
      this.getData({ queue: queues.GET_UNIT_ALTITUDE, message: { id } }),
      this.getData({ queue: queues.GET_UNIT_BATTERY, message: { id } }),
    ]);

    const data = {
      altitude: altitudeResponse ? altitudeResponse.altitude : null,
      battery: batteryResponse ? batteryResponse.battery : null,
    };

    return data;
  }
  async getUnitLocalPosition(id) {
    const request = { queue: queues.GET_UNIT_LOCAL_POSITION, message: { id } };
    const positionResponse = await this.getData(request);

    if (!positionResponse) {
      return null;
    }

    const data = {
      coordinates: positionResponse.coordinates,
      angles: positionResponse.angles,
    };

    return data;
  }
  async getUnitGlobalPosition(id) {
    const request = { queue: queues.GET_UNIT_GLOBAL_POSITION, message: { id } };
    const positionResponse = await this.getData(request);

    if (!positionResponse) {
      return null;
    }

    const { altitude, lattitude, longtitude } = positionResponse;
    const data = {
      coordinates: {
        x: lattitude,
        y: longtitude,
        z: altitude,
      },
    };

    return data;
  }

  async getUnitTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_TYPES, message: {} });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitType);
      return { id, ...data };
    });
  }
  async getUnitType(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_UNIT_TYPES,
      message: { id },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnitType);
    return { id, ...data };
  }
  async addUnitType(data) {
    const input = unmapObject(data, mapUnitType);

    const dataResponse = await this.getData({
      queue: queues.ADD_UNIT_TYPE,
      message: { ...input },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return dataResponse;
  }
  async removeUnitType(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_UNIT_TYPE,
      message: { key: 'id', id },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return dataResponse;
  }

  async getUnitWeaponTypes() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_WEAPON_TYPES, message: {} });

    if (!dataResponse || dataResponse.status) {
      return null;
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

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    const data = mapObject(dataResponse, mapUnitWeaponType);
    return { id, ...data };
  }

  // Нереализовано
  // async getUnitRoles() {
  //   const data = mockUnitRolesData;

  //   return data;
  // }
  // async getUnitRole(id) {
  //   const data = mockUnitRoleData.find((unitRole) => unitRole.id === id);

  //   return data;
  // }
}

module.exports = CombatUnitsDataModel;
