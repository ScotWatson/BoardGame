/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const mapGames = new Map();
function addGame(title, action) {
  
}
const mapOptions = new Map();
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
  evt.waitUntil(Promise.resolve());
});

self.addEventListener("fetch", function (evt) {
  evt.respondWith(fetchModified(evt.request));
  // if path starts with "https://scotwatson.github.io/BoardGame/FakeGame/", invoke API
  // "index.html" should still be accessable. It forms the "server-side" interface.
  async function fetchModified(request) {
    const requestURL = new URL(request.url);
    if (requestURL.pathname.startsWith("https://scotwatson.github.io/BoardGame/FakeGame/")) {
      const endpoint = requestURL.pathname.substring("https://scotwatson.github.io/BoardGame/FakeGame/".length - 1);
      switch (endpoint) {
        case "/index.html":
          return await fetch(request);
        case "/info":
          const jsonInfo = JSON.serialize(objInfo);
          const blobInfo = new Blob(jsonInfo)
          return new Response(blobInfo, {
            status: 200,
            statusText: directResponse.statusText,
            headers: directResponse.headers,
          });
          break;
        case "/info":
          break;
        default:
          break;
      }
      await sendMessage("Modified Fetch");
      const directResponse = await fetch("https://scotwatson.github.io/ServiceWorkerTest/test.js");
    } else {
      return await fetch(request);
    }
  }
});

self.addEventListener("message", function (evt) {
  evt.waitUntil((async function () {
    const data = evt.data;
    if (data.action === "claim") {
      await self.clients.claim();
      evt.source.postMessage("done");
    }
    if (data.action === "skipWaiting") {
      self.skipWaiting();
      evt.source.postMessage("done");
    }
    if (data.action === "numClients") {
      const clients = await self.clients.matchAll();
      evt.source.postMessage("numClients: " + clients.length);
    }
    if (data.action === "numFetches") {
      evt.source.postMessage("numFetches: " + numFetches);
    }
    await sendMessage("Test Broadcast");
  })());
});

async function sendMessage(data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage(data);
  }
}
