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

const asyncUI = await import("./ui.mjs");

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow, asyncUI ] );
    start(modules);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();

// Creates a GET Request to the specified endpoint
function createRequestGET(endpoint) {
  return new self.Request(endpoint, {
    method: "GET",
    headers: [],
    mode: "cors",
    credentials: "same-origin",
    cache: "default",
    redirect: "follow",
    referrer: "about:client",
    referrerPolicy: "",
    integrity: "",
    keepalive: "",
    signal: null,
    priority: "auto",
  });
}

// Creates a POST Request to the specified endpoint w/ the specified body
function createRequestPOST(endpoint, body) {
  return new self.Request(endpoint, {
    method: "POST",
    headers: [],
    mode: "cors",
    body: body,
    credentials: "same-origin",
    cache: "default",
    redirect: "follow",
    referrer: "about:client",
    referrerPolicy: "",
    integrity: "",
    keepalive: "",
    signal: null,
    priority: "auto",
  });
}

function start( [ evtWindow, UI] ) {
  try {
    // Get initialization info
    const urlSelf = new URL(self.location);
    const urlServer = urlSelf.searchParams("url");
    const gameId = urlSelf.searchParams("gameId");
    const token = urlSelf.searchParams("token");
    const urlEndpointGameInfo = new URL("./game/" + gameId + "/info", urlServer.href);
    const requestGameInfo = createRequestGET(urlEndpointGameInfo.href);
    // Create full window div for full control. Height must be resized by JS.
    document.body.backgroundColor = "black";
    document.body.margin = "0px";
    const divMain = document.createElement("div");
    document.body.appendChild(divMain);
    divMain.style.width = "100%";
    divMain.style.overflow = "hidden hidden";
    window.addEventListener("resize", function (evt) {
      divMain.style.display = "none";
      let timer;
      clearTimeout(timer);
      timer = setTimeout(setMainHeight, 200);
    });
    function setMainHeight() {
      divMain.style.display = "block";
      divMain.style.height = window.innerHeight + "px";
    }
    setMainHeight();
    // Create navigation control
    const myNav = new UI.AppNavigation();
    divMain.appendChild(myNav.element);
    myNav.element.style.width = "100%";
    myNav.element.style.height = "100%";
    (async function () {
      const responseGameInfo = await fetch(requestGameInfo);
      const objGameInfo = await responseGameInfo.json();
      createMenu(objGameInfo.title);
    })();
    function createMenu(title) {
      const divStart = myNav.addLayout({
        title: title,
        shortTitle: title,
      });
      const menu = new UI.MenuTiles();
      divStart.appendChild(menu.element);
      menu.element.style.width = "100%";
      menu.element.style.height = "100%";
      menu.addTiles([
        {
          text: "Maps",
          handler: function () {
            drawMaps();
          },
        },
        {
          text: "Units",
          handler: function () {
            drawUnits();
          },
        },
        {
          text: "Options",
          handler: function () {
            drawOptions();
          },
        }
      ]);
    }
    function drawMaps() {
      
    }
    function drawUnits() {
      
    }
    function drawOptions() {
      
    }
  } catch (e) {
    console.error(e);
  }
}
