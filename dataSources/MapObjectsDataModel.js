const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const mapMapObject = {
  type: 'type',
  coordinates: 'area',
};

const mapAddedMapObjects = {
  radarJammingArea: 'rep',
  radarWarfareArea: 'reb',
  impassableArea: 'ban',
};

const queues = {
  GET_OBJECTS: 'get_uav_regions_rpc',
  ADD_OBJECTS: 'add_regions_rpc',
};

class MapObjectsDataModel extends DataModel {
  async getObjects(type) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { type } });

    if (this.checkFailedResponse(dataResponse)) return null;

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapMapObject);
      return { id, ...data };
    });
  }
  async getObject(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) return null;

    const data = mapObject(dataResponse, mapMapObject);
    return { id, ...data };
  }
  async addObject(data) {
    const input = unmapObject(data, mapAddedMapObjects);

    const dataResponse = await this.getData({ queue: queues.ADD_OBJECTS, message: { ...input } });

    if (this.checkFailedResponse(dataResponse)) return null;

    return dataResponse;
  }
  async removeObject(id) {
    const dataResponse = await this.getData({
      queue: queues.REMOVE_OBJECT,
      message: { key: 'id', id },
    });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    return dataResponse;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = MapObjectsDataModel;
