const { AMQPPubSub } = 'graphql-amqp-subscriptions';

const DataModel = require('./DataModel');

const queues = {
  GET_TARGET_OBJECTS: 'get_co_rpc',
  ADD_TARGET_OBJECT: 'add_co_rpc',
  REMOVE_TARGET_OBJECT: 'delete_co_rpc',
  GET_TARGET_OBJECT_TYPES: 'get_co_type_rpc',
  ADD_TARGET_OBJECT_TYPE: 'add_co_type_rpc',
  REMOVE_TARGET_OBJECT_TYPES: 'delete_co_type_rpc',
  ADD_TARGET_OBJECTS: 'spawn_co_rpc',
};

class TargetObjectsDataModel extends DataModel {
  async getObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_TARGET_OBJECTS, message: {} });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return Object.entries(dataResponse).map(([id]) => ({ id }));
  }
  async getObject(id) {
    const dataResponse = await this.getData({
      queue: queues.GET_TARGET_OBJECTS,
      message: { id },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return { id };
  }

  async addTargetObjectsToMap({ number, location, target }) {
    const input = {
      number,
      TL: { x: location.x - 10, y: location.y - 10 },
      BR: { x: location.x + 10, y: location.y + 10 },
      waypoint: { x: target.x, y: target.y },
    };

    const dataResponse = await this.getData({
      queue: queues.ADD_TARGET_OBJECTS,
      message: { ...input },
    });

    if (!dataResponse || dataResponse.status) {
      return null;
    }

    return dataResponse;
  }

  subscribeTargetObjects() {
    return this.subscribe({
      name: 'CO',
      type: 'topic',
    });
  }
}

module.exports = TargetObjectsDataModel;
