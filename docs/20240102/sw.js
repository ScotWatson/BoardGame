/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

let lastInstallTime;
let lastActivateTime;

const mapUsers = new Map();
function addUser(username, password) {
  if (mapUsers.has(username)) {
    throw "Username already exists.";
  }
  const newUser = {
    username: username,
    password: password,
  };
  mapUsers.set(username, newUser);
}

const mapTokens = new Map();
function loginUser(username, password) {
  const user = mapUsers.get(username);
  if (user === undefined) {
    throw "Username does not exist.";
  }
  if (user.password !== password) {
    throw "Invalid password.";
  }
  const newToken = self.crypto.randomUUID();
  mapTokens.set(newToken, username);
  return newToken;
}
function logoutUser(token) {
  mapTokens.delete(token);
}
function getUser(token) {
  const username = mapTokens.get(token);
  if (username === undefined) {
    return null;
  }
  return mapUsers.get(username);
}

const mapGames = new Map();
function addGame(title, action) {
  const newId = self.crypto.randomUUID();
  const newGame = {
    title: title,
    players: [],
  };
  mapGames.set(newId, newGame);
  return newGame;
}
function getGame(id) {
  return mapGames.get(id);
}
function removeGame(id) {
  sendMessage("Removing game: " + id);
  mapGames.delete(id);
  sendMessage(mapGames);
}

const mapOptions = new Map();
function addOption(objOption) {
  objOption.id = self.crypto.randomUUID();
  mapOptions.set(objOption.id, objOption);
  return objOption;
}
function removeOption(id, nested) {
  if (nested) {
    const thisOption = mapOptions.get(id);
    for (const option of thisOption.options) {
      removeOption(option.id, true);
    }
  }
  mapOptions.delete(id);
}

const objNewGameOptions = {
  type: "select",
  description: "",
  options: [],
  operations: [],
  validations: [],
  maxOptions: 0,
}
const objInfo = {
  name: "Fake Game",
  description: "A fake game designed to test the interface",
  options: addOption(objNewGameOptions),
}

