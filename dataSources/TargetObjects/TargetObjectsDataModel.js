const { PubSub } = require('graphql-subscriptions');

const DataModel = require('../DataModel');
const { mapObject, unmapObject } = require('../helpers');

const mapObjectParams = {
  status: 'status',
  type: 'co_type',
  coordinates: 'coordinates',
  path: 'trajectory',
  image: 'image',
};

const queues = {
  GET_OBJECTS: 'get_co_rpc',
  GET_OBJECTS_POS: 'get_co_pose_rpc',
  GET_DETECTED_OBJECTS: 'get_target_coords_for_mission',
  ADD_OBJECT: 'add_co_rpc',
  REMOVE_OBJECT: 'delete_co_rpc',
  ADD_OBJECTS: 'spawn_co_rpc',
  GET_OBJECT_IMAGE: 'get_target_image',
};

class TargetObjectsDataModel extends DataModel {
  constructor(options = {}) {
    super(options);

    // this.pubsubDetected = new PubSub();
  }

  async getObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapObjectParams);
      const pathData = data.path && JSON.parse(data.path);
      data.path = pathData && pathData.map((point) => ({ x: point[0], y: point[1] }));
      return { id, ...data };
    });
  }
  async getObject(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapObjectParams);
    const pathData = data.path && JSON.parse(data.path);
    data.path = pathData && pathData.map((point) => ({ x: point[0], y: point[1] }));
    return { id, ...data };
  }
  async getObjectPosition(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS_POS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = { coordinates: dataResponse || null };
    return { id, ...data };
  }

  async getDetectedObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_DETECTED_OBJECTS, message: {} });
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, [x, y, z]]) => {
      return { id, detectedCoordinates: { x, y, z } };
    });
  }
  async getDetectedObjectImage(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECT_IMAGE, message: { id } });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = dataResponse;
    return { id, ...data };
  }

  async addObject(data) {
    const input = unmapObject(data, mapObjectParams);
    const dataResponse = await this.getData({ queue: queues.ADD_OBJECT, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return !!dataResponse;
  }
  async removeObjects() {
    const input = { key: 'table' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_OBJECT, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
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

  // subscribeDetectedObjects() {
  //   if (!this.pusherDetected) {
  //     this.pusherDetected = setInterval(async () => {
  //       const detected = await this.getDetectedObjects();
  //       if (detected && detected.length) {
  //         this.pubsubDetected.publish('TARGETS_DETECTED', {
  //           objects: detected,
  //         });
  //       }
  //     }, 500);
  //   }
  //   return this.pubsubDetected;
  // }

  checkFailedResponse(response) {
    return (
      !response ||
      response.status === 'error' ||
      response.status === 'failed' ||
      response.status === 'Not found'
    );
  }
}

TargetObjectsDataModel.Status = {
  REGISTRED: 'created',
  LAUNCHED: 'launched',
  DETECTED: 'detected',
  LOST: 'lost',
  DESTROYED: 'destroyed',
  STOPPED: 'stopped',
};

module.exports = TargetObjectsDataModel;
