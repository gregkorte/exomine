import { Colony } from "./Colony.js"
import { Facilities, Facility } from "./Facility.js"
import { resetGov, resetInv, resetSec } from "./resetDb.js"
import { addToCart, purchaseMinerals, removeFromCart } from "./Transaction.js"
import { clearInterval, interval, resumeInterval } from "./randomEvents.js"
import { Governor } from "./Governor.js"

const governorHandler = async (event) => {
  if(event.target.dataset.name === 'governorOptions'){
    const target = event.target.options[event.target.selectedIndex]
    const colonyId = parseInt(target.dataset.colony_id)
    const governorId = parseInt(target.dataset.governor_id)
    localStorage.setItem("colony_id", colonyId)
    localStorage.setItem("governor_id", governorId)
    await Colony(colonyId)
  } else {
    return
  }
}

const facilityHandler = async (event) => {
  if(event.target.dataset.name === 'facilityOptions'){
    const target = event.target.options[event.target.selectedIndex]
    const facilityId = parseInt(target.dataset.facility_id)
    localStorage.setItem("facility_id", facilityId)
    await Facility(facilityId)
  } else {
    return
  }
}

const cartHandler = async (event) => {
  const [className] = event.target.classList

  if(className === "addToCart" || className === "removeFromCart"){
    const parentElement = event.target.closest('tr')
    const facilityMineralId = parentElement.dataset.facilityinventory_id
    const inventoryQuantity = parentElement.dataset.quantity
    const facilityId = parentElement.dataset.facility_id
    const facilityName = parentElement.dataset.facilityname
    const mineralId = parentElement.dataset.mineral_id
    const mineralName = parentElement.dataset.mineralname
    const quantity = parentElement.querySelector('.purchaseQuantity').value
    const cartObj = {
      "facilityMineralId": facilityMineralId,
      "facilityId": facilityId,
      "facilityName": facilityName,
      "mineralId": mineralId,
      "mineralName": mineralName,
      "inventoryQuantity": inventoryQuantity,
      "quantity": quantity
    }

    if(className === "addToCart"){
      await addToCart(cartObj)
    }

    if(className === "removeFromCart"){
      removeFromCart(facilityMineralId, parentElement)
    }
  }
}

const transactionHandler = async (event) => {
  if(event.target.id === "purchaseMinerals"){
    console.log("Purchase some rocks")
    await purchaseMinerals()
  }
}

const intervalHandler = async (event) => {
  const targetId = event.target.id

  if(targetId === "pause"){
    clearInterval()
  }

  if(targetId === "resume"){
    resumeInterval()
    interval
  }
}

const resetHandler = async (event) => {
  // break this out for DRY (intervalHandler & cartHandler)
  switch(event.target.id){
    case "reset_inv":
      await resetInv()
      Facilities()
      Colony()
      Facility()
      break
    case "reset_sec":
      await resetSec()
      Colony()
      Facility()
      break
    case "reset_gov":
      await resetGov()
      Governor()
      break
    default:
      break
  }
}

export const setEvents = () => {
  document.addEventListener("change", governorHandler)
  document.addEventListener("change", facilityHandler)
  document.addEventListener("click", cartHandler)
  document.addEventListener("click", transactionHandler)
  document.addEventListener("click", intervalHandler)
  document.addEventListener("click", resetHandler)
  interval
}