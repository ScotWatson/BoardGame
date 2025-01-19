/*
(c) 2025 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();
const selfUrl = new URL(self.location);

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const loadingUI = import("https://scotwatson.github.io/UserInterfaceTest/ui.mjs");
const loadingOauth = import("./oauth2.mjs");
const loadingAsyncEvents = import("https://scotwatson.github.io/WebCommon/20240119/async-events.mjs");

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow, asyncUI, asyncOauth, loadingAsyncEvents ] );
    await login(modules);
    start(modules);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();

const redirectUri = new URL("https://scotwatson.github.io/BoardGame/test/");

async function login( [ evtWindow, UI, Oauth, AsyncEvents ] ) {
  const responseType = selfUrl.searchParams.get("response_type");
  const authorizationUri = selfUrl.searchParams.get("authorization_uri");
  const tokenUri = selfUrl.searchParams.get("token_uri");
  const clientId = selfUrl.searchParams.get("client_id");
  const baseUri = selfUrl.searchParams.get("base_uri");
  if (responseType !== null) {
    if ((authorizationUri === null) && (tokenUri === null) && (clientId === null) && (baseUri === null)) {
      throw new Error("Missing Required Information to begin login.");
    }
    Oauth.setup(responseType, new URL(authorizationUri), new URL(tokenUri), clientId);
    self.sessionStorage.setItem(redirectUri + "_baseUri", baseUri);
  }
  await Oauth.login(new URL(redirectUri));
  return;
}
function start( [ evtWindow, UI, Oauth, AsyncEvents ] ) {
  // Creates a GET Request to the specified endpoint
  async function fetchRequestGET(endpoint) {
    return await Oauth.fetchRequestWithToken(endpoint, {
      method: "GET",
      headers: new Headers(),
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
  async function fetchRequestPOST(endpoint, body) {
    return await Oauth.fetchRequestWithToken(endpoint, {
      method: "POST",
      headers: new Headers(),
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
  try {
    // Obtain initialization info
    const urlSelf = new URL(self.location);
    const urlServiceWorker = new URL("./sw.js", urlSelf);
    const urlServiceWorkerScope = new URL("./", urlSelf);
    let hrefBase = self.sessionStorage.getItem(redirectUri + "_baseUri");
    let urlBase = null;
    let objGeneralInfo;
    let token = "";
    let username = "";
    handleServiceWorker();
    // Get server URL
    urlBase = new URL(hrefBase);
    // Send request for info
    const urlEndpointInfo = new URL("./info", urlBase.href);
    const objLayoutViewport = UI.initialize({
      type: "navigation",
      tabs: [
        {
          icon: "https://scotwatson.github.io/UserInterfaceTest/icons/unselected.svg",
          title: "Games",
          type: "hierarchy",
          options: {
            firstView: {
              type: "list",
              options: {},
            },
          },
        },
        {
          icon: "https://scotwatson.github.io/UserInterfaceTest/icons/unselected.svg",
          title: "Info",
          type: "hierarchy",
          options: {
            firstView: {
              type: "elements",
              options: {},
            },
          },
        },
        {
          icon: "https://scotwatson.github.io/UserInterfaceTest/icons/unselected.svg",
          title: "Unit Types",
          type: "hierarchy",
          options: {
            firstView: {
              type: "list",
              options: {},
            },
          },
        },
      ],
    });
    const objGamesTab = objLayoutViewport.view.tabs[0];
    const objGamesList = objGamesTab.view.firstView;
    populateGamesList();
    async function populateGamesList() {
      const respAllGames = await fetchRequestGET(urlEndpointAllGames.href);
      const arrAllGames = await respAllGames.json();
      for (const game of arrAllGames) {
        const gameItem = objGamesList.addItem({
          title: game.title,
          item: game,
        });
        AsyncEvents.listen(gameItem.selected, (event) => {
          drawGameInfo(event.item);
        });
      }
    }
    async function drawGameInfo(item) {
      const strGameId = item.gameId;
      const objGameInfo = objGames.assignView({
        title: item.title,
        type: "elements",
      });
      objPlayersTitle.addElement({
        type: "text-display",
      });
      objPlayersTitle.setText("Players");
      const objPlayersList = objGameInfo.addElement({
        type: "list",
      });
      const btnJoinGame = objGameInfo.addAction({
        title: "Join Game",
      });
      AsyncEvents.listen(btnJoinGame.clicked, function (evt) {
        const urlEndpointJoinGame = new URL("./game/" + strGameId + "/join/" + token, urlBase.href);
        (async function () {
          try {
            const response = await fetchRequestGET(urlEndpointJoinGame);
            if (response.status !== 200) {
              alert("Failed to join");
              return;
            }
            alert("Successfully joined!");
          } catch (e) {
            console.error(e);
          }
        })();
      });
      const btnUnjoinGame = objGameInfo.addAction({
        title: "Unjoin Game",
      });
      AsyncEvents.listen(btnUnjoinGame.clicked, function (evt) {
        const urlEndpointUnjoinGame = new URL("./game/" + strGameId + "/unjoin/" + token, urlBase.href);
        (async function () {
          try {
            const response = await fetchRequestGET(urlEndpointUnjoinGame);
            if (response.status !== 200) {
              alert("Failed to unjoin");
              return;
            }
            alert("Successfully unjoined!");
          } catch (e) {
            console.error(e);
          }
        })();
      });
      const btnOpenGame = objGameInfo.addAction({
        title: "Open Game",
      });
      AsyncEvents.listen(btnOpenGame.clicked, function (evt) {
        const paramsGameWindow = new URLSearchParams([
          ["url", urlBase.href],
          ["gameId", strGameId],
          ["token", token],
        ]);
        const urlGameWindow = new URL("./game.html?" + paramsGameWindow);
        window.open(urlGameWindow.href);
      });
      const btnPlayerListRefresh = objGameInfo.addAction({
        title: "Refresh",
      });
      AsyncEvents.listen(btnPlayerListRefresh.clicked, function (evt) {
        objPlayersList.clearAll();
        populatePlayerList();
      });
      async function populatePlayerList() {
        const urlEndpointGameInfo = new URL("./game/" + strGameId + "/info", urlBase.href)
        const respGameInfo = await fetchRequestGET(urlEndpointGameInfo.href);
        const objGameInfo = await respGameInfo.json();
        const arrPlayers = objGameInfo.players;
        for (const player of arrPlayers) {
          const objPlayer = objPlayersList.addItem({
            title: player.username,
          });
          AsyncEvents.listen(objPlayer.selected, function () {
            if (player.hasOptions) {
              alert("Player " + player.username + " currently has options.");
            } else {
              alert("Player " + player.username + " has no options.");
            }
          });
        }
      }
    }
    const btnRefreshGames = objGamesList.addAction({
      title: "refresh",
    });
    AsyncEvents.listen(btnRefreshGames, (event) => {
      objGamesList.clearAll();
      populateGamesList();
    });
    const objInfoTab = objLayoutViewport.view.tabs[1];
    const objInfoElements = objInfoTab.view.firstView;
    objInfoElements.addElement({
      type: "text-display",
    });
    (async () => {
      const respGameInfo = await fetchRequestGET(urlEndpointInfo);
      if (respGameInfo.status !== 200) {
        throw "Failed to get info.";
      }
      const objGameInfo = await respGameInfo.json();
      objInfoElements.setText(objGameInfo.name);
    })();
    const objUnitTypesTab = objLayoutViewport.view.tabs[2];
    const objUnitTypesList = objUnitTypes.view.firstView;
    function handleServiceWorker() {
      // Start listening for messages from service worker
      navigator.serviceWorker.addEventListener("message", function (evt) {
        console.log(evt.data);
      });
      navigator.serviceWorker.startMessages();
      (async function () {
        const registration = await navigator.serviceWorker.register(urlServiceWorker.href, {
          scope: urlServiceWorkerScope.href,
        });
        // Register the service worker. If there is no controller, wait for one before proceeding
        await new Promise(function (resolve, reject) {
          if (navigator.serviceWorker.controller !== null) {
            resolve();
            return;
          }
          navigator.serviceWorker.addEventListener("controllerchange", function (evt) {
            resolve();
            return;
          });
        });
      })();
    }
    function drawNewGame() {
      const divNewGame = myNav.addLayout({
        title: "New Game",
        shortTitle: "New Game",
      });
      const lblNewGameTitle = document.createElement("label");
      divNewGame.appendChild(lblNewGameTitle);
      lblNewGameTitle.style = "display:block;position:absolute;left:0%;top:0%;width:100%;height:10%;";
      lblNewGameTitle.appendChild(document.createTextNode("Title: "));
      const inpNewGameTitle = document.createElement("input");
      lblNewGameTitle.appendChild(inpNewGameTitle);
      inpNewGameTitle.type = "text";
      inpNewGameTitle.style = "width:80%;height:100%;";
      async function getOption(optionId) {
        const urlEndpointGetOption = new URL("./option/" + optionId, urlBase.href);
        const responseGetOption = await fetchRequestGET(urlEndpointGetOption);
        return await responseGetOption.json();
      }
      console.log(objGeneralInfo);
      const newGameOptions = new UI.Options(getOption, objGeneralInfo.options);
      const divNewGameOptions = newGameOptions.element;
      divNewGame.appendChild(divNewGameOptions);
      divNewGameOptions.style = "display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;";
      const btnStartNewGame = document.createElement("button");
      divNewGame.appendChild(btnStartNewGame);
      btnStartNewGame.style = "display:block;position:absolute;left:0%;top:80%;width:100%;height:20%;";
      btnStartNewGame.appendChild(document.createTextNode("Start"));
      if (token === "") {
        btnStartNewGame.disabled = true;
      }
      btnStartNewGame.addEventListener("click", function (evt) {
        let objAction = newGameOptions.createAction();
        const objNewGame = {
          title: inpNewGameTitle.value,
          action: objAction,
        };
        const jsonNewGame = JSON.stringify(objNewGame);
        const blobNewGame = new Blob( [ jsonNewGame ], { type: "application/json" });
        const urlEndpointNewGame = new URL("./game/new/" + token, urlBase.href);
        (async function () {
          try {
            const response = await fetchRequestPOST(urlEndpointNewGame.href, blobNewGame);
            if (response.status !== 200) {
              throw "Failed to create new game";
            }
            alert("New Game Created!");
          } catch (e) {
            console.error(e);
          }
        })();
      });
    }
  } catch (e) {
    console.log(e);
  }
}
