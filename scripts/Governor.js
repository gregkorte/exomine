import { getGovernors } from "../api/databaseManager.js"

export const Governor = async () => {
  const selectedGovernorId = parseInt(localStorage.getItem("governor_id"))
  const governors = await getGovernors()
  const governorsElement = document.querySelector('#governors')
  let governorsHTML = `<span>Governors</span>
    <select data-name="governorOptions">
      <option>Select a Governor</option>`

  governorsHTML += governors.map(
    (governor) => {
      if(governor.is_active && governor.is_alive){
        if(selectedGovernorId === governor.id){
          return `<option data-name='governorOption' data-governor_id=${governor.id} data-colony_id=${governor.colonyId} selected>${governor.name}</option>`
        } else {
          return `<option data-name='governorOption' data-governor_id=${governor.id} data-colony_id=${governor.colonyId}>${governor.name}</option>`
        }
      } else if(!governor.is_active || !governor.is_alive){
        return `<option disabled data-name='governorOption' data-governor_id=${governor.id} data-colony_id=${governor.colonyId}>${governor.name}</option>`
      }
    }
  ).join('')

  governorsHTML += `</select>`

  governorsElement.innerHTML = governorsHTML
}
