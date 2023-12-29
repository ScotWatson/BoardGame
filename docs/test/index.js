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

let infoGeneral;
let token;

async function start( [ evtWindow ] ) {
  try {
    const selfURL = new self.URL(window.location.href);
    let baseURL = selfURL.searchParams.get("url");
    while (baseURL === null) {
      baseURL = window.prompt("Please enter URL:");
    }
    const reqInfo = createRequestGET(mainURL);
    fetch(reqInfo).then(login).catch(console.error);
    const divInfo = document.createElement("div");
    divLogin.appendChild(divInfo);
    divInfo.style.display = "block";
    divInfo.style.position = "absolute";
    divInfo.style.left = "0%";
    divInfo.style.top = "0%";
    divInfo.style.width = "100%";
    divInfo.style.height = "20%";
    divInfo.style.backgroundColor = "grey";
    document.body.style.backgroundColor = "grey";
    const divLogin = document.createElement("div");
    divLogin.style.display = "block";
    divLogin.style.position = "absolute";
    divLogin.style.left = "0%";
    divLogin.style.top = "20%";
    divLogin.style.width = "100%";
    divLogin.style.height = "80%";
    divLogin.style.backgroundColor = "white";
    const lblUsername = document.createElement("label");
    divLogin.appendChild(inpUsername);
    lblUsername.for = "username";
    lblUsername.style.display = "block";
    lblUsername.style.position = "absolute";
    lblUsername.style.left = "0%";
    lblUsername.style.top = "20%";
    lblUsername.style.width = "50%";
    lblUsername.style.height = "10%";
    const inpUsername = document.createElement("input");
    divLogin.appendChild(inpUsername);
    inpUsername.type = "text";
    inpUsername.name = "username";
    inpUsername.style.display = "block";
    inpUsername.style.position = "absolute";
    inpUsername.style.left = "50%";
    inpUsername.style.top = "20%";
    inpUsername.style.width = "50%";
    inpUsername.style.height = "10%";
    const lblPassword = document.createElement("label");
    divLogin.appendChild(inpPassword);
    lblPassword.for = "password";
    lblPassword.style.display = "block";
    lblPassword.style.position = "absolute";
    lblPassword.style.left = "0%";
    lblPassword.style.top = "50%";
    lblPassword.style.width = "50%";
    lblPassword.style.height = "10%";
    const inpPassword = document.createElement("input");
    divLogin.appendChild(inpPassword);
    inpPassword.type = "password";
    inpPassword.name = "password";
    inpPassword.style.display = "block";
    inpPassword.style.position = "absolute";
    inpPassword.style.left = "50%";
    inpPassword.style.top = "50%";
    inpPassword.style.width = "50%";
    inpPassword.style.height = "10%";
    const btnLogin = document.createElement("div");
    divLogin.appendChild(btnLogin);
    btnLogin.appendChild(document.createTextNode("Login"));
    btnLogin.style.display = "block";
    btnLogin.style.position = "absolute";
    btnLogin.style.left = "50%";
    btnLogin.style.top = "70%";
    btnLogin.style.width = "50%";
    btnLogin.style.height = "20%";
    btnLogin.style.backgroundColor = "blue";
    btnLogin.addEventListener("click", function (evt) {
      const infoLogin = {
        name: inpUsername.value,
        password: inpPassword.value,
      };
      const JSON_Login = JSON.serialize(infoLogin);
      const blobLogin = new Blob(JSON_Login, "application/json");
      const reqLogin = createRequest(baseURL + "/user/login", blobLogin);
      fetch(reqLogin).then(showGames).catch(console.error);
    });
    const btnCreateAccount = document.createElement("div");
    divLogin.appendChild(btnCreateAccount);
    btnCreateAccount.appendChild(document.createTextNode("Create Account"));
    btnCreateAccount.style.display = "block";
    btnCreateAccount.style.position = "absolute";
    btnCreateAccount.style.left = "50%";
    btnCreateAccount.style.top = "70%";
    btnCreateAccount.style.width = "50%";
    btnCreateAccount.style.height = "20%";
    btnCreateAccount.style.backgroundColor = "blue";
    btnCreateAccount.addEventListener("click", function (evt) {
      const infoCreate = {
        name: inpUsername.value,
        password: inpPassword.value,
      };
      const JSON_Create = JSON.serialize(infoCreate);
      const blobCreate = new Blob(JSON_Create, "application/json");
      const reqCreate = createRequest(baseURL + "/user/new", blobCreate);
      fetch(reqCreate).then(showGames).catch(console.error);
    });
    const divGameList = document.createElement("div");
    divLogin.style.display = "block";
    divLogin.style.position = "absolute";
    divLogin.style.left = "0%";
    divLogin.style.top = "20%";
    divLogin.style.width = "100%";
    divLogin.style.height = "80%";
    divLogin.style.backgroundColor = "white";
    const divGameInfo = document.createElement("div");
    divLogin.style.display = "block";
    divLogin.style.position = "absolute";
    divLogin.style.left = "0%";
    divLogin.style.top = "20%";
    divLogin.style.width = "100%";
    divLogin.style.height = "80%";
    divLogin.style.backgroundColor = "white";
    function login(response) {
      if (response.status !== 200) {
        console.error("Failed to get info.");
      }
      infoGeneral = response.json();
      document.head.title = infoGeneral.name;
      divInfo.appendChild(document.createElement(infoGeneral.description));
      divInfo.style.backgroundColor = "white";
      document.body.appendChild(divLogin);
    }
    function showGames(response) {
      if (response.status !== 200) {
        console.error("Failed to login");
        return;
      }
      const divGameList = document.createElement("div");
      divGameSelect.appendChild(divGameList);
      const chkMyGames = document.createElement("input");
      divGameSelect.appendChild(chkMyGames);
      chkMyGames.type = "text";
      chkMyGames.value = "Only My Games";
      const btnNewGame = document.createElement("div");
      divGameSelect.appendChild(btnNewGame);
      btnNewGame.appendChild(document.createTextNode("New Game"));
      const btnRefreshList = document.createElement("div");
      divGameSelect.appendChild(btnRefreshList);
      btnRefreshList.appendChild(document.createTextNode("Refresh"));
      const btnLogout = document.createElement("div");
      divGameSelect.appendChild(btnLogout);
      
      const infoLogin = response.json();
      token = infoLogin.token;
      const reqMyGames = createRequestGET(mainURL + "/games/by-user/" + token);
      fetch(reqInfo).then(populateMyGames).catch(console.error);
      function populateMyGames(response) {
        if (response.status !== 200) {
          console.error("Failed to fetch my games");
        }
        const JSON_MyGames = response.json();
        if (JSON_MyGames.length === 0) {
          populateAllGames();
        }
        for (const game of JSON_MyGames) {
          const divGame = document.createElement("div");
          divGame.appendChild(document.createTextNode(game.title)));
        }
      }

      const reqAllGames = createRequestGET(mainURL + "/games");
      fetch(reqInfo).then(populateAllGames).catch(console.error);
      const divHome
      const btnLogout = document.
    }
    const divGame = document.createElement("div");
    document.body.appendChild(divGame);
    const requestGetInfo = createRequestGET(mainURL + "/info");
    fetch(requestGetInfo).then(function (response) {
      divInfo.appendChild(document.createTextNode(response.text()));
    });
    const btnNewGame = document.createElement("div");
    divGame.appendChild(btnNewGame);
    btnNewGame.appendChild(document.createTextNode("New Game"));
    btnNewGame.style.display = "block";
    btnNewGame.style.position = "absolute";
    btnNewGame.style.left = "40%";
    btnNewGame.style.top = "20%";
    btnNewGame.style.width = "20%";
    btnNewGame.style.height = "20%";
    btnNewGame.addEventListener("click", function (evt) {
      const requestNewGame = createRequestGET(mainURL);
      fetch(requestNewGame).then(function (response) {
        if (response.status !== 200) {
          return;
        }
        
      });
    });
    const btnJoinGame = document.createElement("div");
    divGame.appendChild(btnJoinGame);
    btnJoinGame.appendChild(document.createTextNode("Join Game"));
    btnJoinGame.style.display = "block";
    btnJoinGame.style.position = "absolute";
    btnJoinGame.style.left = "40%";
    btnJoinGame.style.top = "50%";
    btnJoinGame.style.width = "20%";
    btnJoinGame.style.height = "20%";
    btnJoinGame.addEventListener("click", function (evt) {
      const requestJoinGame = createRequestGET(mainURL);
      fetch(requestJoinGame).then(function (response) {
        divInfo.appendChild(document.createTextNode(response.text()));
      });
    });
    const inpJoinGameId = document.createElement("input");
    divGame.appendChild(inpJoinGameId);
    inpJoinGameId.type = "text";
    inpJoinGameId.style.display = "block";
    inpJoinGameId.style.position = "absolute";
    inpJoinGameId.style.left = "60%";
    inpJoinGameId.style.top = "0%";
    inpJoinGameId.style.width = "40%";
    inpJoinGameId.style.height = "20%";
    const tblGameIds = document.createElement("table");
    divGame.appendChild(tblGameIds);
    tblGameIds.type = "text";
    tblGameIds.style.display = "block";
    tblGameIds.style.position = "absolute";
    tblGameIds.style.left = "0%";
    tblGameIds.style.top = "20%";
    tblGameIds.style.width = "100%";
    tblGameIds.style.height = "80%";
    const trGameHeader = document.createElement("tr");
    tblGameIds.appendChild(trGameHeader);
    const thGameId = document.createElement("th");
    trGameHeader.appendChild(thGameId);
    thGameId.appendChild(document.createTextNode("Game ID"));
    const thPlayerId = document.createElement("th");
    trGameHeader.appendChild(thPlayerId);
    thPlayerId.appendChild(document.createTextNode("Player ID"));
    const thAction = document.createElement("th");
    trGameHeader.appendChild(thAction);
    thAction.appendChild(document.createTextNode("Action"));
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
