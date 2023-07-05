import { eventState } from "./randomEvents.js"

export const Activities = async () => {
  const activityElement = document.querySelector('#activityLog')
  let activityHTML = `<article id="activities" class="subtitle">
  <span class="subtitle">Activity Log</span>`
  activityHTML += `<div id="activity">
      ${eventState.activityLog}
    </div>`
  activityHTML += `</article>`
  activityElement.innerHTML = activityHTML
}

export const setActivityLog = async (str) => {
  eventState.activityLog = str.concat(`${eventState.activityLog}`)
  await Activities()
}
