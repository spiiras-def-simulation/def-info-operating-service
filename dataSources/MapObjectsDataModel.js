const DataModel = require('./DataModel');

const { mapObject, unmapObject } = require('./helpers');

const mapMapObject = {};

class MapObjectsDataModel extends DataModel {
  async getObjects() {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: {} });

    if (this.checkFailedResponse(dataResponse)) {
      return [];
    }

    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapMapObject);
      return { id, ...data };
    });
  }
  async getObject(id) {
    const dataResponse = await this.getData({ queue: queues.GET_OBJECTS, message: { id } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

    const data = mapObject(dataResponse, mapMapObject);
    return { id, ...data };
  }
  async addObject(data) {
    const input = unmapObject(data, mapMapObject);

    const dataResponse = await this.getData({ queue: queues.ADD_OBJECT, message: { ...input } });

    if (this.checkFailedResponse(dataResponse)) {
      return null;
    }

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
