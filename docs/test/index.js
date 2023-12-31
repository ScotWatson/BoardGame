/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow ] );
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

function start( [ evtWindow ] ) {
  try {
    const urlSelf = new URL(self.location);
    const urlServiceWorker = new URL("./sw.js", urlSelf);
    const urlServiceWorkerScope = new URL("./", urlSelf);
    navigator.serviceWorker.addEventListener("message", function (evt) {
      console.log(evt.data);
    });
    navigator.serviceWorker.startMessages();
    (async function () {
      const registration = await navigator.serviceWorker.register(urlServiceWorker.href, {
        scope: urlServiceWorkerScope.href,
      });
      const btnNumClients = document.createElement("button");
      document.body.appendChild(btnNumClients);
      btnNumClients.appendChild(document.createTextNode("numClients"));
      btnNumClients.addEventListener("click", function () {
        if (navigator.serviceWorker.controller === null) {
          console.log("controller is null");
        } else {
          navigator.serviceWorker.controller.postMessage({
            action: "numClients",
          });
          console.log("Message sent to controller");
        }
        if (registration.installing === null) {
          console.log("installing is null");
        } else if (typeof registration.installing === "undefined") {
          console.log("installing is undefined");
        } else {
          registration.installing.postMessage({
            action: "numClients",
          });
          console.log("Message sent to installing");
        }
        if (registration.waiting === null) {
          console.log("waiting is null");
        } else if (typeof registration.waiting === "undefined") {
          console.log("waiting is undefined");
        } else {
          registration.waiting.postMessage({
            action: "numClients",
          });
          console.log("Message sent to waiting");
        }
        if (registration.active === null) {
          console.log("active is null");
        } else if (typeof registration.active === "undefined") {
          console.log("active is undefined");
        } else {
          registration.active.postMessage({
            action: "numClients",
          });
          console.log("Message sent to active");
        }
      });
    })();
    let hrefBase = urlSelf.searchParams.get("url");
    while (hrefBase === null) {
      hrefBase = window.prompt("Please enter URL:");
    }
    const urlBase = new URL(hrefBase);
    let objGeneralInfo;
    let token;
    const urlEndpointInfo = new URL("./info", urlBase.href);
    const reqInfo = createRequestGET(urlEndpointInfo);
    fetch(reqInfo).then(login).catch(console.error);
    const divGame = document.getElementById("divGame");
    const divInfo = document.getElementById("divInfo");
    const divLogin = document.getElementById("divLogin");
    const lblUsername = document.getElementById("lblUsername");
    const inpUsername = document.getElementById("inpUsername");
    const lblPassword = document.getElementById("lblPassword");
    const inpPassword = document.getElementById("inpPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnCreateAccount = document.getElementById("btnCreateAccount");
    const divGameSelect = document.getElementById("divGameSelect");
    const lblMyGames = document.getElementById("lblMyGames");
    const inpMyGames = document.getElementById("inpMyGames");
    const divGameList = document.getElementById("divGameList");
    const btnGameListRefresh = document.getElementById("btnGameListRefresh");
    const btnNewGame = document.getElementById("btnNewGame");
    const btnLogout = document.getElementById("btnLogout");
    const divGameInfo = document.getElementById("divGameInfo");
    const pGameTitle = document.getElementById("pGameTitle");
    const divPlayerList = document.getElementById("divPlayerList");
    const btnPlayerListRefresh = document.getElementById("btnPlayerListRefresh");
    const btnJoinUnjoinGame = document.getElementById("btnJoinUnjoinGame");
    const btnOpenGame = document.getElementById("btnOpenGame");
    const btnCloseGameInfo = document.getElementById("btnCloseGameInfo");
    const divNewGame = document.getElementById("divNewGame");
    const lblNewGameTitle = document.getElementById("lblNewGameTitle");
    const inpNewGameTitle = document.getElementById("inpNewGameTitle");
    const divNewGameOptions = document.getElementById("divNewGameOptions");
    const btnCancelNewGame = document.getElementById("btnCancelNewGame");
    btnLogin.addEventListener("click", function (evt) {
      const objLogin = {
        name: inpUsername.value,
        password: inpPassword.value,
      };
      const jsonLogin = JSON.stringify(objLogin);
      const blobLogin = new Blob(jsonLogin, "application/json");
      const reqLogin = createRequest(hrefBase + "/user/login", blobLogin);
      fetch(reqLogin).then(showGames).catch(console.error);
    });
    btnCreateAccount.addEventListener("click", function (evt) {
      const objCreate = {
        name: inpUsername.value,
        password: inpPassword.value,
      };
      const jsonCreate = JSON.stringify(objCreate);
      const blobCreate = new Blob(jsonCreate, "application/json");
      const reqCreate = createRequest(hrefBase + "/user/new", blobCreate);
      fetch(reqCreate).then(showGames).catch(console.error);
    });
    function login(response) {
      if (response.status !== 200) {
        console.error("Failed to get info.");
      }
      response.json().then(function (obj) {
        objGeneralInfo = obj;
        console.log(objGeneralInfo);
        divLogin.style.display = "block";
        document.head.title = objGeneralInfo.name;
        divInfo.innerHTML = "";
        divInfo.appendChild(document.createElement(objGeneralInfo.description));
      });
    }
    function showGames(response) {
      if (response.status !== 200) {
        console.error("Failed to login");
        return;
      }
      divLogin.style.display = "none";
      divGameSelect.style.display = "block";
      const infoLogin = response.json();
      token = infoLogin.token;
      const reqMyGames = createRequestGET(hrefBase + "/games/by-user/" + token);
      fetch(reqInfo).then(populateMyGames).catch(console.error);
      function populateMyGames(response) {
        if (response.status !== 200) {
          console.error("Failed to fetch my games");
        }
        const arrMyGames = response.json();
        if (arrMyGames.length === 0) {
          populateAllGames();
        }
        for (const game of JSON_MyGames) {
          const divGame = document.createElement("div");
          divGame.appendChild(document.createTextNode(game.title));
        }
      }
      const reqAllGames = createRequestGET(hrefBase + "/games");
      fetch(reqInfo).then(populateAllGames).catch(console.error);
    }
    const requestGetInfo = createRequestGET(hrefBase + "/info");
    fetch(requestGetInfo).then(function (response) {
      divInfo.appendChild(document.createTextNode(response.text()));
    });
    btnNewGame.addEventListener("click", function (evt) {
      const requestNewGame = createRequestGET(mainURL);
      fetch(requestNewGame).then(function (response) {
        if (response.status !== 200) {
          return;
        }
        
      });
    });
    btnJoinUnjoinGame.addEventListener("click", function (evt) {
      const requestJoinGame = createRequestGET(hrefBase);
      fetch(requestJoinGame).then(function (response) {
        divInfo.appendChild(document.createTextNode(response.text()));
      });
    });
    function addGameRow(gameId, playerId) {
      arrGames.push({
        gameId: gameId,
        playerId: playerId,
        ready: false,
      });
      const trNew = document.createElement("tr");
      tblGameIds.appendChild(trNew);
      const tdGameId = document.createElement("td");
      trNew.appendChild(tdGameId);
      const tdPlayerId = document.createElement("td");
      trNew.appendChild(tdPlayerId);
      const tdAction = document.createElement("td");
      trNew.appendChild(tdAction);
      const btnReady = document.createElement("button");
      tdAction.appendChild(btnReady);
      btnReady.addEventListener("click", function (evt) {
        
      });
    }
  } catch (e) {
    console.log(e);
  }
}
