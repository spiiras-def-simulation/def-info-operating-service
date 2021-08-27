const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');
const { testData, Status } = require('./TargetObjectsData');

const mapObjectParams = {
  status: 'status',
  type: 'co_type',
  image: 'image',
  coordinates: 'coordinates',
};

const queues = {
  GET_OBJECTS: 'get_co_rpc',
  GET_OBJECTS_POS: 'get_co_pose_rpc',
  GET_OBJECTS_PATH: 'get_co_trajectory_rpc',
  GET_MISSION_OBJECTS: 'get_target_coords_for_mission',
  ADD_OBJECT: 'add_co_rpc',
  REMOVE_OBJECT: 'delete_co_rpc',
  ADD_OBJECTS: 'spawn_co_rpc',
  GET_OBJECT_IMAGE: 'get_target_image',
};

class TargetObjectsDataModel extends DataModel {
  async getObjects() {
    // const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: {} });
    const dataResponse = testData;
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapObjectParams);
      return { id, ...data };
    });
  }
  async getObject(id) {
    // const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });
    const [dataResponse = null] = Object.entries(testData)
      .filter(([missionId]) => missionId === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapObjectParams);
    return { id, ...data };
  }
  async getObjectPosition(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS_POS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { coordinates: dataResponse || null };
    return { id, ...data };
  }
  async getObjectPath(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS_PATH, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { path: dataResponse.trajectory };
    return { id, ...data };
  }
  async getObjectImage(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECT_IMAGE, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { image: dataResponse || null };
    return { id, ...data };
  }

  async getMissionObjects() {
    // const dataResponse = await this.getData({ queue: queues.GET_MISSION_OBJECTS, message: {} });
    const dataResponse = Object.entries(testData)
      .map(([id, data]) => ({ id, ...data }))
      .filter(({ status }) => status === Status.DETECTED)
      .reduce((prev, value) => {
        const accumulate = { ...prev };
        accumulate[value.id] = value;
        return accumulate;
      }, {});
    if (this.checkFailedResponse(dataResponse)) return null;
    // if (this.checkFailedResponse(dataResponse)) return null;
    // return Object.entries(dataResponse).map(([id, value]) => {
    //   const [x, y] = value;
    //   return { id, coordinates: { x, y } };
    // });
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapObjectParams);
      return { id, ...data };
    });
  }

  async addObject(data) {
    const input = unmapObject(data, mapObjectParams);
    const dataResponse = await this.getData({ queue: queues.ADD_OBJECT, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return !!dataResponse;
  }
  async removeObject(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_OBJECT, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return !!dataResponse;
  }

  async addObjectsToMap({ number, location, target }) {
    const input = { num: number, point: location, waypoint: target };
    const dataResponse = await this.getData({ queue: queues.ADD_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return !!dataResponse;
  }

  subscribeTargetObjects() {
    return this.subscribe({ name: 'CO', type: 'topic' });
  }

  checkFailedResponse(response) {
    return (
      !response ||
      response.status === 'error' ||
      response.status === 'failed' ||
      response.status === 'Not found'
    );
  }
}

module.exports = TargetObjectsDataModel;
