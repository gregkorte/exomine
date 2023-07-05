import { getColony } from "../api/databaseManager.js"
import { ColonyMinerals } from "./colonyMineral.js"

// onchange render colony (mineral_inventory) based on colony_id data attribute
export const Colony = async (id) => {
  const colonyElement = document.querySelector('#colony')

  if(id){
    const colony = await getColony(id)
    const colonyMinerals = await ColonyMinerals(id)

    colonyElement.innerHTML = `
      <span>${colony.name} Inventory</span>
      <hr>
      ${colonyMinerals}
      `
  } else {
    colonyElement.innerHTML = '<span>Colony Inventory</span>'
  }
}

document.addEventListener("purchase", event => {
  const colonyId = parseInt(localStorage.getItem("colony_id"))
  Colony(colonyId)
})
