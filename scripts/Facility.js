import { getFacilities, getFacility } from "../api/databaseManager.js"
import { FacilityMinerals } from "./facilityMineral.js"

export const Facilities = async () => {
  const selectedFacilityId = parseInt(localStorage.getItem("facility_id"))
  const facilitiesElement = document.querySelector('#facilities')
  const facilities = await getFacilities()
  let facilitiesHTML = `<span>Facilities</span>
    <select data-name="facilityOptions">
      <option>Select a Facility</option>`

  facilitiesHTML += facilities.map(
    (facility) => {
      if(facility.id === selectedFacilityId){
        return `<option data-name='facilityOption' data-facility_id=${facility.id} selected>${facility.name}</option>`
      } else {
        return `<option data-name='facilityOption' data-facility_id=${facility.id}>${facility.name}</option>`
      }
    }
  ).join('')

  facilitiesHTML += `</select>`

  facilitiesElement.innerHTML = facilitiesHTML
}

export const Facility = async (id) => {
  const facilityElement = document.querySelector('#facility')

  if(id){
    const facility = await getFacility(id)
    const facilityMinerals = await FacilityMinerals(id)

    facilityElement.innerHTML = `
      <span>${facility.name} Inventory</span>
      <hr>
      ${facilityMinerals}
      <span>${facility.is_active ? '<div id="online">Currently online</div>' : '<div id="offline">Currently offline</div>'}</span>
      `
  } else {
    facilityElement.innerHTML = '<span>Facility Inventory</span>'
  }
}

document.addEventListener("purchase", event => {
  const facilityId = parseInt(localStorage.getItem("facility_id"))
  Facility(facilityId)
})
