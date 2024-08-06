const OBSWebSocket = require("obs-websocket-js").default;

const obs = new OBSWebSocket();

const obsHost = process.argv[2]; // OBS host
const obsPort = process.argv[3]; // OBS WebSocket port
const obsPassword = process.argv[4] !== undefined ? process.argv[4] : ""; // OBS WebSocket password


obs
.connect(`ws://${obsHost}:${obsPort}`, obsPassword, {
    rpcVersion: 1,
})
.then(resp => {
    console.log("success");
    obs.disconnect().then(() => {
        process.exit(1);
    });
})
.catch(err => {
    console.log(err);
    console.log(`host: ${obsHost}, port: ${obsPort}`);
  });
