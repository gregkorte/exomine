import { Activities } from "./ActivityLog.js"
import { Exomine } from "./Exomine.js"
import { Facilities } from "./Facility.js"
import { Governor } from "./Governor.js"
import { setEvents } from "./events.js"

const mainElement = document.querySelector('#container')
const headerElement = document.querySelector('#header')

const render = async () => {
  localStorage.clear()
  const mainContent = await Exomine()
  const headerContent = `
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>
  <div id="title">
    <span>
      EXOMINE
    </span>
  </div>
  `

  headerElement.innerHTML = headerContent
  mainElement.innerHTML = `
    <div id="left">
      <div id="content">
        ${mainContent}
      </div>
    </div>
    <div id="right">
      <div id="activityLog">
      </div>
    </div>
    `

  Governor()
  Facilities()
  Activities()
  setEvents()
}

render()
