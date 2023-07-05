import { editFacilityInventory, getFacilityInventory } from "../../api/databaseManager.js"
import { findMultiplier } from "../utilities.js"
import { Facilities } from "../Facility.js"

export const facilityMineralLoss = async (type, id, name, ratio, pirate) => {
  const allFacilityInv = await getFacilityInventory()
  const facilityInv = allFacilityInv.filter(inv => inv.faclityId === id)
  const multiplier = findMultiplier(ratio, type)
  const favoredMineral = pirate.favoredMineralId
  const specRaid = facilityInv.some(item => item.mineralId === favoredMineral)
  let facilityInvHTML = ''

  if(ratio > 0){
    facilityInvHTML += `
      <p class="activityText securityLosses pirateRaid">${name} lost:
        <ul>`

    for(const inv of facilityInv){
      const mineralName = inv.mineral.name
      if(specRaid){
        if(inv.mineralId === favoredMineral){
          const obj = {
            "facility_stock": inv.facility_stock - Math.floor(inv.facility_stock*multiplier.fav)
          }
          await editFacilityInventory(id, obj)
          facilityInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.facility_stock*multiplier.fav)}T - \t${mineralName}.</li>`
        } else {
          const obj = {
            "facility_stock": inv.facility_stock - inv.facility_stock*multiplier.spec
          }
          await editFacilityInventory(id, obj)
          facilityInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.facility_stock*multiplier.spec)}T - \t${mineralName}.</li>`
        }
      } else {
        const obj = {
          "facility_stock": inv.facility_stock - inv.facility_stock*multiplier.reg
        }
        await editFacilityInventory(id, obj)
        facilityInvHTML += `<li class="activityText securityLosses pirateRaid">${Math.floor(inv.facility_stock*multiplier.reg)}T - \t${mineralName}.</li>`
      }
    }
    facilityInvHTML += '</ul></p>'

  } else {
    facilityInvHTML += `<p class="activityText securityLosses pirateRaid">${name} lost no minerals.</p>`
  }

  await Facilities()
  return facilityInvHTML
}
