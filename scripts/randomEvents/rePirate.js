import { eventState, intervalState } from "../randomEvents.js"
import { getPirate } from "../../api/databaseManager.js"
import { setActivityLog } from "../ActivityLog.js"
import { facilityAttack } from "./reFacility.js"
import { colonyAttack } from "./reColony.js"
import { getRandomN } from "../utilities.js"

export const startPirateEvent = async () => {
  if(eventState.interval - eventState.lastPirateRaid > intervalState.raids){
    let pirateHTML = ''
    const obj = {
      "1": "colony",
      "2": "facility"
    }
    const [pirateId] = getRandomN(1, eventState.numPirateFactions, 1)
    const pirate = await getPirate(pirateId)
    const attackType = obj[getRandomN(1, 2, 1)]

    if(attackType === "colony"){
      const [colonyId] = getRandomN(1, eventState.numColonies, 1)
      pirateHTML = await colonyAttack(colonyId, attackType, pirate)
    }

    if(attackType === "facility"){
      const [facilityId] = getRandomN(1, eventState.numFacilities, 1)
      pirateHTML += await facilityAttack(facilityId, attackType, pirate)
    }

    // recalculate minerals add-pirates remove-facility/colony

    eventState.lastPirateRaid = eventState.interval
    await setActivityLog(pirateHTML)
  } else {

    return
  }
}

export const calculatePirateLosses = async (pirate) => {
  // if attacking forces number 3 to 1 or greater the base will be overrun: 10% of defending security forces will be conscripted
  // if the attacking force numbers from 2 to 1 to 3 to 1 each side will take 50% casualties
  // if the attacking force numbers from 1 to 1 to 2 to 1 the attacking side will take 75% casualties
  // if the attacking force numbers less than 1 to 1, all attacking forces will be killed
  return `<p class="activityText pirateLosses pirateRaid">Calculating ${pirate.factionName} losses.</p>`
}

const hirePirateRecruits = async () => {
  // add forces to pirate collection
  // add rules to add pirates (how many factions get new recruits and how often?))
  await setActivityLog(`<p class="activityText pirateRecruit">Hiring pirate forces.</p>`)
}
