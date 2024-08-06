const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");

checkIfRunning();

const server = http.createServer(express);
const wss = new WebSocket.Server({ server });
fs.writeFileSync("server.status", "running", "utf-8");

const configs = argsToObj();

if (!configs.port) configs.port = 6626;

wss.on("connection", function connection(ws, req) {
  console.log(req.url);
  ws.sammi_identifier = req.url;

  ws.on("message", function incoming(data) {
    data = data.toString();
    let bridgeData = null;
    if (req.url === `/sammi-bridge`) {
      let dataParsed;
      try {
        dataParsed = JSON.parse(data);
      } catch {
        return;
      }
      bridgeData = {
        client_id: "/" + dataParsed.client_id,
        data: data,
      };
    }
    console.log("checking clients...");
    console.log("data recieved:", data);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        if (
          bridgeData !== null &&
          bridgeData.client_id === client.sammi_identifier
        ) {
          //this is data being sent from bridge, look for specified target/client id
          console.log(`sent data from bridge to ${client.sammi_identifier}`);
          client.send(bridgeData.data);
        } else if (client.sammi_identifier === "/sammi-bridge") {
          //this is data being sent to bridge, loop through until bridge is found
          console.log(`sent data from client ${req.url} to bridge`);
          client.send(data);
        }
      }
    });
  });
  ws.on("close", function closeConnection(ws, req) {
    console.log(`closed ${ws}`);
  });
});

server.listen(configs.port, function () {
  console.log(`Server is listening on ${configs.port}!`);
});

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

function argsToObj() {
  let configs = [];
  let obj = {};
  const arguments = process.argv.slice(2);
  arguments.forEach(value => {
    if (value.includes("=")) {
      let [k, v] = value.split("=");
      obj[k] = v;
    }
  });
  return obj;
}

async function checkIfRunning() {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // async loop code
    if (fs.existsSync("server.status")) {
      const data = fs.readFileSync("server.status", "utf8");
      // console.log(data);
      if (data === "stopped") {
        process.exit();
      }
    }
  }
}

function statusError(error) {
  fs.writeFileSync("server.status", error, "utf-8");
}

function statusStopped() {
  fs.writeFileSync("server.status", "stopped", "utf-8");
}
