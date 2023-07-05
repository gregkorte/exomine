import { addColonyInventory, editColonyInventory, getColonyInventory } from "../api/databaseManager.js"
import { getCartState } from "./Transaction.js"

export const ColonyMinerals = async (id) => {
  const colonyInventory = await getColonyInventory()
  const minerals = colonyInventory.filter(mineral => mineral.colonyId === id)
  let colonyHTML = `
    <table class="text">
      <tr>
        <th>Mineral</th>
        <th>Quantity</th>
        <th>Value</th>
      </tr>`

  colonyHTML += minerals.map(inv => {
    return `
    <tr>
      <td>${inv.mineral.name}</td>
      <td>${inv.colony_stock}T</td>
      <td>$${inv.colony_stock*inv.mineral.value}</td>
    </tr>
    `
  }).join('')

  colonyHTML += '</table>'

  return colonyHTML
}

// May be an issue when you buy two of the same mineral from different facilities
export const updateColonyInventory = async () => {
  const cart = getCartState()
  for(const inv of cart.colonyInventory) {
    if(inv.colonyId){
      await addColonyInventory(inv)
    } else {
      const colonyInvId = inv.id
      delete inv.mineralId
      delete inv.facilityMineralId
      await editColonyInventory(colonyInvId, inv)
    }
  }
}
