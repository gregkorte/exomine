import { getColonies, getFacilities, getGovernors, getPirates } from "../../api/databaseManager.js"
import { eventState } from "../randomEvents.js"

export const checkCensusEvents = async () => {
  const interval = eventState.interval
  await getCurrentNumber("numPirateFactions")
  await getCurrentNumber("numGovernors")
}

export const addPeople = (type, id) => {
  if(type === "facility"){
    const num = 0
  }

  if(type === "colony"){
    const num = 0
  }

}

const getCurrentNumber = async (key) => {
  switch(key){

    case "numPirateFactions":
      const pirates = await getPirates()
      const activeFactions = pirates.filter(p => p.is_active)
      eventState.numPirateFactions = Object.keys(activeFactions).length
      break

    case "numGovernors":
      const governors = await getGovernors()
      const activeGovernors = governors.filter(g => g.is_active)
      eventState.numGovernors = Object.keys(activeGovernors).length
      break

    default:
      break
  }
}