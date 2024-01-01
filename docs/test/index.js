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

class MenuTiles {
  #elemMain;
  #rootMain;
  constructor() {
    this.#elemMain = document.createElement("menu-tiles");
    this.#rootMain = this.#elemMain.attachShadow();
    this.#elemMain.style.display = "flex";
    this.#elemMain.style.flexDirection = "row";
    this.#elemMain.style.flexWrap = "wrap";
    this.#elemMain.style.justifyContent = "space-around";
    this.#elemMain.style.alignItems = "center";
    this.#elemMain.style.alignContent = "space-around";
  }
  addTile() {
    const divNewTile = document.createElement("div");
    this.#rootMain.appendChild(divNewTile);
    divNewTile.style.display = "block";
    divNewTile.style.width = "20%";
    return divNewTile;
  }
  removeTile() {
    
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
    this.#rootMain = this.#elemMain.attachShadow();
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
    for (const child of divMain.children) {
      child.style.display = "none";
    }
    this.#arrBreadcrumbs.push({ title, shortTitle, divLayout });
    this.#redrawBreadcrumbs();
    return divLayout;
  }
  closeLayout() {
    { title, shortTitle, divLayout } = this.#arrBreadcrumbs.pop();
    this.#redrawBreadcrumbs();
    divLayout.remove();
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
        this.#btnHistory = document.createElement("div");
        this.#divBreadcrumbs.appendChild(this.#btnHistory);
        this.#btnHistory.style.position = "absolute";
        this.#btnHistory.style.left = "95%";
        this.#btnHistory.style.width = "5%";
        this.#btnHistory.style.height = "100%";
        this.#btnHistory.style.boxSizing = "content-box";
        this.#btnHistory.style.border = "1px solid black";
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
    if (this.#btnHistory !== null) {
      this.#btnHistory.addEventListener("click", function (evt) {
      
      });
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
      timer = setTimeout(redraw, 200);
    });
    function setMainHeight() {
      divMain.style.display = "block";
      divMain.style.height = window.innerHeight + "px";
    }
    redraw();
    // Create navigation control
    const myNav = new AppNavigation({
      baseElement: document.body,
    });
    divMain.appendChild(myNav.element);
    myNav.addLayout({
      title: "",
      shortTitle: "",
    });
    function draw( { mainTitle, mainShortTitle} ) {
      const divMainTitle = document.createElement("div");
      divTitleBreadcrumbs.appendChild(divMainTitle);
      divMainTitle.style.width = "100%";
      divMainTitle.style.height = "100%";
      divMainTitle.appendChild(document.createTextNode(mainTitle));
      const divMainScreen = document.createElement("div");
      divMain.appendChild(divMainScreen);
      divMainScreen.style.backgroundColor = "white";
      divMainScreen.style.width = "100%";
      divMainScreen.style.height = "90%";
      return divMainScreen;
    }

    
    
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
    function begin() {
      while (hrefBase === null) {
        hrefBase = window.prompt("Please enter URL:");
      }
      const urlBase = new URL(hrefBase);
      const urlEndpointInfo = new URL("./info", urlBase.href);
      const reqInfo = createRequestGET(urlEndpointInfo);
      fetch(reqInfo).then(login).catch(console.error);
    }
    const divGame = document.getElementById("divGame");
    window.addEventListener("resize", function (evt) {
      divGame.style.display = "none";
      let timer;
      clearTimeout(timer);
      timer = setTimeout(redraw, 200);
    });
    function redraw() {
      divGame.style.display = "block";
      divGame.style.width = window.innerWidth + "px";
      divGame.style.height = window.innerHeight + "px";
    }
    redraw();
    const divInfo = document.getElementById("divInfo");
    const divLogin = document.getElementById("divLogin");
    const lblUsername = document.getElementById("lblUsername");
    const inpUsername = document.getElementById("inpUsername");
    const lblPassword = document.getElementById("lblPassword");
    const inpPassword = document.getElementById("inpPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnCreateAccount = document.getElementById("btnCreateAccount");
    const btnBrowseGames = document.getElementById("btnBrowseGames");
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
    function login(response) {
      if (response.status !== 200) {
        console.error("Failed to get info.");
      }
      response.json().then(function (obj) {
        objGeneralInfo = obj;
        console.log(objGeneralInfo);
        divLogin.style.display = "block";
        const elemTitle = document.head.getElementsByTagName("title")[0];
        elemTitle.innerHTML = "";
        elemTitle.appendChild(document.createTextNode(objGeneralInfo.name));
        divInfo.innerHTML = "";
        divInfo.appendChild(document.createTextNode(objGeneralInfo.description));
      });
    }
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
    function showGame() {
      
    }
    function showGames() {
      divLogin.style.display = "none";
      divGameSelect.style.display = "block";
      const urlEndpointMyGames = new URL("./games/by-user/" + token, urlBase.href);
      const urlEndpointAllGames = new URL("./games", urlBase.href);
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
      populateGameList(result());
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
