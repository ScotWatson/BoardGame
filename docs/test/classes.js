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
    const data = evt.data;
    let handled = false;
    for (const handler of this.#arrActionHandlers) {
      if (typeof handler.action === "function") {
        if (handler.action(data.action)) {
          handler.handler(evt);
          handled = true;
        }
      }
      if (handler.action === data.action) {
        handler.handler(evt);
        handled = true;
      }
    }
    if (!handled) {
      this.unhandledMessage(evt);
    }
  }
  // default, intended to be overwritten, may be asynchronous
  unhandledMessage(evt) {
    throw new Error("Action is not configured: " + JSON.stringify(evt.data));
  }
}

// Requires MessageHandler
class AsyncMessageRequest {
  #mapPendingRequests;
  #port;
  constructor(args) {
    const { messageHandler, port } = args;
    this.#mapPendingRequests = new Map();
    this.#port = port;
    let that = this;
    messageHandler.addHandler({
      action: "request",
      handler: async function (evt) {
        const messageId = evt.data.messageId;
        try {
          const value = await that.requestHandler(evt);
          evt.target.postMessage({
            action: "response",
            messageId,
            value,
          });
        } catch (error) {
          evt.target.postMessage({
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
        const handler = that.#mapPendingRequests.get(messageId);
        if (handler) {
          handler.resolve(evt.data.value);
        } else {
          that.unpairedResponseHandler(evt);
        }
      }
    });
    messageHandler.addHandler({
      action: "reject",
      handler: async function (evt) {
        const messageId = evt.data.messageId;
        const handler = that.#mapPendingRequests.get(messageId);
        if (handler) {
          handler.reject(evt.data.error);
        } else {
          that.unpairedResponseHandler(evt);
        }
      }
    });
  }
  // Returns a promise, therefore acts as an asynchronous function
  send(data) {
    let that = this;
    return new Promise(function (resolve, reject) {
      const messageId = self.crypto.randomUUID();
      that.#mapPendingRequests.set(messageId, { resolve, reject } );
      that.#port.postMessage({
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
