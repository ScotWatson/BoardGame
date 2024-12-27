/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class MenuTiles {
  #elemMain;
  #rootMain;
  #divScrollable;
  constructor() {
    this.#elemMain = document.createElement("menu-tiles");
    this.#rootMain = this.#elemMain.attachShadow({ mode: "closed" });
    this.#elemMain.style.display = "block";
    this.#elemMain.style.backgroundColor = "white";
    this.#elemMain.style.overflowX = "hidden";
    this.#elemMain.style.overflowY = "scroll";
    this.#elemMain.style.boxSizing = "border-box";
    this.#elemMain.style.border = "1px solid black";
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
    this.#divScrollable.style.boxSizing = "border-box";
    this.#divScrollable.style.minHeight = "100%";
  }
  addTiles(arrTileInfo) {
    for (const objTileInfo of arrTileInfo) {
      const divNewTile = document.createElement("div");
      this.#divScrollable.appendChild(divNewTile);
      divNewTile.style.display = "block";
      divNewTile.style.width = "96px"; // ~1 in
      divNewTile.style.aspectRatio = "1";
      divNewTile.style.border = "1px solid black";
      divNewTile.appendChild(document.createTextNode(objTileInfo.text));
      divNewTile.addEventListener("click", objTileInfo.handler);
    }
  }
  clearAllTiles() {
    this.#divScrollable.innerHTML = "";
  }
  get element() {
    return this.#elemMain;
  }
}

export class Options {
  #elemMain;
  #rootMain;
  constructor(getOption, optionRoot) {
    console.log(optionRoot);
    this.#elemMain = document.createElement("div");
    this.#rootMain = this.#elemMain.attachShadow({ mode: "closed" });
    this.#elemMain.style.display = "block";
    this.#elemMain.style.backgroundColor = "white";
    this.#rootMain.appendChild(createOption(optionRoot));
    function createOption(option) {
      switch (option.optionType) {
        case "select": {
          if (option.options.length === 0) {
            const spanItem = document.createElement("span");
            spanItem.append(option.description);
            spanItem.createAction = function () {
              const optionId = option.optionId;
              const options = [];
              return {
                optionId,
                options,
              };
            };
            return spanItem;
          } else {
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            summary.append(option.description);
            details.appendChild(summary);
            details.addEventListener("toggle", function () {
              console.log(option);
              if (details.open) {
                if (details.childNodes.length === 1) {
                  (async function () {
                    for (const optionId of option.options) {
                      const pItem = document.createElement("p");
                      pItem.style.display = "flex";
                      pItem.style.alignItems = "baseline";
                      const select = document.createElement("input");
                      select.type = "checkbox";
                      pItem.appendChild(select);
                      const newOption = await getOption(optionId);
                      const newOptionControl = createOption(newOption);
                      pItem.appendChild(newOptionControl);
                      pItem.getAction = function () {
                        if (select.checked) {
                          return newOptionControl.createAction();
                        } else {
                          return null;
                        }
                      }
                      details.appendChild(pItem);
                    }
                  })();
                }
              }
            });
            details.createAction = function () {
              const optionId = option.optionId;
              const options = [];
              for (const elem of details.childNodes) {
                if (elem.tagName === "SUMMARY") {
                  continue;
                }
                console.log(elem);
                const action = elem.getAction();
                if (action === null) {
                  continue;
                }
                options.push(action);
              }
              return {
                optionId,
                options,
              };
            };
            return details;
          }
        }
        case "range": {
          const label = document.createElement("label");
          label.append(option.description);
          const range = document.createElement("input");
          range.type = "range";
          if (typeof option.minValue === "number") {
            range.setAttribute("min", option.minValue);
          } else {
            range.setAttribute("min", 0);
          }
          range.setAttribute("max", option.maxValue);
          label.appendChild(range);
          label.createAction = function () {
            const optionId = option.optionId;
            const value = range.value;
            return {
              optionId,
              value,
            };
          };
          return label;
        }
        case "text": {
          const label = document.createElement("label");
          label.append(option.description);
          const text = document.createElement("input");
          text.type = "text";
          label.appendChild(text);
          label.createAction = function () {
            const optionId = option.optionId;
            const value = text.value;
            return {
              optionId,
              value,
            };
          };
          return label;
        }
        default: {
          const p = document.createElement("p");
          p.append("<Unrecognized Option Type>");
          p.style.backgroundColor = "grey";
          return p;
        }
      }
    }
  }
  get element() {
    return this.#elemMain;
  }
  createAction() {
    return this.#rootMain.firstChild.createAction();
  }
}

export class AppNavigation {
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
    this.#elemMain.style.display = "block";
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
    this.#divBreadcrumbs.innerHTML = "";
    switch (this.#arrBreadcrumbs.length) {
      case 0:
        this.#divMainTitle = null;
        this.#divPenultimateTitle = null;
        this.#divUltimateTitle = null;
        this.#btnHistory = null;
        break;
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
        drawUltimateTitleFull();
        this.#btnHistory = null;
        // Insert Titles
        this.#divMainTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[0].shortTitle));
        this.#divUltimateTitle.appendChild(document.createTextNode(this.#arrBreadcrumbs[1].title));
        break;
      default:
        // Create main title element (short) & ultimate title element
        drawMainTitleShort();
        drawPenultimateTitle();
        drawUltimateTitleShort();
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
    function drawUltimateTitleFull() {
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
    function drawUltimateTitleShort() {
      that.#divUltimateTitle = document.createElement("div");
      that.#divBreadcrumbs.appendChild(that.#divUltimateTitle);
      that.#divUltimateTitle.style.position = "absolute";
      that.#divUltimateTitle.style.left = "35%";
      that.#divUltimateTitle.style.top = "0%";
      that.#divUltimateTitle.style.width = "60%";
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
      that.#btnHistory.style.backgroundColor = "green";
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
            closeHistory();
            while (that.#arrBreadcrumbs[that.#arrBreadcrumbs.length - 1] !== breadcrumb) {
              that.closeLayout();
            }
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
        that.#divContent.appendChild(divHistory);
        that.#btnHistory.removeEventListener("click", openHistory);
        that.#btnHistory.addEventListener("click", closeHistory);
      }
    }
  }
}

