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
    navigator.serviceWorker.register("/ServiceWorkerTest/sw.js", {
      scope: "/ServiceWorkerTest/",
    });
    navigator.serviceWorker.addEventListener("message", function (evt) {
      console.log(evt.data);
    });
    navigator.serviceWorker.startMessages();
    const selfURL = new self.URL(window.location.href);
    let baseURL = selfURL.searchParams.get("url");
    while (baseURL === null) {
      baseURL = window.prompt("Please enter URL:");
    }
    let objGeneralInfo;
    let token;
    const reqInfo = createRequestGET(baseURL + "/info");
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
      const jsonLogin = JSON.serialize(objLogin);
      const blobLogin = new Blob(JSON_Login, "application/json");
      const reqLogin = createRequest(baseURL + "/user/login", blobLogin);
      fetch(reqLogin).then(showGames).catch(console.error);
    });
    btnCreateAccount.addEventListener("click", function (evt) {
      const objCreate = {
        name: inpUsername.value,
        password: inpPassword.value,
      };
      const jsonCreate = JSON.serialize(objCreate);
      const blobCreate = new Blob(JSON_Create, "application/json");
      const reqCreate = createRequest(baseURL + "/user/new", blobCreate);
      fetch(reqCreate).then(showGames).catch(console.error);
    });
    function login(response) {
      if (response.status !== 200) {
        console.error("Failed to get info.");
      }
      objGeneralInfo = response.json();
      divLogin.style.display = "block";
      document.head.title = objGeneralInfo.name;
      divInfo.innerHTML = "";
      divInfo.appendChild(document.createElement(objGeneralInfo.description));
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
      const reqMyGames = createRequestGET(baseURL + "/games/by-user/" + token);
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
      const reqAllGames = createRequestGET(baseURL + "/games");
      fetch(reqInfo).then(populateAllGames).catch(console.error);
    }
    const requestGetInfo = createRequestGET(baseURL + "/info");
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
    btnJoinGame.addEventListener("click", function (evt) {
      const requestJoinGame = createRequestGET(baseURL);
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
