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

function start( [ evtWindow, UI ] ) {
  try {
    console.log(UI);
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
    // Obtain initialization info
    const urlSelf = new URL(self.location);
    const urlServiceWorker = new URL("./sw.js", urlSelf);
    const urlServiceWorkerScope = new URL("./", urlSelf);
    // Start listening for messages from service worker
    navigator.serviceWorker.addEventListener("message", function (evt) {
      console.log(evt.data);
    });
    navigator.serviceWorker.startMessages();
    let hrefBase = urlSelf.searchParams.get("url");
    let urlBase = null;
    let objGeneralInfo;
    let token = "";
    let username = "";
    // Create navigation control
    const myNav = new UI.AppNavigation();
    divMain.appendChild(myNav.element);
    myNav.element.style.width = "100%";
    myNav.element.style.height = "100%";
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
      // Get server URL
      while (hrefBase === null) {
        hrefBase = window.prompt("Please enter URL:");
      }
      urlBase = new URL(hrefBase);
      // Send request for info
      const urlEndpointInfo = new URL("./info", urlBase.href);
      const reqInfo = createRequestGET(urlEndpointInfo);
      try {
        const respInfo = await fetch(reqInfo);
        if (respInfo.status !== 200) {
          throw "Failed to get info.";
        }
        const objInfo = await respInfo.json();
        objGeneralInfo = objInfo;
        const elemTitle = document.head.getElementsByTagName("title")[0];
        elemTitle.innerHTML = "";
        elemTitle.appendChild(document.createTextNode(objGeneralInfo.name));
        const divStart = myNav.addLayout({
          title: objInfo.name,
          shortTitle: objInfo.name,
        });
        const menu = new UI.MenuTiles();
        divStart.appendChild(menu.element);
        menu.element.style.width = "100%";
        menu.element.style.height = "100%";
        menu.addTiles([
          {
            text: "Login",
            handler: function () {
              drawLogin();
            },
          },
          {
            text: "Game Select",
            handler: function () {
              drawGameSelect(true);
            },
          }
        ]);
      } catch (e) {
        console.error(e);
      }
    })();
    function drawLogin() {
      const divLogin = myNav.addLayout({
        title: "Login",
        shortTitle: "Login",
      });
      const divInfo = document.createElement("div");
      divLogin.appendChild(divInfo);
      divInfo.style = "display:block;position:absolute;left:0%;top:0%;width:100%;height:20%;";
      const divMessage = document.createElement("div");
      divLogin.appendChild(divMessage);
      divMessage.style = "display:block;position:absolute;left:0%;top:20%;width:100%;height:10%;";
      const lblUsername = document.createElement("label");
      divLogin.appendChild(lblUsername);
      lblUsername.style = "display:block;position:absolute;left:0%;top:30%;width:100%;height:10%;";
      lblUsername.appendChild(document.createTextNode("Username: "));
      const inpUsername = document.createElement("input");
      lblUsername.appendChild(inpUsername);
      inpUsername.type = "text";
      inpUsername.style = "display:inline;width:80%;height:100%;";
      const lblPassword = document.createElement("label");
      divLogin.appendChild(lblPassword);
      lblPassword.style = "display:block;position:absolute;left:0%;top:45%;width:100%;height:10%;"
      lblPassword.appendChild(document.createTextNode("Password: "));
      const inpPassword = document.createElement("input");
      lblPassword.appendChild(inpPassword);
      inpPassword.type = "text";
      inpPassword.style = "display:inline;width:80%;height:100%;";
      const btnLogin = document.createElement("button");
      divLogin.appendChild(btnLogin);
      btnLogin.style = "display:block;position:absolute;left:0%;top:60%;width:50%;height:20%;";
      btnLogin.appendChild(document.createTextNode("Login"));
      const btnCreateAccount = document.createElement("button");
      divLogin.appendChild(btnCreateAccount);
      btnCreateAccount.style = "display:block;position:absolute;left:50%;top:60%;width:50%;height:20%;";
      btnCreateAccount.appendChild(document.createTextNode("Create Account"));
      const btnLogout = document.createElement("button");
      divLogin.appendChild(btnLogout);
      btnLogout.style = "display:block;position:absolute;left:0%;top:80%;width:100%;height:20%;";
      btnLogout.appendChild(document.createTextNode("Logout"));
      divInfo.innerHTML = "";
      divInfo.appendChild(document.createTextNode(objGeneralInfo.description));
      divMessage.innerHTML = "";
      if (token === "") {
        divMessage.appendChild(document.createTextNode("Logged out"));
      } else {
        divMessage.appendChild(document.createTextNode("Logged in as " + username));
      }
      btnLogin.addEventListener("click", function (evt) {
        const objLogin = {
          username: inpUsername.value,
          password: inpPassword.value,
        };
        const jsonLogin = JSON.stringify(objLogin);
        const blobLogin = new Blob( [ jsonLogin ], { type: "application/json" });
        const urlEndpointLogin = new URL("./user/login", urlBase.href);
        const reqLogin = createRequestPOST(urlEndpointLogin.href, blobLogin);
        (async function () {
          try {
            const response = await fetch(reqLogin);
            if (response.status !== 200) {
              alert("Failed to login");
              return;
            }
            const objLoginInfo = await response.json();
            token = objLoginInfo.token;
            username = inpUsername.value;
            // show logged in
            divMessage.innerHTML = "";
            divMessage.appendChild(document.createTextNode("Logged in as " + username));
          } catch(e) {
            console.error(e);
          }
        })();
      });
      btnLogout.addEventListener("click", function (evt) {
        if (token === "") {
          console.log("Already logged out");
          return;
        }
        const objLogout = {
          token: token,
        };
        const jsonLogout = JSON.stringify(objLogout);
        const blobLogout = new Blob( [ jsonLogout ], { type: "application/json" });
        const urlEndpointLogout = new URL("./user/logout", urlBase.href);
        const reqLogout = createRequestPOST(urlEndpointLogout.href, blobLogout);
        (async function () {
          try {
            const response = await fetch(reqLogout);
            if (response.status !== 200) {
              alert("Failed to logout");
              return;
            }
            token = "";
            // show logged out
            divMessage.innerHTML = "";
            divMessage.appendChild(document.createTextNode("Logged out"));
          } catch(e) {
            console.error(e);
          }
        })();
      });
      btnCreateAccount.addEventListener("click", function (evt) {
        const objNewUser = {
          username: inpUsername.value,
          password: inpPassword.value,
        };
        const jsonNewUser = JSON.stringify(objNewUser);
        const blobNewUser = new Blob( [ jsonNewUser ], { type: "application/json" });
        const urlEndpointNewUser = new URL("./user/new", urlBase.href);
        const reqNewUser = createRequestPOST(urlEndpointNewUser.href, blobNewUser);
        (async function () {
          try {
            const response = await fetch(reqNewUser);
            if (response.status !== 200) {
              alert("Failed to create user");
              return;
            }
            const objLoginInfo = await response.json();
            token = objLoginInfo.token;
            username = inpUsername.value;
            // show logged in
            divMessage.innerHTML = "";
            divMessage.appendChild(document.createTextNode("Logged in as " + username));
          } catch(e) {
            console.error(e);
          }
        })();
      });
    }
    function drawGameSelect(boolTryMyGames) {
      const divGameSelect = myNav.addLayout({
        title: "Game List",
        shortTitle: "Game List",
      });
      const lblMyGames = document.createElement("label");
      divGameSelect.appendChild(lblMyGames);
      lblMyGames.style = "display:block;position:absolute;left:0%;top:0%;width:100%;height:10%;";
      const inpMyGames = document.createElement("input");
      lblMyGames.appendChild(inpMyGames);
      inpMyGames.type = "checkbox";
      lblMyGames.appendChild(document.createTextNode("My Games Only"));
      const gameMenu = new UI.MenuTiles();
      const divGameList = gameMenu.element;
      divGameSelect.appendChild(divGameList);
      divGameList.style = "display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;"
      const btnGameListRefresh = document.createElement("button");
      divGameSelect.appendChild(btnGameListRefresh);
      btnGameListRefresh.style = "display:block;position:absolute;left:35%;top:80%;width:30%;height:20%;";
      btnGameListRefresh.appendChild(document.createTextNode("Refresh"));
      const btnNewGame = document.createElement("button");
      divGameSelect.appendChild(btnNewGame);
      btnNewGame.style = "display:block;position:absolute;left:0%;top:80%;width:30%;height:20%;";
      btnNewGame.appendChild(document.createTextNode("New Game"));
      const urlEndpointMyGames = new URL("./games/by-user/" + token, urlBase.href);
      const urlEndpointAllGames = new URL("./games", urlBase.href);
      populateGameList(result());
      btnGameListRefresh.addEventListener("click", function (evt) {
        populateGameList(result());
      });
      btnNewGame.addEventListener("click", function (evt) {
        drawNewGame();
      });
      async function result() {
        try {
          if (inpMyGames.value === true) {
            const reqMyGames = createRequestGET(urlEndpointMyGames.href);
            const respMyGames = await fetch(reqMyGames);
            const arrMyGames = await respMyGames.json();
            if (arrMyGames.length === 0) {
              inpMyGames.value = false;
              const reqAllGames = createRequestGET(urlEndpointAllGames.href);
              const respAllGames = await fetch(reqAllGames);
              const arrAllGames = await respAllGames.json();
              return arrAllGames;
            } else {
              return arrMyGames;
            }
          } else {
            const reqAllGames = createRequestGET(urlEndpointAllGames.href);
            const respAllGames = await fetch(reqAllGames);
            const arrAllGames = await respAllGames.json();
            return arrAllGames;
          }
        } catch (e) {
          console.error(e);
        }
      }
      async function populateGameList(promiseGameList) {
        gameMenu.clearAllTiles();
        const arrGames = await promiseGameList;
        console.log(arrGames);
        const arrGameTiles = [];
        for (const game of arrGames) {
          arrGameTiles.push({
            text: game.title,
            handler: function () {
              drawGameInfo(game.gameId);
            },
          });
        }
        gameMenu.addTiles(arrGameTiles);
      }
    }
    function drawGameInfo(strGameId) {
      const divGameInfo = myNav.addLayout({
        title: "Game Info",
        shortTitle: "Game Info",
      });
      const pGameTitle = document.createElement("p");
      divGameInfo.appendChild(pGameTitle);
      pGameTitle.style="display:block;position:absolute;left:0%;top:0%;width:100%;height:10%;";
      const playerMenu = new UI.MenuTiles();
      const divPlayerList = playerMenu.element
      divGameInfo.appendChild(divPlayerList);
      divPlayerList.style="display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;";
      const btnPlayerListRefresh = document.createElement("button");
      divGameInfo.appendChild(btnPlayerListRefresh);
      btnPlayerListRefresh.style="display:block;position:absolute;left:0%;top:80%;width:25%;height:20%;";
      btnPlayerListRefresh.appendChild(document.createTextNode("Refresh"));
      const btnJoinGame = document.createElement("button");
      divGameInfo.appendChild(btnJoinGame);
      btnJoinGame.style="display:block;position:absolute;left:25%;top:80%;width:25%;height:20%;";
      btnJoinGame.appendChild(document.createTextNode("Join Game"));
      const btnUnjoinGame = document.createElement("button");
      divGameInfo.appendChild(btnUnjoinGame);
      btnUnjoinGame.style="display:block;position:absolute;left:50%;top:80%;width:25%;height:20%;";
      btnUnjoinGame.appendChild(document.createTextNode("Unjoin Game"));
      const btnOpenGame = document.createElement("button");
      divGameInfo.appendChild(btnOpenGame);
      btnOpenGame.style="display:block;position:absolute;left:75%;top:80%;width:25%;height:20%;";
      btnOpenGame.appendChild(document.createTextNode("Open Game"));
      btnJoinGame.addEventListener("click", function (evt) {
        const urlEndpointJoinGame = new URL("./game/" + strGameId + "/join/" + token, urlBase.href);
        const reqJoinGame = createRequestGET(urlEndpointJoinGame);
        (async function () {
          try {
            const response = await fetch(reqJoinGame);
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
      btnUnjoinGame.addEventListener("click", function (evt) {
        const urlEndpointUnjoinGame = new URL("./game/" + strGameId + "/unjoin/" + token, urlBase.href);
        const reqUnjoinGame = createRequestGET(urlEndpointUnjoinGame);
        (async function () {
          try {
            const response = await fetch(reqUnjoinGame);
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
      btnOpenGame.addEventListener("click", function (evt) {
        const paramsGameWindow = new URLSearchParams([
          ["url", urlBase.href],
          ["gameId", strGameId],
          ["token", token],
        ]);
        const urlGameWindow = new URL("./game.html?" + paramsGameWindow);
        window.open(urlGameWindow.href);
      });
      btnPlayerListRefresh.addEventListener("click", function (evt) {
        populatePlayerList(result());
      });
      if (token === "") {
        btnJoinGame.disabled = true;
        btnUnjoinGame.disabled = true;
      }
      populatePlayerList(result());
      async function result() {
        try {
          const urlEndpointGameInfo = new URL("./game/" + strGameId + "/info", urlBase.href)
          const reqGameInfo = createRequestGET(urlEndpointGameInfo.href);
          const respGameInfo = await fetch(reqGameInfo);
          const objGameInfo = await respGameInfo.json();
          pGameTitle.innerHTML = "";
          pGameTitle.appendChild(document.createTextNode(objGameInfo.title));
          return objGameInfo.players;
        } catch (e) {
          console.error(e);
        }
      }
      async function populatePlayerList(promisePlayerList) {
        playerMenu.clearAllTiles();
        const arrPlayers = await promisePlayerList;
        const arrPlayerTiles = [];
        for (const player of arrPlayers) {
          arrPlayerTiles.push({
            text: player.username,
            handler: function () {
              if (player.hasOptions) {
                alert("Player " + player.username + " currently has options.");
              } else {
                alert("Player " + player.username + " has no options.");
              }
            },
          });
        }
        playerMenu.addTiles(arrPlayerTiles);
      }
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
        const requestGetOption = createRequestGET(urlEndpointGetOption);
        const responseGetOption = await fetch(requestGetOption);
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
        const reqNewGame = createRequestPOST(urlEndpointNewGame.href, blobNewGame);
        (async function () {
          try {
            const response = await fetch(reqNewGame);
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