self.addEventListener("install", function (evt) {
  lastInstallTime = new Date();
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (evt) {
  lastActivateTime = new Date();
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (evt) {
  evt.respondWith(fetchModified(evt.request));
  // if path starts with "https://scotwatson.github.io/BoardGame/FakeGame/", invoke API
  // "index.html" should still be accessable. It forms the "server-side" interface.
  async function fetchModified(request) {
    const urlRequest = new URL(request.url);
    const urlSelf = new URL(self.location);
    const urlFakeGame = new URL("./FakeGame/", urlSelf);
    if (urlRequest.href.startsWith(urlFakeGame.href)) {
      const endpoint = urlRequest.href.substring(urlFakeGame.href.length);
      const arrEndpoint = endpoint.split("/");
      await sendMessage(arrEndpoint);
      switch (arrEndpoint[0]) {
        case "index.html": {
          return await fetch(request);
        }
        case "info": {
          const jsonInfo = JSON.stringify(objInfo);
          const blobInfo = new Blob( [ jsonInfo ], { type: "application/json" });
          return new Response(blobInfo, {
            status: 200,
            statusText: "OK",
            headers: [],
          });
        }
        case "user": {
          switch (arrEndpoint[1]) {
            case "new": {
              try {
                const objNewUser = await request.json();
                const { username, password } = objNewUser;
                addUser(username, password);
                const token = loginUser(username, password);
                const objToken = {
                  token,
                };
                const jsonToken = JSON.stringify(objToken);
                const blobToken = new Blob( [ jsonToken ], { type: "application/json" });
                return new Response(blobToken, {
                  status: 200,
                  statusText: "OK",
                  headers: [],
                });
              } catch (e) {
                return new Response(e.message, {
                  status: 404,
                  statusText: "Not Found",
                  headers: [],
                });
              }
            }
            case "login": {
              try {
                const objLogin = await request.json();
                const { username, password } = objLogin;
                const token = loginUser(username, password);
                const objToken = {
                  token,
                };
                const jsonToken = JSON.stringify(objToken);
                const blobToken = new Blob( [ jsonToken ], { type: "application/json" });
                return new Response(blobToken, {
                  status: 200,
                  statusText: "OK",
                  headers: [],
                });
              } catch (e) {
                return new Response(e.message, {
                  status: 404,
                  statusText: "Not Found",
                  headers: [],
                });
              }
            }
            case "logout": {
              try {
                const objToken = await request.json();
                const { token } = objToken;
                logoutUser(token);
                return new Response("", {
                  status: 200,
                  statusText: "OK",
                  headers: [],
                });
              } catch (e) {
                return new Response(e.message, {
                  status: 404,
                  statusText: "Not Found",
                  headers: [],
                });
              }
            }
            default: {
              return new Response("Not a configured endpoint", {
                status: 404,
                statusText: "Not Found",
                headers: [],
              });
            }
          }
        }
        case "games": {
          try {
            const arrGameSummaries = [];
            for (const entry of mapGames.entries()) {
              const [ id, value ] = entry;
              arrGameSummaries.push({
                gameId: id,
                title: value.title,
              });
            }
            const jsonGameSummaries = JSON.stringify(arrGameSummaries);
            const blobGameSummaries = new Blob( [ jsonGameSummaries ], { type: "application/json" });
            return new Response(blobGameSummaries, {
              status: 200,
              statusText: "OK",
              headers: [],
            });
          } catch (e) {
            return new Response(e.message, {
              status: 404,
              statusText: "Not Found",
              headers: [],
            });
          }
        }
        case "game": {
          switch (arrEndpoint[1]) {
            case "new": {
              try {
                const token = arrEndpoint[2];
                const thisUser = getUser(token);
                if (thisUser === null) {
                  return new Response("This user is not logged in.", {
                    status: 404,
                    statusText: "Not Found",
                    headers: [],
                  });
                }
                const objGameData = await request.json();
                const { title, action } = objGameData;
                const thisGame = addGame(title, action);
                thisGame.players.push(thisUser.username);
                return new Response("", {
                  status: 200,
                  statusText: "OK",
                  headers: [],
                });
              } catch (e) {
                return new Response(e.message, {
                  status: 404,
                  statusText: "Not Found",
                  headers: [],
                });
              }
            }
            default: {
              const gameId = arrEndpoint[1];
              const thisGame = getGame(gameId);
              switch (arrEndpoint[2]) {
                case "info": {
                  try {
                    const players = [];
                    for (const player of thisGame.players) {
                      players.push({
                        username: player,
                        hasOptions: true,
                      });
                    }
                    const objGameInfo = {
                      title: thisGame.title,
                      players,
                    }
                    const jsonGameInfo = JSON.stringify(objGameInfo);
                    const blobGameInfo = new Blob( [ jsonGameInfo ], { type: "application/json" });
                    return new Response(blobGameInfo, {
                      status: 200,
                      statusText: "OK",
                      headers: [],
                    });
                  } catch (e) {
                    return new Response(e.message, {
                      status: 404,
                      statusText: "Not Found",
                      headers: [],
                    });
                  }
                }
                case "join": {
                  try {
                    const token = arrEndpoint[3];
                    const thisUser = getUser(token);
                    if (thisUser === null) {
                      return new Response("This user is not logged in.", {
                        status: 404,
                        statusText: "Not Found",
                        headers: [],
                      });
                    }
                    if (thisGame.players.includes(thisUser.username)) {
                      return new Response("This user has already joined.", {
                        status: 404,
                        statusText: "Not Found",
                        headers: [],
                      });
                    }
                    thisGame.players.push(thisUser.username);
                    return new Response("", {
                      status: 200,
                      statusText: "OK",
                      headers: [],
                    });
                  } catch (e) {
                    return new Response(e.message, {
                      status: 404,
                      statusText: "Not Found",
                      headers: [],
                    });
                  }
                }
                case "unjoin": {
                  try {
                    const token = arrEndpoint[3];
                    const thisUser = getUser(token);
                    if (thisUser === null) {
                      return new Response("This user is not logged in.", {
                        status: 404,
                        statusText: "Not Found",
                        headers: [],
                      });
                    }
                    const playerIndex = thisGame.players.indexOf(thisUser.username);
                    if (playerIndex === -1) {
                      return new Response("This user has already unjoined.", {
                        status: 404,
                        statusText: "Not Found",
                        headers: [],
                      });
                    }
                    thisGame.players.splice(playerIndex, 1);
                    if (thisGame.players.length === 0) {
                        removeGame(gameId);
                    }
                    return new Response("", {
                      status: 200,
                      statusText: "OK",
                      headers: [],
                    });
                  } catch (e) {
                    return new Response(e.message, {
                      status: 404,
                      statusText: "Not Found",
                      headers: [],
                    });
                  }
                }
                default: {
                  return new Response("Not a configured endpoint", {
                    status: 404,
                    statusText: "Not Found",
                    headers: [],
                  });
                }
              }
            }
          }
        }
        default: {
          return new Response("Not a configured endpoint", {
            status: 404,
            statusText: "Not Found",
            headers: [],
          });
        }
      }
    } else {
      return await fetch(request);
    }
  }
});

self.addEventListener("message", function (evt) {
//  if (evt.source.url !== "https://scotwatson.github.io/BoardGame/FakeGame/index.html") {
//    return;
//  }
  evt.waitUntil((async function () {
    const data = evt.data;
    if (data.action === "getUsers") {
      evt.source.postMessage("numUsers: " + mapUsers.size);
    }
    if (data.action === "numClients") {
      evt.source.postMessage("numClients: " + (await self.clients.matchAll()).length);
    }
    if (data.action === "getTimes") {
      evt.source.postMessage({lastInstallTime, lastActivateTime});
    }
    await sendServerMessage("ACK");
  })());
});

async function sendMessage(data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage(data);
  }
}

async function sendServerMessage(data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    if (client.url === "https://scotwatson.github.io/BoardGame/FakeGame/index.html") {
      client.postMessage(data);
    }
  }
}
