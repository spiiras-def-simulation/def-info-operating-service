const DataModel = require('./DataModel');

const { mapObject } = require('./helpers');

const mapMapObject = {
  type: 'type',
  coordinates: 'area',
};

const mapObjectTypes = {
  radarJammingArea: 'rep',
  radarWarfareArea: 'reb',
  impassableArea: 'ban',
};

const queues = {
  GET_OBJECTS: 'get_uav_regions_rpc',
  ADD_OBJECTS: 'add_regions_rpc',
  UPDATE_OBJECTS: 'edit_regions_rpc',
  REMOVE_OBJECTS: 'delete_regions_rpc',
};

class MapObjectsDataModel extends DataModel {
  async getObjects() {
    const input = { all: '' };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapMapObject);
      return { id, ...data };
    });
  }
  async getObjectsByType(type) {
    const input = { type };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapMapObject);
      return { id, ...data };
    });
  }
  async getObject(id) {
    const input = { id };
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapMapObject);
    return { id, ...data };
  }
  async addObjects(data) {
    const addedObjects = await Promise.all(
      Object.entries(mapObject(data, mapObjectTypes)).map(([objType, objects]) =>
        Promise.all(objects.map((object) => this.addObject(objType, object))),
      ),
    );
    const dataResponse = addedObjects.flat().filter((object) => !!object);
    return dataResponse;
  }
  async addObject(type, data) {
    const input = {};
    input[type] = data;
    const dataResponse = await this.getData({ queue: queues.ADD_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async updateObject(id, data) {
    const input = { id, area: data };
    const dataResponse = await this.getData({ queue: queues.UPDATE_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }
  async removeObjects() {
    const input = { key: 'all' };
    const dataResponse = await this.getData({ queue: queues.REMOVE_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return true;
  }
  async removeObject(id) {
    const input = { key: 'id', id };
    const dataResponse = await this.getData({ queue: queues.REMOVE_OBJECTS, message: input });
    if (this.checkFailedResponse(dataResponse)) return null;
    return dataResponse;
  }

  checkFailedResponse(response) {
    return !response || response.status === 'error' || response.status === 'Not found';
  }
}

module.exports = MapObjectsDataModel;
