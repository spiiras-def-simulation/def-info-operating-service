const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const mapObjectParams = {
  type: 'co_type',
};

const queues = {
  GET_OBJECTS: 'get_co_rpc',
  GET_OBJECTS_POS: 'get_co_pose_rpc',
  ADD_OBJECT: 'add_co_rpc',
  REMOVE_OBJECT: 'delete_co_rpc',
  ADD_OBJECTS: 'spawn_co_rpc',
};

class TargetObjectsDataModel extends DataModel {
  async getObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: {} });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return Object.entries(dataResponse).map(([id]) => ({ id }));
  }
  async getObject(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    const posResponse = await this.getData({ queue: queues.GET_OBJECTS_POS, message: { id } });

    return { id, coordinates: posResponse ? posResponse.position : null };
  }

  async addObject(data) {
    const input = unmapObject(data, mapObjectParams);

    const dataResponse = await this.getData({
      queue: queues.ADD_OBJECT,
      message: { ...input },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return !!dataResponse;
  }
  async removeObject(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_OBJECT,
      message: { key: 'id', id },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return !!dataResponse;
  }

  async addObjectsToMap({ number, location, target }) {
    const input = { num: number, point: location, waypoint: target };

    const dataResponse = await this.getData({
      queue: queues.ADD_OBJECTS,
      message: { ...input },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return !!dataResponse;
  }

  subscribeTargetObjects() {
    return this.subscribe({
      name: 'CO',
      type: 'topic',
    });
  }
}

module.exports = TargetObjectsDataModel;
