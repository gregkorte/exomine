import { editFacility, editFacilityInventory, getFacility, getFacilityInventory } from "../../api/databaseManager.js"
import { eventState, intervalState } from "../randomEvents.js"
import { getRandomN, getRatio } from "../utilities.js"
import { Facilities, Facility } from "../Facility.js"
import { setActivityLog } from "../ActivityLog.js"
import { calculateSecurityLosses } from "./reForces.js"
import { calculatePirateLosses } from "./rePirate.js"
import { facilityMineralLoss } from "./reFacilityInv.js"

export const changeFacilityStatus = async () => {
  const selectedFacilityId = parseInt(localStorage.getItem("facility_id"))

  if(eventState.interval - eventState.lastFacilityStatusUpdate > intervalState.facilityStatus){
    const facilityId = getRandomN(1, eventState.numFacilities, 1)[0]
    const facility = await getFacility(facilityId)
    const obj = {
      "is_active": !facility.is_active
    }
    await editFacility(facilityId, obj)
    await Facilities()

    if(selectedFacilityId === facilityId){
      await Facility(facilityId)
    } else {
      return
    }
    await setActivityLog(`<p class="activityText facilityStatus">${facility.name} is ${obj.is_active ? "now online." : "offline."}.</p>`)
    eventState.lastFacilityStatusUpdate = eventState.interval
  }
}

export const addFacilityMinerals = async () => {
  const selectedFacilityId = parseInt(localStorage.getItem("facility_id"))
  const [facilityId] = getRandomN(1, eventState.numFacilities, 1)
  const facility = await getFacility(facilityId)
  const facilityInventory = await getFacilityInventory()
  let facilityHTML = `
    <p class="activityText">${facility.name} production log:
      <ul>`

  for(const inv of facilityInventory){
    if(inv.facilityId === facilityId && inv.facility.is_active){
      const [numOre] = getRandomN(5, 20, 1)
      const obj = {
        "facility_stock": inv.facility_stock += numOre
      }
      facilityHTML += `<li class="activityText facilityInv">${numOre}T - \t${inv.mineral.name}.</li>`
      await editFacilityInventory(inv.id, obj)
    } else if(inv.facilityId === facilityId && !inv.facility.is_active){
      await setActivityLog(`<p class="activityText facilityOffline">${inv.facility.name} is currrently offline.</p>`)
      return
    }
  }
  facilityHTML += '</ul></p>'

  await setActivityLog(facilityHTML)

  if(selectedFacilityId === facilityId){
    await Facility(facilityId)
  } else {
    return
  }
}

export const facilityAttack = async (facilityId, attackType, pirate) => {
  const facility = await getFacility(facilityId)
  const forceRatio = await getRatio(pirate.numForces, facility.security)
  let pirateHTML = `<p class="activityText pirateRaid">${pirate.factionName} has raided ${facility.name}!</p>`
  pirateHTML += await calculateSecurityLosses(attackType, facilityId, facility.name, facility.security, forceRatio)
  pirateHTML += await facilityMineralLoss(attackType, facilityId, facility.name, forceRatio, pirate)
  pirateHTML += await calculatePirateLosses(pirate, forceRatio)

  return pirateHTML
}
