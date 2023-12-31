/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const mapUsers = new Map();
function addUser(username, password) {
  if (mapUsers.has(username)) {
    throw "Username already exists";
  }
  const newUser = {
    username: username,
    password: password,
  };
  mapUsers.set(username, newUser);
}

const mapTokens = new Map();
function loginUser(username, password) {
  const newId = self.crypto.randomUUID();
  mapTokens.set(newId, username);
}
function logoutUser(token) {
  mapTokens.delete(newId);
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

const mapOptions = new Map();
function addOption(objOption) {
  objOption.id = self.crypto.randomUUID();
  mapGames.set(objOption.id, objOption);
  return newGame;
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
}
const objInfo = {
  name: "Fake Game",
  description: "A fake game designed to test the interface",
  options: objNewGameOptions,
}

self.addEventListener("install", function (evt) {
  // only occurs once
  evt.waitUntil(Promise.resolve());
});

self.addEventListener("activate", function (evt) {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (evt) {
  evt.respondWith(fetchModified(evt.request));
  // if path starts with "https://scotwatson.github.io/BoardGame/FakeGame/", invoke API
  // "index.html" should still be accessable. It forms the "server-side" interface.
  async function fetchModified(request) {
    const urlRequest = new URL(request.url);
    const urlSelf = new URL(self.location);
    const urlFakeGame = new URL("/FakeGame/", urlSelf);
    await sendMessage(urlFakeGame);
    if (urlRequest.href.startsWith(urlFakeGame.href)) {
      const endpoint = requestURL.pathname.substring(urlFakeGame.href.length - 1);
      switch (endpoint) {
        case "/index.html":
          return await fetch(request);
        case "/info":
          const jsonInfo = JSON.serialize(objInfo);
          const blobInfo = new Blob(jsonInfo)
          return new Response(blobInfo, {
            status: 200,
            statusText: "OK",
            headers: [],
          });
          break;
        case "/info":
          break;
        default:
          break;
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
    if (data.action === "skipWaiting") {
      self.skipWaiting();
      evt.source.postMessage("done");
    }
    if (data.action === "getUsers") {
      evt.source.postMessage("numUsers: " + mapUsers.size);
    }
    if (data.action === "numClients") {
      evt.source.postMessage("numClients: " + (await self.clients.matchAll()).length);
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
