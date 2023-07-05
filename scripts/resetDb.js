import {
  editColony,
  editColonyInventory,
  editFacility,
  editFacilityInventory,
  editGovernor,
  editPirateInventory,
  getColonies,
  getColonyInventory,
  getFacilities,
  getFacilityInventory,
  getGovernors,
  getPirateInventory } from "../api/databaseManager.js"

export const resetInv = async () => {
  const colonyInv = await getColonyInventory()
  const facilityInv = await getFacilityInventory()
  const pirateInv = await getPirateInventory()

  await resetColonyInv(colonyInv)
  await resetFacilityInv(facilityInv)
  await resetPirates(pirateInv)
}

export const resetSec = async () => {
  const colonies = await getColonies()
  const facilities = await getFacilities()

  await resetColonySec(colonies)
  await resetFacilitySec(facilities)
}

export const resetGov = async () => {
  const governors = await getGovernors()
  const obj = {
    "is_active": true,
    "is_alive": true
  }
  for(const gov of governors){
    await editGovernor(gov.id, obj)
  }
}

const resetColonyInv = async (inv) => {
  const obj = {
    "colony_stock": 200
  }
  for(const i of inv){
    await editColonyInventory(i.id, obj)
  }
}

const resetFacilityInv = async (inv) => {
  const obj = {
    "facility_stock": 200
  }
  for(const i of inv){
    await editFacilityInventory(i.id, obj)
  }
}

const resetPirates = async (inv) => {
  const obj = {
    "pirate_stock": 200
  }
  for(const i of inv){
    await editPirateInventory(i.id, obj)
  }
}

const resetColonySec = async (colonies) => {
  const obj = {
    "security": 30
  }
  for(const colony of colonies){
    await editColony(colony.id, obj)
  }
}

const resetFacilitySec = async (facilities) => {
  const obj = {
    "security": 30,
    "is_active": true
  }
  for(const facility of facilities){
    await editFacility(facility.id, obj)
  }
}
