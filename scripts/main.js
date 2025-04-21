import { Activities } from "./ActivityLog.js";
import { Exomine } from "./Exomine.js";
import { Facilities } from "./Facility.js";
import { Governor } from "./Governor.js";
import { Planets } from "./Planet.js";
import { setEvents } from "./events.js";

const mainElement = document.querySelector("#container");
const headerElement = document.querySelector("#header");

const render = async () => {
  localStorage.clear();
  const mainContent = await Exomine();
  const headerContent = `
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>
  <div id="title">
    <span>
      EXOMINE
    </span>
  </div>
  `;

  headerElement.innerHTML = headerContent;
  mainElement.innerHTML = `
    <div id="left">
      <div id="content">
        ${mainContent}
      </div>
    </div>
    <div id="right">
      <div id="activityLog">
      </div>
      <div>
        <canvas id="p1" class="planets" width="200" height="200" right="50"></canvas>
        <img id="pText1" src="https://www.solarsystemscope.com/textures/previews/preview_venus_surface.jpg" style="display: none;">
      </div>
      <div>
        <canvas id="p2" class="planets" width="100" height="100"></canvas>
        <img id="pText2" src="https://www.solarsystemscope.com/textures/previews/preview_mercury.jpg" style="display: none;">
      </div>
    </div>
    `;

  Governor();
  Facilities();
  Activities();
  setEvents();
  Planets();
};

render();
