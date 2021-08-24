const { writeFile } = require('fs/promises');
const path = require('path');

const mapObject = (value, map) => {
  const data = {};
  Object.entries(map).forEach(([name, key]) => {
    if (value[key]) {
      data[name] = value[key];
    } else {
      data[name] = null;
    }
  });
  return data;
};

const unmapObject = (value, map) => {
  const data = {};
  Object.entries(map).forEach(([name, key]) => {
    if (value[name] !== undefined) {
      data[key] = value[name];
    }
  });
  return data;
};

const saveMessageFile = (data, fileName) => {
  const filePath = path.join(path.dirname(require.main.filename), 'inputs', `${fileName}.json`);
  return writeFile(filePath, JSON.stringify(data));
};

module.exports = { mapObject, unmapObject, saveMessageFile };
