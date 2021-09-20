const { mapObject } = require('../helpers');
const TargetObjectsDataModel = require('./TargetObjectsDataModel');
const { testData } = require('./TestTargetObjectsData');

const mapObjectParams = {
  status: 'status',
  type: 'co_type',
  coordinates: 'coordinates',
  path: 'trajectory',
  image: 'image',
};

class TestTargetObjectsDataModel extends TargetObjectsDataModel {
  async getObjects() {
    const dataResponse = testData;
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapObjectParams);
      const pathData = data.path && JSON.parse(data.path);
      data.path = pathData && pathData.map((point) => ({ x: point[0], y: point[1] }));
      return { id, ...data };
    });
  }
  async getObject(id) {
    const [dataResponse = null] = Object.entries(testData)
      .filter(([missionId]) => missionId === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapObjectParams);
    const pathData = data.path && JSON.parse(data.path);
    data.path = pathData && pathData.map((point) => ({ x: point[0], y: point[1] }));
    return { id, ...data };
  }

  async getDetectedObjects() {
    const dataResponse = Object.entries(testData)
      .map(([id, data]) => ({ id, ...data }))
      .filter(({ status }) => status === TargetObjectsDataModel.Status.DETECTED)
      .reduce((prev, value) => {
        const accumulate = { ...prev };
        accumulate[value.id] = value;
        return accumulate;
      }, {});
    if (this.checkFailedResponse(dataResponse)) return null;
    return Object.entries(dataResponse).map(([id, value]) => {
      return { id, detectedCoordinates: value.coordinates };
    });
  }
}

module.exports = TestTargetObjectsDataModel;
