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

let arrGames = [];

async function start( [ evtWindow ] ) {
  try {
    const selfURL = new self.URL(window.location.href);
    let mainURL = selfURL.searchParams.get("url");
    while (mainURL === null) {
      mainURL = window.prompt("Please enter URL:");
    }
    const divGame = document.createElement("div");
    document.body.appendChild(divGame);
    const divInfo = document.createElement("div");
    divGame.appendChild(divInfo);
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
