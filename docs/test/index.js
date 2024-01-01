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

class MenuTiles {
  #elemMain;
  #rootMain;
  #divScrollable;
  constructor() {
    this.#elemMain = document.createElement("menu-tiles");
    this.#rootMain = this.#elemMain.attachShadow({ mode: "closed" });
    this.#elemMain.style.backgroundColor = "white";
    this.#elemMain.style.overflowX = "hidden";
    this.#elemMain.style.overflowY = "scroll";
    this.#divScrollable = document.createElement("div");
    this.#rootMain.appendChild(this.#divScrollable);
    this.#divScrollable.style.display = "flex";
    this.#divScrollable.style.flexDirection = "row";
    this.#divScrollable.style.flexWrap = "wrap";
    this.#divScrollable.style.justifyContent = "space-around";
    this.#divScrollable.style.alignItems = "center";
    this.#divScrollable.style.alignContent = "space-around";
    this.#divScrollable.style.backgroundColor = "grey";
    this.#divScrollable.style.backgroundImage = "url(ScrollGutter.svg)";
    this.#divScrollable.style.backgroundSize = "48px 48px";
    this.#divScrollable.style.backgroundPosition = "right top";
    this.#divScrollable.style.backgroundRepeat = "repeat-y";
  }
  addTiles(arrTileInfo) {
    for (const objTileInfo of arrTileInfo) {
      const divNewTile = document.createElement("div");
      this.#divScrollable.appendChild(divNewTile);
      divNewTile.style.display = "block";
      divNewTile.style.width = "20%";
      divNewTile.style.aspectRatio = "1";
      divNewTile.style.border = "1px solid black";
      divNewTile.appendChild(document.createTextNode(objTileInfo.text));
      divNewTile.addEventListener("click", objTileInfo.handler);
    }
  }
  clearAllTiles() {
    for (const child of this.#divScrollable.children) {
      child.remove();
    }
  }
  get element() {
    return this.#elemMain;
  }
}

