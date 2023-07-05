import { getColony } from "../../api/databaseManager.js"
import { calculateSecurityLosses } from "./reForces.js"
import { checkGovernorKilled } from "./reGovernor.js"
import { calculatePirateLosses } from "./rePirate.js"
import { colonyMineralLoss } from "./reColonyInv.js"
import { getRatio } from "../utilities.js"

export const colonyAttack = async (colonyId, attackType, pirate) => {
  const colony = await getColony(colonyId)
  const forceRatio = await getRatio(pirate.numForces, colony.security)
  let pirateHTML = `<p class="activityText pirateRaid">${pirate.factionName} has raided ${colony.name}!</p>`
  pirateHTML += await checkGovernorKilled(colonyId, pirate)
  pirateHTML += await calculateSecurityLosses(attackType, colonyId, colony.name, colony.security, forceRatio)
  pirateHTML += await colonyMineralLoss(colonyId, colony.name, pirate, forceRatio)
  pirateHTML += await calculatePirateLosses(pirate, forceRatio)

  return pirateHTML
}