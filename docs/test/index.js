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
    this.#rootMain = this.#elemMain.attachShadow({ mode: closed });
    this.#elemMain.style.backgroundColor = "grey";
    this.#elemMain.style.overflowX = "hidden";
    this.#elemMain.style.overflowY = "scroll";
    this.#divScrollable = document.createElement("div");
    this.#rootMain.appendChild(#divScrollable);
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
  #arrBreadcrumbs;
  #btnForward;
  #divTopLayout;
  constructor({ title, shortTitle }) {
    this.#elemMain = document.createElement("app-navigation");
    this.#rootMain = this.#elemMain.attachShadow({ mode: closed });
    this.#elemMain.style.backgroundColor = "grey";
    this.#divBreadcrumbs = document.createElement("div");
    this.#rootMain.appendChild(this.#divBreadcrumbs);
    this.#divBreadcrumbs.style.backgroundColor = "grey";
    this.#btnBreadcrumbs.style.position = "absolute";
    this.#btnBreadcrumbs.style.left = "95%";
    this.#divBreadcrumbs.style.width = "100%";
    this.#divBreadcrumbs.style.height = "10%";
    this.#divMainTitle = null;
    this.#divPenultimateTitle = null;
    this.#divUltimateTitle = null;
    this.#arrBreadcrumbs = [];
    this.#divTopLayout = this.addLayout({ title, shortTitle });
  }
  get element() {
    return this.#elemMain;
  }
  get topLayout() {
    return this.#divTopLayout;
  }
  addLayout({ title, shortTitle }) {
    const divLayout = document.createElement("div");
    for (const child of this.#rootMain.children) {
      child.style.display = "none";
    }
    divLayout.style.width = "100%";
    divLayout.style.height = "100%";
    this.#arrBreadcrumbs.push({ title, shortTitle, divLayout });
    this.#rootMain.appendChild(divLayout);
    this.#divBreadcrumbs.style.display = "block";
    this.#redrawBreadcrumbs();
    return divLayout;
  }
  closeLayout() {
    { title, shortTitle, divLayout } = this.#arrBreadcrumbs.pop();
    this.#redrawBreadcrumbs();
    divLayout.remove();
    this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 1].divLayout.style.display = "block";
  }
  #redrawBreadcrumbs() {
    // Remove all elements from the breadcrumbs
    for (const child of this.#divBreadcrumbs.children) {
      child.remove();
    }
    // Layout was just added, length cannot be 0
    switch (this.#arrBreadcrumbs.length) {
      case 1:
        // Create main title element (full width)
        this.#divMainTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divMainTitle);
        this.#divMainTitle.style.width = "100%";
        this.#divMainTitle.style.height = "100%";
        this.#divMainTitle.style.boxSizing = "content-box";
        this.#divMainTitle.style.border = "1px solid black";
        this.#divPenultimateTitle = null;
        this.#divUltimateTitle = null;
        this.#btnHistory = null;
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].title));
        break;
      case 2:
        // Create main title element (short) & ultimate title element
        this.#divMainTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divMainTitle);
        this.#divMainTitle.style.width = "15%";
        this.#divMainTitle.style.height = "100%";
        this.#divMainTitle.style.boxSizing = "content-box";
        this.#divMainTitle.style.border = "1px solid black";
        this.#divPenultimateTitle = null;
        this.#divUltimateTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divUltimateTitle);
        this.#divUltimateTitle.style.position = "absolute";
        this.#divUltimateTitle.style.left = "15%";
        this.#divUltimateTitle.style.width = "85%";
        this.#divUltimateTitle.style.height = "100%";
        this.#divUltimateTitle.style.boxSizing = "content-box";
        this.#divUltimateTitle.style.border = "1px solid black";
        this.#btnHistory = null;
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].shortTitle));
        this.#divUltimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[1].title));
        break;
      default:
        // Create main title element (short) & ultimate title element
        this.#divMainTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divMainTitle);
        this.#divMainTitle.style.position = "absolute";
        this.#divMainTitle.style.left = "0%";
        this.#divMainTitle.style.width = "15%";
        this.#divMainTitle.style.height = "100%";
        this.#divMainTitle.style.boxSizing = "content-box";
        this.#divMainTitle.style.border = "1px solid black";
        this.#divPenultimateTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divPenultimateTitle);
        this.#divPenultimateTitle.style.position = "absolute";
        this.#divPenultimateTitle.style.left = "20%";
        this.#divPenultimateTitle.style.width = "15%";
        this.#divPenultimateTitle.style.height = "100%";
        this.#divPenultimateTitle.style.boxSizing = "content-box";
        this.#divPenultimateTitle.style.border = "1px solid black";
        this.#divUltimateTitle = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#divUltimateTitle);
        this.#divUltimateTitle.style.position = "absolute";
        this.#divUltimateTitle.style.left = "35%";
        this.#divUltimateTitle.style.width = "60%";
        this.#divUltimateTitle.style.height = "100%";
        this.#divUltimateTitle.style.boxSizing = "content-box";
        this.#divUltimateTitle.style.border = "1px solid black";
        createBtnHistory();
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].shortTitle));
        this.#divPenultimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 2].shortTitle));
        this.#divUltimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 1].title));
    }
    if (this.#divMainTitle !== null) {
      this.#divMainTitle.addEventListener("click", function (evt) {
        while (this.#arrBreadcrumbs.length > 1) {
          this.closeLayout();
        }
      });
    }
    if (this.#divPenultimateTitle !== null) {
      this.#divPenultimateTitle.addEventListener("click", function (evt) {
        this.closeLayout();
      });
    }
    function createBtnHistory() {
      this.#btnHistory = document.createElement("div");
      this.#divBreadcrumbs.appendChild(this.#btnHistory);
      this.#btnHistory.style.position = "absolute";
      this.#btnHistory.style.left = "95%";
      this.#btnHistory.style.width = "5%";
      this.#btnHistory.style.height = "100%";
      this.#btnHistory.style.boxSizing = "content-box";
      this.#btnHistory.style.border = "1px solid black";
      this.#btnHistory.addEventListener("click", openHistory);
      function openHistory(evt) {
        function closeHistory(evt) {
          this.#btnHistory.addEventListener("click", openHistory);
          divHistory.remove();
        }
        const divHistory = document.createElement("div");
        const menu = new MenuTiles();
        divHistory.appendChild(menu.element);
        const arrMenuList = [];
        for (const breadcrumb of this.#arrBreadcrumbs) {
          const handler = function () {
            while (this.#arrBreadcrumbs[this.#arrBreadcrumbs.length - 1] !== breadcrumb) {
              this.closeLayout();
            }
            closeHistory();
          }
          arrMenuList.push({
            text: breadcrumb.shortTitle,
            handler: handler,
          });
        }
        menu.addTiles(arrMenuList);
        for (const child of this.#rootMain.children) {
          child.style.display = "none";
        }
        this.#rootMain.appendChild(divHistory);
        this.#divBreadcrumbs.style.display = "block";
        this.#btnHistory.removeEventListener("click", openHistory);
        this.#btnHistory.addEventListener("click", closeHistory);
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
    // Register the service worker. If there is no controller, wait for one before proceeding
    (async function () {
      const registration = await navigator.serviceWorker.register(urlServiceWorker.href, {
        scope: urlServiceWorkerScope.href,
      });
      if (navigator.serviceWorker.controller === null) {
        navigator.serviceWorker.addEventListener("controllerchange", function (evt) {
          begin();
        });
      } else {
        begin();
      }
    })();
    let hrefBase = urlSelf.searchParams.get("url");
    let objGeneralInfo;
    let token;
    // Create navigation control
    const myNav = new AppNavigation({
      baseElement: document.body,
    });
    divMain.appendChild(myNav.element);
    myNav.element.style.width = "100%";
    myNav.element.style.height = "100%";
    function begin() {
      while (hrefBase === null) {
        hrefBase = window.prompt("Please enter URL:");
      }
      const urlBase = new URL(hrefBase);
      const urlEndpointInfo = new URL("./info", urlBase.href);
      const reqInfo = createRequestGET(urlEndpointInfo);
      (async function () {
        try {
          const respInfo = await fetch(reqInfo);
          if (response.status !== 200) {
            throw "Failed to get info.";
          }
          const objInfo = reqInfo.json();
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
    }
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
      const btnCreateAccount = document.createElement("button");
      divLogin.appendChild(btnCreateAccount);
      btnCreateAccount.style = "display:block;position:absolute;left:50%;top:50%;width:50%;height:20%;";
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
            showGames();
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
            showGames();
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
      const lblMyGames = document.getElementById("lblMyGames");
      const inpMyGames = document.getElementById("inpMyGames");
      const divGameList = document.getElementById("divGameList");
      const btnGameListRefresh = document.getElementById("btnGameListRefresh");
      const btnNewGame = document.getElementById("btnNewGame");
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
    }
    function drawGameInfo(strGameId) {
      const divGameInfo = myNav.addLayout({
        title: "Game List",
        shortTitle: "Game List",
      });
      const pGameTitle = document.getElementById("pGameTitle");
      const divPlayerList = document.getElementById("divPlayerList");
      const btnPlayerListRefresh = document.getElementById("btnPlayerListRefresh");
      const btnJoinUnjoinGame = document.getElementById("btnJoinUnjoinGame");
      const btnOpenGame = document.getElementById("btnOpenGame");
    }
    function drawNewGame() {
      const divNewGame = document.getElementById("divNewGame");
      const lblNewGameTitle = document.getElementById("lblNewGameTitle");
      const inpNewGameTitle = document.getElementById("inpNewGameTitle");
      const divNewGameOptions = document.getElementById("divNewGameOptions");
      const btnCancelNewGame = document.getElementById("btnCancelNewGame");
    }



    const btnCloseGameInfo = document.getElementById("btnCloseGameInfo");
    function login(response) {
    }

    btnBrowseGames.addEventListener("click", function (evt) {
      inpMyGames.value = false;
      inpMyGames.disabled = true;
      showGames();
    });
    async function populateGameList(promiseGameList) {
      divGameList.style.backgroundColor = "grey";
      divGameList.innerHTML = "";
      const arrGames = await promiseGameList;
      for (const game of arrGames) {
        const divGameItem = document.createElement("div");
        divGameList.appendChild(divGameItem);
        divGameItem.style.display = "block";
        divGameItem.style.border = "1px solid black";
        divGameItem.style.width = "100%";
        divGameItem.style.height = "10%";
        divGameItem.appendChild(document.createTextNode(game.title));
        divGameItem.addEventListener("click", function (evt) {
          divGameSelect.style.display = "none";
          divGameInfo.style.display = "block";
          showGame(game.id);
        });
      }
      divGameList.style.backgroundColor = "white";
    }
    function showGames() {
    }
    btnNewGame.addEventListener("click", function (evt) {
      const objNewGame = {
        title: "",
        action: {},
      };
      const jsonNewGame = JSON.stringify(objNewGame);
      const blobNewGame = new Blob(jsonNewGame, "application/json");
      const urlEndpointNewGame = new URL("./game/new", urlBase.href);
      const reqNewGame = createRequestPOST(urlEndpointNewGame.href);
      fetch(reqNewGame).then(function (response) {
        if (response.status !== 200) {
          return;
        }
      });
    });
    btnJoinUnjoinGame.addEventListener("click", function (evt) {
      const reqJoinGame = createRequestGET("./game/" + gameId + "/join/" + token, urlBase.href);
      const reqUnjoinGame = createRequestGET("./game/" + gameId + "/unjoin/" + token, urlBase.href);
      fetch(reqJoinGame).then(function (response) {
        if (response.status !== 200) {
          return;
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
}
