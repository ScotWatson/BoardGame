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

let workerTestGame = null;

const promiseControllerConnected = new Promise(function (resolve, reject) {
  if (window.navigator.serviceWorker.controller !== null) {
    resolve();
  } else {
    window.navigator.serviceWorker.addEventListener("controllerchange", function () {
      resolve();
    });
  }
});

async function start() {
  const layout = new DocumentFragment();
  const inpTestGameScriptFile = document.createElement("input");
  inpTestGameScriptFile.type = "file";
  layout.appendChild(inpTestGameScriptFile);
  const inpTestGameImageFiles = document.createElement("input");
  inpTestGameImageFiles.type = "file";
  inpTestGameImageFiles.multiple = true;
  layout.appendChild(inpTestGameImageFiles);
  const btnUpload = document.createElement("button");
  btnUpload.append("Upload");
  btnUpload.addEventListener("click", function (evt) {
    const fileWorkerScript = inpTestGameScriptFile.files[0];
    const filesImages = inpTestGameScriptFile.files;
    if (workerTestGame !== null) {
      workerTestGame.terminate();
    }
    workerTestGame = new Worker(URL.createObjectURL(fileWorkerScript));
    workerTestGame.addEventListener("message", function (evt) {
      console.log(evt.data);
    });
    workerTestGame.postMessage({
      action: "ping",
    });
    const channelTestGame = new MessageChannel();
    workerTestGame.postMessage({
      action: "port",
      port: channelTestGame.port1,
    }, [ channelTestGame.port1 ]);
    promiseControllerConnected.then(function () {
      window.navigator.serviceWorker.controller.postMessage({
        action: "port",
        port: channelTestGame.port2,
      }, [ channelTestGame.port2 ]);
    });
  });
  layout.appendChild(btnUpload);
  promiseControllerConnected.then(function () {
    document.body.appendChild(layout);
  });
}
