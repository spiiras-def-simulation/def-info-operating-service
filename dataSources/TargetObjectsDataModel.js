const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const mapObjectParams = {
  type: 'co_type',
};

const queues = {
  GET_OBJECTS: 'get_co_rpc',
  GET_OBJECTS_POS: 'get_co_pose_rpc',
  GET_OBJECTS_PATH: 'get_co_trajectory_rpc',
  ADD_OBJECT: 'add_co_rpc',
  REMOVE_OBJECT: 'delete_co_rpc',
  ADD_OBJECTS: 'spawn_co_rpc',
};

class TargetObjectsDataModel extends DataModel {
  async getObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: {} });

    if (this.checkFailedResponse(dataResponse)) return null;

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapObjectParams);
      return { id, ...data };
    });
  }
  async getObject(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) return null;

    const data = mapObject(dataResponse, mapObjectParams);
    return { id, ...data };
  }
  async getObjectPosition(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS_POS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) return null;

    const data = { coordinates: dataResponse || null };

    return { id, ...data };
  }
  async getObjectPath(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS_PATH, message: { id } });

    if (this.checkFailedResponse(dataResponse)) return null;

    const data = { path: dataResponse.trajectory };

    return { id, ...data };
  }

  async addObject(data) {
    const input = unmapObject(data, mapObjectParams);

    const dataResponse = await this.getData({
      queue: queues.ADD_OBJECT,
      message: { ...input },
    });

    if (this.checkFailedResponse(dataResponse)) return null;

    return !!dataResponse;
  }
  async removeObject(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_OBJECT,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) return null;

    return !!dataResponse;
  }

  async addObjectsToMap({ number, location, target }) {
    const input = { num: number, point: location, waypoint: target };

    const dataResponse = await this.getData({
      queue: queues.ADD_OBJECTS,
      message: { ...input },
    });

    if (this.checkFailedResponse(dataResponse)) return null;

    return !!dataResponse;
  }

  subscribeTargetObjects() {
    return this.subscribe({ name: 'CO', type: 'topic' });
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = TargetObjectsDataModel;
