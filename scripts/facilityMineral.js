import { editFacilityInventory, getFacilityInventory } from "../api/databaseManager.js"
import { TransactionForm, getCartState } from "./Transaction.js"

export const FacilityMinerals = async (id) => {
  const facilityInventory = await getFacilityInventory()
  const minerals = facilityInventory.filter(mineral => mineral.facilityId === id)
  let facilityHTML = `
    <table class="text">
      <tr>
        <th>Mineral</th>
        <th>On hand</th>
        <th>Cost per T</th>
      </tr>`

  facilityHTML += minerals.map(inv => {
    const cart = TransactionForm(inv)
    return `
    <tr data-facilityinventory_id=${inv.id} data-facility_id=${inv.facilityId} data-facilityname="${inv.facility.name}" data-quantity=${inv.facility_stock} data-mineral_id=${inv.mineralId} data-mineralname="${inv.mineral.name}">
      <td>${inv.mineral.name}</td>
      <td>${inv.facility_stock}T</td>
      <td>$${(inv.mineral.value/inv.mineral.yield).toFixed(2)}</td>
      ${cart}
    </tr>
    `
  }).join('')

  facilityHTML += '</table>'

  return facilityHTML
}

export const updateFacilityInventory = async () => {
  const cart = getCartState()
  for(const inv of cart.facilityInventory) {
    const facilityInvId = inv.id
    delete inv.facilityName
    delete inv.mineralId
    delete inv.mineralName
    delete inv.purchaseQty
    await editFacilityInventory(facilityInvId, inv)
  }
}
