import { getColonies, getFacilities, getPirates } from "../api/databaseManager.js"
import { hireColonySecurityForces, hireFacilitySecurityForces } from "./randomEvents/reForces.js"
import { addFacilityMinerals, changeFacilityStatus } from "./randomEvents/reFacility.js"
import { changeGovernorStatus, recruitNewGovernor } from "./randomEvents/reGovernor.js"
import { checkCensusEvents } from "./randomEvents/reCensus.js"
import { startPirateEvent } from "./randomEvents/rePirate.js"
import { getRandomN } from "./utilities.js"

export const intervalState = {
  "raids": 10,
  "govStatus": 50,
  "facilityStatus": 40,
  "colSf": 50,
  "facSf": 5
}

export const eventState = {
  "interval": 0,
  "lastPirateRaid": 0,
  "lastGovernorActive": 0,
  "lastGovernorRecruited": 0,
  "lastGovernorStatusUpdate": 0,
  "lastFacilityStatusUpdate": 0,
  "numFacilities": Object.keys(await getFacilities()).length,
  "numColonies": Object.keys(await getColonies()).length,
  "numGovernors": 0,
  "numPirateFactions": 0,
  "numPirates": 0,
  "lastColonySf": 0,
  "lastFacilitySf": 0,
  "activityLog": ''
}

export const fireEventCheck = async () => {
  eventState.interval += 1
  const eventList = createEventList()
  await checkCensusEvents()
  console.log(eventState)

  const events = {
    "1": addFacilityMinerals,
    "2": startPirateEvent,
    "3": hireColonySecurityForces,
    "4": hireFacilitySecurityForces,
    "5": changeGovernorStatus,
    "6": changeFacilityStatus,
    "7": recruitNewGovernor
  }

  for(const event of eventList) {
    await events[event]()
  }

  setLogDivider()
}

const createEventList = () => {
  const events = []

  while(events.length < 3) {
    const [num] = getRandomN(7, 1, 1)
    if(events.indexOf(num) === -1){
      events.push(num)
    }
  }

  return events
}

export const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  let timeout;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay = getRandomN(minDelay, maxDelay, 1)

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() { clearTimeout(timeout) },
  };
};

export let interval = setRandomInterval(fireEventCheck, 20000, 30000);
// 1200000 20min
// 2400000 40min

export const clearInterval = () => {
  interval.clear();
}

export const resumeInterval = () => {
  interval = setRandomInterval(fireEventCheck, 20000, 30000);
}

const setLogDivider = () => {
  const str = `<hr>`
  eventState.activityLog = str.concat(eventState.activityLog)
}