class AppNavigation {
  #elemMain;
  #rootMain;
  #divBreadcrumbs;
  #divMainTitle;
  #divPenultimateTitle;
  #divUltimateTitle;
  #btnHistory;
  #arrBreadcrumbs;
  #divContent;
  constructor() {
    this.#elemMain = document.createElement("app-navigation");
    this.#rootMain = this.#elemMain.attachShadow({ mode: "closed" });
    this.#elemMain.style.backgroundColor = "white";
    this.#divBreadcrumbs = document.createElement("div");
    this.#rootMain.appendChild(this.#divBreadcrumbs);
    this.#divBreadcrumbs.style.position = "absolute";
    this.#divBreadcrumbs.style.left = "0%";
    this.#divBreadcrumbs.style.top = "0%";
    this.#divBreadcrumbs.style.width = "100%";
    this.#divBreadcrumbs.style.height = "10%";
    this.#divMainTitle = null;
    this.#divPenultimateTitle = null;
    this.#divUltimateTitle = null;
    this.#arrBreadcrumbs = [];
    this.#divContent = document.createElement("div");
    this.#rootMain.appendChild(this.#divContent);
    this.#divContent.style.backgroundColor = "grey";
    this.#divContent.style.position = "absolute";
    this.#divContent.style.left = "0%";
    this.#divContent.style.top = "10%";
    this.#divContent.style.width = "100%";
    this.#divContent.style.height = "90%";
  }
  get element() {
    return this.#elemMain;
  }
  addLayout({ title, shortTitle }) {
    const divLayout = document.createElement("div");
    for (const child of this.#divContent.children) {
      child.style.display = "none";
    }
    divLayout.style.width = "100%";
    divLayout.style.height = "100%";
    divLayout.style.backgroundColor = "white";
    this.#arrBreadcrumbs.push({ title, shortTitle, divLayout });
    this.#divContent.appendChild(divLayout);
    this.#redrawBreadcrumbs();
    return divLayout;
  }
  closeLayout() {
    const { title, shortTitle, divLayout } = this.#arrBreadcrumbs.pop();
    this.#redrawBreadcrumbs();
    divLayout.remove();
    if (this.#arrBreadcrumbs.length !== 0) {
      this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 1].divLayout.style.display = "block";
    }
  }
  #redrawBreadcrumbs() {
    const that = this;
    // Remove all elements from the breadcrumbs
    for (const child of this.#divBreadcrumbs.children) {
      child.remove();
    }
    switch (this.#arrBreadcrumbs.length) {
      case 0:
        this.#divMainTitle = null;
        this.#divPenultimateTitle = null;
        this.#divUltimateTitle = null;
        this.#btnHistory = null;
      case 1:
        // Create main title element (full width)
        drawMainTitleFull();
        this.#divPenultimateTitle = null;
        this.#divUltimateTitle = null;
        this.#btnHistory = null;
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].title));
        break;
      case 2:
        // Create main title element (short) & ultimate title element
        drawMainTitleShort();
        this.#divPenultimateTitle = null;
        drawUltimateTitle();
        this.#btnHistory = null;
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].shortTitle));
        this.#divUltimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[1].title));
        break;
      default:
        // Create main title element (short) & ultimate title element
        drawMainTitleShort();
        drawPenultimateTitle();
        drawUltimateTitle();
        drawBtnHistory();
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].shortTitle));
        this.#divPenultimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 2].shortTitle));
        this.#divUltimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 1].title));
    }
    if (this.#divMainTitle !== null) {
      this.#divMainTitle.addEventListener("click", function (evt) {
        while (that.#arrBreadcrumbs.length > 1) {
          that.closeLayout();
        }
      });
    }
    if (this.#divPenultimateTitle !== null) {
      this.#divPenultimateTitle.addEventListener("click", function (evt) {
        that.closeLayout();
      });
    }
    function drawMainTitleFull() {
      that.#divMainTitle = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#divMainTitle);
      that.#divMainTitle.style.position = "absolute";
      that.#divMainTitle.style.left = "0%";
      that.#divMainTitle.style.top = "0%";
      that.#divMainTitle.style.width = "100%";
      that.#divMainTitle.style.height = "100%";
      that.#divMainTitle.style.boxSizing = "border-box";
      that.#divMainTitle.style.border = "1px solid black";
    }
    function drawMainTitleShort() {
      that.#divMainTitle = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#divMainTitle);
      that.#divMainTitle.style.position = "absolute";
      that.#divMainTitle.style.left = "0%";
      that.#divMainTitle.style.top = "0%";
      that.#divMainTitle.style.width = "15%";
      that.#divMainTitle.style.height = "100%";
      that.#divMainTitle.style.boxSizing = "border-box";
      that.#divMainTitle.style.border = "1px solid black";
    }
    function drawPenultimateTitle() {
      that.#divPenultimateTitle = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#divPenultimateTitle);
      that.#divPenultimateTitle.style.position = "absolute";
      that.#divPenultimateTitle.style.left = "20%";
      that.#divPenultimateTitle.style.top = "0%";
      that.#divPenultimateTitle.style.width = "15%";
      that.#divPenultimateTitle.style.height = "100%";
      that.#divPenultimateTitle.style.boxSizing = "border-box";
      that.#divPenultimateTitle.style.border = "1px solid black";
    }
    function drawUltimateTitle() {
      that.#divUltimateTitle = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#divUltimateTitle);
      that.#divUltimateTitle.style.position = "absolute";
      that.#divUltimateTitle.style.left = "15%";
      that.#divUltimateTitle.style.top = "0%";
      that.#divUltimateTitle.style.width = "85%";
      that.#divUltimateTitle.style.height = "100%";
      that.#divUltimateTitle.style.boxSizing = "border-box";
      that.#divUltimateTitle.style.border = "1px solid black";
    }
    function drawBtnHistory() {
      that.#btnHistory = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#btnHistory);
      that.#btnHistory.style.position = "absolute";
      that.#btnHistory.style.left = "95%";
      that.#btnHistory.style.top = "0%";
      that.#btnHistory.style.width = "5%";
      that.#btnHistory.style.height = "100%";
      that.#btnHistory.style.boxSizing = "border-box";
      that.#btnHistory.style.border = "1px solid black";
      that.#btnHistory.addEventListener("click", openHistory);
      function openHistory(evt) {
        function closeHistory(evt) {
          that.#btnHistory.addEventListener("click", openHistory);
          divHistory.remove();
        }
        const divHistory = document.createElement("div");
        const menu = new MenuTiles();
        divHistory.appendChild(menu.element);
        const arrMenuList = [];
        for (const breadcrumb of that.#arrBreadcrumbs) {
          const handler = function () {
            while (that.#arrBreadcrumbs[that.#arrBreadcrumbs.length - 1] !== breadcrumb) {
              that.closeLayout();
            }
            closeHistory();
          }
          arrMenuList.push({
            text: breadcrumb.shortTitle,
            handler: handler,
          });
        }
        menu.addTiles(arrMenuList);
        for (const child of that.#divContent.children) {
          child.style.display = "none";
        }
        that.#rootMain.appendChild(divHistory);
        that.#divBreadcrumbs.style.display = "block";
        that.#btnHistory.removeEventListener("click", openHistory);
        that.#btnHistory.addEventListener("click", closeHistory);
      }
    }
  }
}

