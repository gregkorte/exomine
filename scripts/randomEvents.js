import {
  getColonies,
  getFacilities,
  getPirates,
} from "../api/databaseManager.js";
import {
  hireColonySecurityForces,
  hireFacilitySecurityForces,
} from "./randomEvents/reForces.js";
import {
  addFacilityMinerals,
  changeFacilityStatus,
} from "./randomEvents/reFacility.js";
import {
  changeGovernorStatus,
  recruitNewGovernor,
} from "./randomEvents/reGovernor.js";
import { checkCensusEvents } from "./randomEvents/reCensus.js";
import { startPirateEvent } from "./randomEvents/rePirate.js";
import { getRandomN } from "./utilities.js";

// This controls the frequency of events
export const intervalState = {
  raids: 15, // default 10
  govStatus: 20, // default 20
  facilityStatus: 10, // default 10
  colSf: 10, // default 10
  facSf: 5, // default 5
};

export const eventState = {
  interval: 0,
  lastPirateRaid: 0,
  lastGovernorActive: 0,
  lastGovernorRecruited: 0,
  lastGovernorStatusUpdate: 0,
  lastFacilityStatusUpdate: 0,
  numFacilities: Object.keys(await getFacilities()).length,
  numColonies: Object.keys(await getColonies()).length,
  numGovernors: 0,
  numPirateFactions: 0,
  numPirates: 0,
  lastColonySf: 0,
  lastFacilitySf: 0,
  activityLog: "",
};

export const fireEventCheck = async () => {
  eventState.interval += 1;
  const eventList = createEventList();
  await checkCensusEvents();
  console.log(eventState);

  const events = {
    1: addFacilityMinerals,
    2: startPirateEvent,
    3: hireColonySecurityForces,
    4: hireFacilitySecurityForces,
    5: changeGovernorStatus,
    6: changeFacilityStatus,
    7: recruitNewGovernor,
  };

  for (const event of eventList) {
    await events[event]();
  }

  // if (
  //   eventState.activityLog != "" &&
  //   eventState.activityLog.slice(4) != "<hr>"
  // ) {
  //   setLogDivider();
  // }
};

const createEventList = () => {
  const events = [];

  while (events.length < 3) {
    const [num] = getRandomN(7, 1, 1);
    if (events.indexOf(num) === -1) {
      events.push(num);
    }
  }

  return events;
};

export const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  let timeout;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay = getRandomN(minDelay, maxDelay, 1);

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      clearTimeout(timeout);
    },
  };
};

export let interval = setRandomInterval(fireEventCheck, 10000, 15000);
// 20000 20sec
// 30000 30sec
// 2400000 40min

export const clearInterval = () => {
  interval.clear();
};

export const resumeInterval = () => {
  interval = setRandomInterval(fireEventCheck, 10000, 15000);
};

const setLogDivider = () => {
  const str = `<hr>`;
  eventState.activityLog = str.concat(eventState.activityLog);
};
