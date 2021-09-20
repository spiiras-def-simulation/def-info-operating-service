const CombatUnitStatus = {
  REGISTRED: 'registered',
  LAUNCHED: 'launched',
  LOST: 'lost_connection',
  STOPPED: 'stopped',
  ATTACK_TARGET: 'attacking',
};

const testUnits = {
  // 4: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-1',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   detection_radius: 1000,
  //   uav_type: '3',
  //   uav_role: '3',
  // },
  // 5: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-2',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 6: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-3',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 7: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-4',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 8: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-5',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 9: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-6',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 10: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-7',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 11: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-8',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 12: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-9',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 13: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-10',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 14: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-11',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 15: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-12',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 16: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-13',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 17: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-14',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 18: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-15',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 19: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-16',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 20: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-17',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 21: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-18',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 22: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-19',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  // 23: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'RAL-20',
  //   fuel_resource: 0.85,
  //   time_for_prepare: 30,
  //   uav_type: '4',
  //   uav_role: '4',
  // },
  4: {
    status: CombatUnitStatus.LAUNCHED,
    tail_number: 'ORLAN-1',
    fuel_resource: 16,
    time_for_prepare: 30,
    detection_radius: 1000,
    uav_type: '1',
    uav_role: '1',
  },
  5: {
    status: CombatUnitStatus.LAUNCHED,
    tail_number: 'ORLAN-2',
    fuel_resource: 16,
    time_for_prepare: 30,
    uav_type: '2',
    uav_role: '2',
    attack_coords: `[{ "x": 1117.9521916536614, "y": 2262.798832998611 }]`,
  },
  6: {
    status: CombatUnitStatus.LAUNCHED,
    tail_number: 'ORLAN-3',
    fuel_resource: 16,
    time_for_prepare: 30,
    uav_type: '2',
    uav_role: '2',
    attack_coords: `[{ "x": 1942.0389028536156, "y": 2076.4835765538737 }, { "x": 1557.4651042930782, "y": 2074.0949194198474 }]`,
  },
  7: {
    status: CombatUnitStatus.LAUNCHED,
    tail_number: 'ORLAN-4',
    fuel_resource: 16,
    time_for_prepare: 30,
    uav_type: '2',
    uav_role: '2',
  },
  // 8: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-5',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 9: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-6',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 10: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-7',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 11: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-8',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 12: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-9',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 13: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-10',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 14: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-11',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 15: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-12',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 16: {
  //   status: CombatUnitStatus.LOST,
  //   tail_number: 'ORLAN-13',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 17: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-14',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 18: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-15',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 19: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-16',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 20: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-17',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 21: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-18',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 22: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-19',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
  // 23: {
  //   status: CombatUnitStatus.LAUNCHED,
  //   tail_number: 'ORLAN-20',
  //   fuel_resource: 16,
  //   time_for_prepare: 30,
  //   uav_type: '2',
  //   uav_role: '2',
  // },
};

const testUnitParams = {
  4: {
    altitude: 1200.0,
    battery: 0.9,
    tvsSize: 535,
    localPosition: {
      x: 1600.4609327027574,
      y: 2341.6245184177533,
    },
    globalPosition: {
      lattitude: 42.6486067022724,
      longtitude: 45.179471969604485,
      altitude: 1200.0,
    },
  },
  5: {
    altitude: 400.0,
    battery: 0.9,
    localPosition: {
      x: 1781.9988748813048,
      y: 3010.4485159134492,
    },
    globalPosition: {
      lattitude: 42.653025674055456,
      longtitude: 45.18110275268555,
      altitude: 400.0,
    },
  },
  6: {
    altitude: 400.0,
    battery: 0.9,
    localPosition: {
      x: 2202.4025304494426,
      y: 2580.490231811069,
    },
    globalPosition: {
      lattitude: 42.650184942521335,
      longtitude: 45.184879302978516,
      altitude: 400.0,
    },
  },
};

module.exports = {
  testUnits,
  testUnitParams,
};