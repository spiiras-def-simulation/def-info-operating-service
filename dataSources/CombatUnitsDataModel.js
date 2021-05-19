const DataModel = require('./DataModel');

const mockUnitsData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];

const mockUnitTypesData = [
  {
    id: 1,
    name: 'Самолёт 1',
    rangeVelocity: {
      min: 0,
      max: 10,
    },
    rangeVelocityUpVertical: {
      min: 0,
      max: 10,
    },
    rangeVelocityDownVertical: {
      min: 0,
      max: 10,
    },
    maxCargoQuantity: {
      max: 10,
    },
    maxFuelConsume: {
      max: 10,
    },
    maxTurningRagius: {
      max: 3,
    },
  },
  {
    id: 2,
    name: 'Самолёт 2',
    rangeVelocity: {
      min: 0,
      max: 10,
    },
    rangeVelocityUpVertical: {
      min: 0,
      max: 10,
    },
    rangeVelocityDownVertical: {
      min: 0,
      max: 10,
    },
    maxCargoQuantity: {
      max: 10,
    },
    maxFuelConsume: {
      max: 10,
    },
    maxTurningRagius: {
      max: 3,
    },
  },
  {
    id: 3,
    name: 'Мультир. 1',
    rangeVelocity: {
      min: 0,
      max: 10,
    },
    rangeVelocityUpVertical: {
      min: 0,
      max: 10,
    },
    rangeVelocityDownVertical: {
      min: 0,
      max: 10,
    },
    maxCargoQuantity: {
      max: 10,
    },
    maxFuelConsume: {
      max: 10,
    },
    maxTurningRagius: {
      max: 3,
    },
  },
  {
    id: 4,
    name: 'Мультир. 2',
    rangeVelocity: {
      min: 0,
      max: 10,
    },
    rangeVelocityUpVertical: {
      min: 0,
      max: 10,
    },
    rangeVelocityDownVertical: {
      min: 0,
      max: 10,
    },
    maxCargoQuantity: {
      max: 10,
    },
    maxFuelConsume: {
      max: 10,
    },
    maxTurningRagius: {
      max: 3,
    },
  },
];

const mockUnitRolesData = [
  {
    id: 1,
    name: 'Самолёт Разв.',
    unitType: 1,
  },
  {
    id: 2,
    name: 'Самолёт Ударн.',
    unitType: 2,
  },
];

const queues = {
  GET_UNTIS_LIST: 'show_uav_ids_rpc',
  GET_UNIT_ALTITUDE: 'uav_altitude_rpc',
  GET_UNIT_BATTERY: 'uav_battery_rpc',
  GET_UNIT_LOCAL_POSITION: 'uav_local_pose_rpc',
  GET_UNIT_GLOBAL_POSITION: 'uav_global_pose_rpc',
};

class CombatUnitsDataModel extends DataModel {
  async getUnits() {
    const unitsResponse = await this.getData({ queue: queues.GET_UNTIS_LIST });

    if (!unitsResponse) {
      return null;
    }

    return unitsResponse.map(([id]) => ({ id }));
  }
  async getUnit(id) {
    // const data = mockUnitsData.find((unit) => unit.id === id);

    const unitsResponse = await this.getUnits();

    if (!unitsResponse) {
      return null;
    }

    return unitsResponse.find((unit) => unit.id == id);
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

  // Нереализовано
  async getUnitTypes() {
    const data = mockUnitTypesData;

    return data;
  }
  async getUnitType(id) {
    const data = mockUnitTypesData.find((unitType) => unitType.id === id);

    return data;
  }

  async getUnitRoles() {
    const data = mockUnitRolesData;

    return data;
  }

  async getUnitRole(id) {
    const data = mockUnitRoleData.find((unitRole) => unitRole.id === id);

    return data;
  }
}

module.exports = CombatUnitsDataModel;
