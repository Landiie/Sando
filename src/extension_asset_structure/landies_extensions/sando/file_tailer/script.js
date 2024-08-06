const fs = require("fs");
// const follow = require("text-file-follower");
const tail = require("tail-file");
const axios = require("axios");

//pipeline
storePID();
checkIfRunning();

//sando: file watcher
const watcherObjects = {};
const watcherObjectIntervals = {};
const watcherObjectLineBuffers = {};

const batchSize = 10;
const batchIntervalMs = 50;
const apiPort = process.argv[2];
const filesToWatch = JSON.parse(fs.readFileSync("data.txt", "utf8"));
// const apiPort = "9451"; //! debug
// const filesToWatch = [
//   "C:/Users/Landie/Documents/My Games/Binding of Isaac Repentance/log.txt",
//   "C:/Cloud/Google Drive (Business)/SAMMI (extension development)/testing.fenc",
// ]; //! debug

fileWatch();

function fileWatch() {
  addFileListeners(filesToWatch);
}
//? Functions

function sendBatch(trigger, watcherName) {
  if (watcherObjectLineBuffers[watcherName].length === 0) {
    return; //there is nothing, so don't continue
  }

  console.log("sending batch, state:", trigger);

  postToSAMMI(apiPort, trigger, watcherName);

  // Clear the line buffer
  watcherObjectLineBuffers[watcherName] = [];
}

function addFileListeners(filesArray) {
  filesArray.forEach((obj, index) => {
    const watcherName = `fileWatch${index}`;
    const path = obj.path;
    const extTrigger = obj.ext_trigger;
    let list = false;
    if (obj.list !== 0 && obj.list != undefined) {
      list = JSON.parse(obj.list);
    }
    const listType = obj.list_type;

    watcherObjectLineBuffers[watcherName] = [];

    console.log("adding listeners, state:", extTrigger);
    console.log("watcher name:", index);

    watcherObjects[watcherName] = new tail(path, { force: true });
    watcherObjects[watcherName].on("line", line => {
      const trigger = extTrigger;
      console.log("did this pass?", trigger);
      console.log(line);

      //check to see if list exists. if so, filter
      let passFilter = true;
      if (list) {
        let passFilterWhitelistCounter = 0;

        for (const keyphrase of list) {
          if (line.includes(keyphrase)) {
            if (listType === "Blacklist") {
              passFilter = false;
              break;
            } else {
              passFilterWhitelistCounter++;
            }
          }
        }

        if (passFilterWhitelistCounter === 0 && listType === "Whitelist")
          passFilter = false;
      }

      if (!passFilter) return;

      watcherObjectLineBuffers[watcherName].push(line);

      // Check if the buffer has reached the batch size
      if (watcherObjectLineBuffers[watcherName].length >= batchSize) {
        sendBatch(trigger, watcherName);
      }
    });
    watcherObjectIntervals[watcherName] = setInterval(() => {
      const trigger = extTrigger;
      sendBatch(trigger, watcherName);
    }, batchIntervalMs);

    watcherObjects[watcherName].start();
  });
}

function postToSAMMI(port, ext_trigger, watcherName) {
  console.log("posting to sammi, state:", ext_trigger);

  const url = `http://127.0.0.1:${port}/webhook`;
  const postData = {
    trigger: "Sando: File Watch/Tail (Server)",
    ext_trigger: ext_trigger,
    lines: watcherObjectLineBuffers[watcherName],
  };

  console.log("posted");

  axios
    .post(url, postData)
    .then(response => {
      console.log("Response:", response.data);
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    });
}

function storePID() {
  const pid = process.pid;
  fs.writeFileSync(`script.pid`, pid.toString());
}

async function checkIfRunning() {
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // async loop code
    if (fs.existsSync("script.status")) {
      const data = fs.readFileSync("script.status", "utf8");
      // console.log(data);
      if (data === "stopped") {
        process.exit();
      }
    }
  }
}
