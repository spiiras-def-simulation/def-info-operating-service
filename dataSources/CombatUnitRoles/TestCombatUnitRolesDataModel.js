const { mapObject } = require('../helpers');
const CombatUnitRolesDataModel = require('./CombatUnitRolesDataModel');
const { testData } = require('./TestCombatUnitRolesData');

const mapUnitRole = { name: 'name', unitType: 'uav_type' };

class TestCombatUnitRolesDataModel extends CombatUnitRolesDataModel {
  async getRoles() {
    const dataResponse = testData;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitRole);
      return { id, ...data };
    });
  }
  async getRole(id) {
    const [dataResponse] = Object.entries(testData)
      .filter(([role]) => role === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitRole);
    return { id, ...data };
  }
}

module.exports = TestCombatUnitRolesDataModel;
