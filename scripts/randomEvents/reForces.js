import { editColony, editFacility, getColony, getFacility } from "../../api/databaseManager.js"
import { setActivityLog } from "../ActivityLog.js"
import { eventState, intervalState } from "../randomEvents.js"
import { addNumbersN, findMultiplier, getRandomN } from "../utilities.js"

export const hireColonySecurityForces = async () => {
    if(eventState.interval - eventState.lastColonySf > intervalState.colSf){
    // add security forces to colony collection
    // add rules to add security forces (based on populations?)
    const colonyId = getRandomN(1, eventState.numColonies, 1)
    const colony = await getColony(colonyId)
    const population = addNumbersN(colony.population, colony.security)
    const multiplier = getRandomN(.005, .01, 1)
    const addedSec = Math.ceil(population*multiplier)
    const obj = {
      "security": colony.security + addedSec
    }
    await editColony(colonyId, obj)
    eventState.lastColonySf = eventState.interval
    await setActivityLog(`<p class="activityText colonySecurityForces">${colony.name} hired ${addedSec} security forces.</p>`)
  }
}

export const hireFacilitySecurityForces = async () => {
  if(eventState.interval - eventState.lastFacilitySf > intervalState.facSf){
    // add security forces to facility collection
    // add rules to add security forces (based on minerals mined? / based on facility personnel?)
    const facilityId = getRandomN(1, eventState.numFacilities, 1)
    const facility = await getFacility(facilityId)
    const population = addNumbersN(facility.workers, facility.civilians, facility.security)
    const multiplier = getRandomN(.005, .013, 1)
    const addedSec = Math.ceil(population*multiplier)
    const obj = {
      "security": facility.security + addedSec
    }
    await editFacility(facilityId, obj)
    eventState.lastFacilitySf = eventState.interval
    await setActivityLog(`<p class="activityText facilitySecurityForces">${facility.name} hired ${addedSec} security forces.</p>`)
  }
}

export const calculateSecurityLosses = async (type, id, name, forceNum, ratio) => {
  const multiplier = findMultiplier(ratio, "forces")

  if(type === "colony"){
    const obj = {
      "security": forceNum - Math.floor(forceNum*multiplier)
    }
    await editColony(id, obj)
    return `<p class="activityText securityLosses pirateRaid">${name} lost ${Math.floor(forceNum*multiplier)} security forces.</p>`
  }

  if(type === "facility"){
    const obj = {
      "security": forceNum - Math.floor(forceNum*multiplier)
    }
    await editFacility(id, obj)
    return `<p class="activityText securityLosses pirateRaid">${name} lost ${Math.floor(forceNum*multiplier)} security forces.</p>`
  }
}
