import { editColonyInventory, getColonyInventory } from "../../api/databaseManager.js"
import { findMultiplier } from "../utilities.js"

export const colonyMineralLoss = async (id, name, pirate, ratio) => {
  const allColonyInv = await getColonyInventory()
  const colonyInv = allColonyInv.filter(inv => inv.colonyId === id)
  const multiplier = findMultiplier(ratio, "minerals")
  const favoredMineral = pirate.favoredMineralId
  const specRaid = colonyInv.some(item => item.mineralId === favoredMineral)
  let colonyInvHTML = ''

  if(ratio > 0){
    colonyInvHTML += `
    <p class="activityText securityLosses pirateRaid">${name} lost:
      <ul>`

    for(const inv of colonyInv){
      const mineralName = inv.mineral.name
      if(specRaid){
        if(inv.mineralId === favoredMineral){
          const obj = {
            "colony_stock": inv.colony_stock - inv.colony_stock*multiplier.fav
          }
          console.log(obj)
          await editColonyInventory(id, obj)
          colonyInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.colony_stock*multiplier.fav)}T - \t${mineralName}.</li>`
        } else {
          const obj = {
            "colony_stock": inv.colony_stock - inv.colony_stock*multiplier.spec
          }
          console.log(obj)
          await editColonyInventory(id, obj)
          colonyInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.colony_stock*multiplier.spec)}T - \t${mineralName}.</li>`
        }

      } else {
        const obj = {
          "colony_stock": inv.colony_stock - Math.floor(inv.colony_stock*multiplier.reg)
        }
        console.log(obj)
        await editColonyInventory(id, obj)
        colonyInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.colony_stock*multiplier.reg)}T - \t${mineralName}.</li>`
      }
    }
    colonyInvHTML += '</ul></p>'

  } else {
    colonyInvHTML += `<p class="activityText securityLosses pirateRaid">${name} lost no minerals.</p>`
  }

  return colonyInvHTML
}