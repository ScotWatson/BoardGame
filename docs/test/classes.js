/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class MessageHandler {
  #arrActionHandlers;
  constructor(args) {
    this.#arrActionHandlers = [];
  }
  addHandler(args) {
    const { action, handler } = args;
    this.#arrActionHandlers.push({ action, handler });
  }
  removeHandler(args) {
    const { action } = args;
  }
  get mainHandler() {
    let that = this;
    return function (evt) {
      return that.#mainHandler(evt);
    }
  }
  #mainHandler(evt) {
    console.log(this.#arrActionHandlers);
    const data = evt.data;
    console.log(data.action);
    for (const handler of this.#arrActionHandlers) {
      if (typeof handler.action === "function") {
        if (handler.action(data.action)) {
          handler.handler(evt);
        }
      }
      if (handler.action === data.action) {
        handler.handler(evt);
      }
    }
    this.unhandledMessage(evt);
  }
  // default, intended to be overwritten, may be asynchronous
  unhandledMessage(evt) {
    throw new Error("Action is not configured: " + JSON.stringify(evt.data));
  }
}

// Requires MessageHandler
class AsyncMessageRequest {
  #mapPendingRequests;
  constructor(args) {
    const { messageHandler } = args;
    this.#mapPendingRequests = new Map();
    messageHandler.addHandler({
      action: "request",
      handler: async function (evt) {
        const messageId = evt.data.messageId;
        try {
          const value = await this.requestHandler(evt);
          evt.source.postMessage({
            action: "response",
            messageId,
            value,
          });
        } catch (error) {
          evt.source.postMessage({
            action: "reject",
            messageId,
            error,
          });
        }
      }
    });
    messageHandler.addHandler({
      action: "response",
      handler: async function (evt) {
        const messageId = evt.data.messageId;
        const handler = this.#mapPendingRequests.get(messageId);
        if (handler) {
          handler.resolve(evt.data.value);
        } else {
          this.unpairedResponseHandler(evt);
        }
      }
    });
    messageHandler.addHandler({
      action: "reject",
      handler: async function (evt) {
        const messageId = evt.data.messageId;
        const handler = this.#mapPendingRequests.get(messageId);
        if (handler) {
          handler.reject(evt.data.error);
        } else {
          this.unpairedResponseHandler(evt);
        }
      }
    });
  }
  // Returns a promise, therefore acts as an asynchronous function
  send(data) {
    return new Promise(function (resolve, reject) {
      const messageId = self.crypto.randomUUID();
      mapPendingRequests.set(messageId, { resolve, reject } );
      serverPort.postMessage({
        action: "request",
        messageId: messageId,
        data: data,
      });
    });
  }
  // default, intended to be overwritten, may be asynchronous
  requestHandler(evt) {
    throw new Error("RequestHandler must be set");
  }
  // default, intended to be overwritten, may be asynchronous
  unpairedResponseHandler(evt) {
    throw new Error("unpairedResponseHandler must be set");
  }
}
