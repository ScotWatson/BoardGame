/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const asyncUI = import("./ui.mjs");

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow, asyncUI ] );
    start(modules);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();

const selfURL = new URL(self.navigator.location);
const selfLocation = new URL(selfURL, "./");

function resize() {
  const bodyDiv = document.getElementById("BodyDiv");
  bodyDiv.style.height = window.innerHeight + "px";
}
resize();
window.addEventListener("resize", resize);

const UI = {
  bodyShadow: document.body.attachShadow({ mode: "open" });
  const divAppGrid = document.createElement("div");
  divAppGrid.style.display = "grid";
  divAppGrid.style.gridTemplateColumns = "1fr 6fr";
  divAppGrid.style.gridTemplateRows = "50px 1fr";
  divAppGrid.style.gridTemplateAreas = "appName actions" "views main";
  divAppGrid.style.backgroundColor = "black";
  divAppGrid.style.width: "100%";
  const divAppName = document.createElement("div");
  divAppName.style.display = "block";
  divAppName.style.gridArea = "appName";
  divAppName.style.backgroundColor = "#808080";
  divAppGrid.appendChild(divAppName);
  const divActions = document.createElement("div");
  divAppGrid.appendChild(divActions);
  const divViews = document.createElement("div");
  divAppGrid.appendChild(divViews);
  const divMain = document.createElement("div");
  divAppGrid.appendChild(divMain);
  createView({
  }) {
    
    return {
      getTitle() {},
      setTitle() {},
    };
  },
  createGrid({
    areaList,
  }) {
    const mainNode = document.createElement("div");
    bodyShadow.appendChild(mainNode);
    return {
      
    };
  }
  createTextInput({
    label,
  }) {
  
  }
}

function start() {
  UI.
  {
    title:
    authorizationEndpoint:
    tokenEndpoint:
    clientId:
    clientSecret:
  }
}

function getLocalStorageValue(key) {
  return self.navigator.localStorage.getValue(selfLocation + "_" + key);
}
function setLocalStorageValue(key, value) {
  self.navigator.localStorage.setValue(selfLocation + "_" + key, value);
}
function removeLocalStorageValue(key) {
  self.navigator.localStorage.removeValue(selfLocation + "_" + key, value);
}
function getSessionStorageValue(key) {
  return self.navigator.sessionStorage.getValue(selfLocation + "_" + key);
}
function setSessionStorageValue(key, value) {
  self.navigator.sessionStorage.setValue(selfLocation + "_" + key, value);
}
function removeSessionStorageValue(key) {
  self.navigator.sessionStorage.removeValue(selfLocation + "_" + key, value);
}