function start( [ evtWindow ] ) {
  try {
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
    let token;
    // Create navigation control
    const myNav = new AppNavigation();
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
        console.log(objGeneralInfo);
        const elemTitle = document.head.getElementsByTagName("title")[0];
        elemTitle.innerHTML = "";
        elemTitle.appendChild(document.createTextNode(objGeneralInfo.name));
        const divStart = myNav.addLayout({
          title: objInfo.name,
          shortTitle: objInfo.name,
        });
        const menu = new MenuTiles();
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
      const divLogged = document.createElement("div");
      divLogin.appendChild(divLogged);
      divLogged.style = "display:block;position:absolute;left:0%;top:20%;width:100%;height:10%;";
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
      lblPassword.style = "display:block;position:absolute;left:0%;top:40%;width:100%;height:10%;"
      lblPassword.appendChild(document.createTextNode("Password: "));
      const inpPassword = document.createElement("input");
      lblPassword.appendChild(inpPassword);
      inpPassword.type = "text";
      inpPassword.style = "display:inline;width:80%;height:100%;";
      const btnLogin = document.createElement("button");
      divLogin.appendChild(btnLogin);
      btnLogin.style = "display:block;position:absolute;left:0%;top:50%;width:50%;height:20%;";
      btnLogin.appendChild(document.createTextNode("Login"));
      const btnCreateAccount = document.createElement("button");
      divLogin.appendChild(btnCreateAccount);
      btnCreateAccount.style = "display:block;position:absolute;left:50%;top:50%;width:50%;height:20%;";
      btnCreateAccount.appendChild(document.createTextNode("Create Account"));
      const btnLogout = document.createElement("button");
      divLogin.appendChild(btnLogout);
      btnLogout.style = "display:block;position:absolute;left:70%;top:70%;width:30%;height:20%;";
      btnLogout.appendChild(document.createTextNode("Logout"));
      divInfo.innerHTML = "";
      divInfo.appendChild(document.createTextNode(objGeneralInfo.description));
      btnLogin.addEventListener("click", function (evt) {
        const objLogin = {
          name: inpUsername.value,
          password: inpPassword.value,
        };
        const jsonLogin = JSON.stringify(objLogin);
        const blobLogin = new Blob(jsonLogin, "application/json");
        const urlEndpointLogin = new URL("./user/login", urlBase.href);
        const reqLogin = createRequestPOST(urlEndpointLogin.href, blobLogin);
        (async function () {
          try {
            const response = await fetch(reqLogin);
            if (response.status !== 200) {
              throw "Failed to login";
            }
            const objLoginInfo = await response.json();
            token = objLoginInfo.token;
            // show logged in
            divLogged.innerHTML = "";
            divLogged.appendChild(document.createTextNode("Logged in as " + inpUsername.value));
          } catch(e) {
            console.error(e);
          }
        })();
      });
      btnCreateAccount.addEventListener("click", function (evt) {
        const objNewUser = {
          name: inpUsername.value,
          password: inpPassword.value,
        };
        const jsonNewUser = JSON.stringify(objCreate);
        const blobNewUser = new Blob(jsonCreate, "application/json");
        const urlEndpointNewUser = new URL("./user/new", urlBase.href);
        const reqNewUser = createRequestPOST(urlEndpointNewUser.href, blobCreate);
        (async function () {
          try {
            const response = await fetch(reqNewUser);
            if (response.status !== 200) {
              throw "Failed to create user";
            }
            const objLoginInfo = await response.json();
            token = objLoginInfo.token;
            // show logged in
            divLogged.innerHTML = "";
            divLogged.appendChild(document.createTextNode("Logged in as " + inpUsername.value));
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
      inpMyGames.appendChild(document.createTextNode("My Games Only"));
      inpMyGames.type = "checkbox";
      inpMyGames.style = "display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;";
      const gameMenu = new MenuTiles();
      const divGameList = gameMenu.element;
      divGameSelect.appendChild(divGameList);
      divGameList.style = "display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;"
      const btnGameListRefresh = document.createElement("button");
      divGameSelect.appendChild(btnGameListRefresh);
      btnGameListRefresh.style = "display:block;position:absolute;left:35%;top:40%;width:30%;height:20%;";
      btnGameListRefresh.appendChild(document.createTextNode("Refresh"));
      const btnNewGame = document.createElement("button");
      divGameSelect.appendChild(btnNewGame);
      btnNewGame.style = "display:block;position:absolute;left:0%;top:40%;width:30%;height:20%;";
      btnNewGame.appendChild(document.createTextNode("New Game"));
      const urlEndpointMyGames = new URL("./games/by-user/" + token, urlBase.href);
      const urlEndpointAllGames = new URL("./games", urlBase.href);
      populateGameList(result());
      async function result() {
        try {
          if (inpMyGames.value === true) {
            const reqMyGames = createRequestGET(urlEndpointMyGames.href);
            const respMyGames = await fetch(reqMyGames);
            const arrMyGames = await response.json();
            if (arrMyGames.length === 0) {
              inpMyGames.value = false;
              const reqAllGames = createRequestGET(urlEndpointAllGames.href);
              const respAllGames = await fetch(reqAllGames);
              const arrAllGames = await response.json();
              return arrAllGames;
            } else {
              return arrMyGames;
            }
          } else {
            const reqAllGames = createRequestGET(urlEndpointAllGames.href);
            const respAllGames = await fetch(reqAllGames);
            const arrAllGames = await response.json();
            return arrAllGames;
          }
        } catch (e) {
          console.error(e);
        }
      }
      btnNewGame.addEventListener("click", function (evt) {
        drawNewGame();
      });
      async function populateGameList(promiseGameList) {
        gameList.clearAllTiles();
        const arrGames = await promiseGameList;
        const arrGameTiles = [];
        for (const game of arrGames) {
          arrGameTiles.push({
            text: game.title,
            handler: function () {
              drawGameInfo(game.id);
            },
          });
        }
        gameList.addTiles(arrGameTiles);
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
      const divPlayerList = document.createElement("div");
      divGameInfo.appendChild(divPlayerList);
      divPlayerList.style="display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;";
      const btnPlayerListRefresh = document.createElement("button");
      divGameInfo.appendChild(btnPlayerListRefresh);
      btnPlayerListRefresh.style="display:block;position:absolute;left:0%;top:80%;width:25%;height:20%;";
      btnPlayerListRefresh.appendChild(document.createTextNode("Refresh"));
      const btnJoinUnjoinGame = document.createElement("button");
      divGameInfo.appendChild(btnJoinUnjoinGame);
      btnJoinUnjoinGame.style="display:block;position:absolute;left:25%;top:80%;width:25%;height:20%;";
      btnJoinUnjoinGame.appendChild(document.createTextNode("Join Game"));
      const btnOpenGame = document.createElement("button");
      divGameInfo.appendChild(btnOpenGame);
      btnOpenGame.style="display:block;position:absolute;left:50%;top:80%;width:25%;height:20%;";
      btnOpenGame.appendChild(document.createTextNode("Open Game"));
      btnJoinUnjoinGame.addEventListener("click", function (evt) {
        const reqJoinGame = createRequestGET("./game/" + strGameId + "/join/" + token, urlBase.href);
        const reqUnjoinGame = createRequestGET("./game/" + strGameId + "/unjoin/" + token, urlBase.href);
        (async function () {
          try {
            const response = await fetch(reqJoinGame);
            if (response.status !== 200) {
              return;
            }
          } catch (e) {
            console.error(e);
          }
        })();
      });
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
      inpNewGameTitle.style = "display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;";
      const divNewGameOptions = document.createElement("div");
      divNewGame.appendChild(divNewGameOptions);
      divNewGameOptions.style = "display:block;position:absolute;left:0%;top:10%;width:100%;height:70%;";
      const btnStartNewGame = document.createElement("button");
      divNewGame.appendChild(btnStartNewGame);
      btnStartNewGame.style = "display:block;position:absolute;left:0%;top:80%;width:100%;height:20%;";
      btnStartNewGame.appendChild(document.createTextNode("Start"));
      btnStartNewGame.addEventListener("click", function (evt) {
        const objNewGame = {
          title: "",
          action: {},
        };
        const jsonNewGame = JSON.stringify(objNewGame);
        const blobNewGame = new Blob(jsonNewGame, "application/json");
        const urlEndpointNewGame = new URL("./game/new", urlBase.href);
        const reqNewGame = createRequestPOST(urlEndpointNewGame.href);
        (async function () {
          try {
            const response = await fetch(reqNewGame);
            if (response.status !== 200) {
              throw "Failed to create new game";
            }
            alert("This function is yet to be implemented.");
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
