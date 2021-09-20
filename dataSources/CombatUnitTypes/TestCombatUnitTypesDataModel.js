const { mapObject } = require('../helpers');
const CombatUnitTypesDataModel = require('./CombatUnitTypesDataModel');
const { testData } = require('./TestCombatUnitTypesData');

const mapUnitType = {
  name: 'name',
  rangeVelocity: 'vel',
  rangeVelocityUpVertical: 'vertical_vel_up',
  rangeVelocityDownVertical: 'vertical_vel_down',
  cargoType: 'cargo_type',
  maxCargoQuantity: 'cargo_quantity',
  maxFuelConsume: 'fuel_consume',
  maxFuelResourse: 'fuel_resource',
  maxTurningRadius: 'radius_of_turn',
};

class TestCombatUnitTypesDataModel extends CombatUnitTypesDataModel {
  async getTypes() {
    const dataResponse = testData;
    if (this.checkFailedResponse(dataResponse)) return [];
    return Object.entries(dataResponse).map(([id, value]) => {
      const data = mapObject(value, mapUnitType);
      return { id, ...data };
    });
  }
  async getType(id) {
    const [dataResponse] = Object.entries(testData)
      .filter(([type]) => type === id)
      .map(([id, data]) => ({ id, ...data }));
    if (this.checkFailedResponse(dataResponse)) return null;
    const data = mapObject(dataResponse, mapUnitType);
    return { id, ...data };
  }
}

module.exports = TestCombatUnitTypesDataModel;
