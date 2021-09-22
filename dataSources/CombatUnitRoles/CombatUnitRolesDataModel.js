const DataModel = require('../DataModel');
const { mapObject, unmapObject } = require('../helpers');

const mapUnitRole = { name: 'name', unitType: 'uav_type' };

const unitRoleTypes = [
  { id: '1', name: 'Разведчик' },
  { id: '2', name: 'Ударный' },
];

const queues = {
  GET_UNIT_ROLES: 'get_uav_role_rpc',
  ADD_UNIT_ROLE: 'add_uav_role_rpc',
  REMOVE_UNIT_ROLE: 'delete_uav_role_rpc',
};

class CombatUnitRolesDataModel extends DataModel {
  async getRoles() {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_ROLES, message: {} });
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitRole);
      return { id, ...data };
    });
  }
  async getRole(id) {
    const dataResponse = await this.getData({ queue: queues.GET_UNIT_ROLES, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitRole);
    return { id, ...data };
  }
  async addRole(data) {
    const input = unmapObject(data, mapUnitRole);
    const dataResponse = await this.getData({ queue: queues.ADD_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async removeRoles() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }
  async removeRole(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_UNIT_ROLE, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return id;
  }

  async getRoleTypes() {
    const dataResponse = unitRoleTypes;
    return dataResponse;
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

module.exports = CombatUnitRolesDataModel;
