import { editGovernor, getGovernor } from "../../api/databaseManager.js"
import { eventState, intervalState } from "../randomEvents.js"
import { getRandomN, roll2d10 } from "../utilities.js"
import { setActivityLog } from "../ActivityLog.js"
import { Governor } from "../Governor.js"

export const recruitNewGovernor = async (colonyId) => {
  // pop window up on new governor for name
  // add populations to coloy objects
  // add rules for governors and populations
  await setActivityLog(`<p class="activityText recruitGovernor">Recruiting new governor.</p>`)
}

export const changeGovernorStatus= async () => {
  if(eventState.interval - eventState.lastGovernorStatusUpdate > intervalState.govStatus){
    const [governorId] = getRandomN(1, eventState.numGovernors, 1)
    const governor = await getGovernor(governorId)
    const obj = {
      "is_active": !governor.is_active
    }
    await editGovernor(governorId, obj)
    await Governor()
    await setActivityLog(`<p class="activityText governorStatus">${governor.name} has become ${obj.is_active ? "active." : "inactive."}.</p>`)
    eventState.lastGovernorStatusUpdate = eventState.interval
  }
}

export const checkGovernorKilled = async (colonyId, pirate) => {
  const [governorId] = getRandomN(1, eventState.numGovernors, 1)
  const d100 = roll2d10()
  const obj = {
    "is_alive": false,
    "is_active": false
  }

  if(pirate.hatedColonyId === colonyId){
    if(d100 > .65){
      const governor = await editGovernor(governorId, obj)
      await Governor()
      return `<p class="activityText checkGovernor pirateRaid">${governor.name} has been killed.</p>`
    } else {
      await Governor()
      return `<p class="activityText checkGovernor pirateRaid">All governors survived.</p>`
    }
  } else {
    if(d100 > .90){
      const governor = await editGovernor(governorId, obj)
      await Governor()
      return `<p class="activityText checkGovernor pirateRaid">${governor.name} has been killed.</p>`
    }
    await Governor()
    return `<p class="activityText checkGovernor pirateRaid">All governors survived.</p>`
  }
}