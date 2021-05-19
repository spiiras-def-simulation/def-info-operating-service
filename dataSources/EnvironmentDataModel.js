const DataModel = require('./DataModel');

const mockData = {
  weatherStatus: {
    temperature: 20.0,
    wind: {
      velocity: 10.4,
      direction: {
        x: 0.0,
        y: 1.0,
        z: 0.0,
      },
    },
    pressure: 101000,
  },
  currentTime: new Date(2021, 5, 1, 10, 45, 30),
};

const queues = {
  GET_WIND_DIRECTION: 'wind_direction_rpc',
  GET_WIND_VELOCITY: 'wind_velocity_rpc',
  GET_TEMPERATURE: 'temperature_rpc',
};

const exchange = 'environment';

class EnvironmentDataModel extends DataModel {
  async getWeatherState() {
    // const data = mockData.weatherStatus;

    const [windResponse, temperatureResponse] = await Promise.all([
      this.getData({ queue: queues.GET_WIND_DIRECTION }),
      this.getData({ queue: queues.GET_TEMPERATURE }),
    ]);

    const data = { wind: { ...windResponse }, temperature: temperatureResponse.temperature };

    return data;
  }

  async getEnvironmentTime() {
    const data = mockData.currentTime;

    return data;
  }

  async subscribeData() {
    return this.subscribe({
      name: exchange,
      type: 'topic',
      options: {
        durable: false,
        autoDelete: false,
      },
    });
  }
}

module.exports = EnvironmentDataModel;
