import { getColonyInventory } from "../api/databaseManager.js"
import { updateColonyInventory } from "./colonyMineral.js"
import { updateFacilityInventory } from "./facilityMineral.js"

const cartState = {
  "facilityInventory": [],
  "colonyInventory": []
}

export const getCartState = () => {
  return structuredClone(cartState)
}

export const TransactionForm = (mineralObj) => {
  if(mineralObj.facility.is_active){

    if(cartState.facilityInventory.length > 0){

      for(const inv of cartState.facilityInventory){

        if(inv.id === mineralObj.id){

          return `
            <td><input class="purchaseQuantity" type="number" min="1" style="width: 4em" value=${inv.purchaseQty}></td>
            <td><button class="addToCart">+</button></td>
            <td><button class="removeFromCart">-</button></td>
          `
        }
      }
    }

    return `
      <td><input class="purchaseQuantity" type="number" min="1" style="width: 4em"></td>
      <td><button class="addToCart">+</button></td>
      <td><button class="removeFromCart">-</button></td>
    `
  } else {

    return `
    <td>Unavailable for purchase!</td>
  `
  }
}

export const Transaction = () => {
  if(cartState.colonyInventory.length === 0){
    resetCart()
  } else {
    const cartElement = document.querySelector('#cart')
    let transactionHTML = `<span>Mineral Cart</span>
      <table class="text">
        <tr>
          <th>Purchase Facility</th>
          <th>Quantity</th>
          <th>Mineral</th>
        </tr>`

    transactionHTML += cartState.facilityInventory.map(inv => {
      return `
      <tr>
        <td>${inv.facilityName}</td>
        <td class="purchaseQty">${inv.purchaseQty}T</td>
        <td>${inv.mineralName}</td>
      </tr>
      `
    }).join('')

    transactionHTML += '</table><button id="purchaseMinerals">Purchase</button>'

    cartElement.innerHTML = transactionHTML
  }
}

export const addToCart = async (item) => {
  const facilityObj = buildFacilityObj(item)
  const colonyObj = await buildColonyObj(item)

  cartState.facilityInventory.push(facilityObj)
  cartState.colonyInventory.push(colonyObj)

// does this need to be here | why is this here?
  Transaction()
}

export const removeFromCart = (id, element) => {
  const fi_id = parseInt(id)
  const f_index = cartState.facilityInventory.findIndex(x => x.id === fi_id)
  const c_index = cartState.colonyInventory.findIndex(x =>  x.facilityMineralId === fi_id)
  cartState.facilityInventory.splice(f_index, 1)
  cartState.colonyInventory.splice(c_index, 1)
  element.querySelector('input').value = ''
  Transaction()
}

const buildFacilityObj = (item) => {
  const invQty = parseInt(item.inventoryQuantity)
  const purchQty = parseInt(item.quantity)
  const newInvQty = invQty-purchQty
  const facilityObj = {
    "id": parseInt(item.facilityMineralId),
    "mineralId": parseInt(item.mineralId),
    "mineralName": item.mineralName,
    "facilityName": item.facilityName,
    "purchaseQty": item.quantity,
    "facility_stock": newInvQty
  }

  return facilityObj
}

const buildColonyObj = async (item) => {
  const facilityMineralId = parseInt(item.facilityMineralId)
  const colonyInventory = await getColonyInventory()
  const colonyId = parseInt(localStorage.getItem("colony_id"))
  const mineralId = parseInt(item.mineralId)
  const quantity = parseInt(item.quantity)

  const filteredMinerals = colonyInventory.find(invItem => (invItem.colonyId === colonyId && invItem.mineralId === mineralId))

  if(filteredMinerals) {
    filteredMinerals.facilityMineralId = facilityMineralId
    delete filteredMinerals.colonyId
    delete filteredMinerals.mineral

    filteredMinerals.colony_stock = filteredMinerals.colony_stock + quantity

    return filteredMinerals
  } else {
    const newColonyObj = {
      "colonyId": colonyId,
      "mineralId": mineralId,
      "facilityMineralId": facilityMineralId
    }
    newColonyObj.colony_stock = quantity

    return newColonyObj
  }
}

export const purchaseMinerals = async () => {
  await updateFacilityInventory()
  await updateColonyInventory()
  resetCart()
  const customEvent = new CustomEvent("purchase")
  document.dispatchEvent(customEvent)
}

const resetCart = () => {
  const cartElement = document.querySelector('#cart')
  cartElement.innerHTML = `<span>Mineral Cart</span>`
  cartState.facilityInventory = []
  cartState.colonyInventory = []
}