const ini = require("ini");
const fs = require("fs");
const findProcess = require("find-process");
const process = require("process");
const utils = require("../util.js");
const path = require("path");
const { execSync } = require("child_process");

const connections = JSON.parse(utils.b64ToString(process.argv[2]));
// console.log(connections)
// process.exit(1);
const newConnections = {};

(async () => {
  const list = await findProcess("name", "obs64", true);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const obsExePath = item.bin;
    const extraProcessInfo = {};
    const isAdmin = obsExePath === "" ? true : false;
    if (isAdmin) continue;
    const obsInfo = getObsInfo(obsExePath);
    for (let i2 = 0; i2 < connections.length; i2++) {
      const connection = connections[i2];
      //get websocket extended info
      const wsInfo = getWebsocketData(obsInfo.global_data, obsInfo.config_path);
      if (connection.port !== wsInfo.port) continue;
      newConnections[connection.name] = obsInfo;
      newConnections[connection.name].extended_ws_info = wsInfo;
    }
  }
  console.log(JSON.stringify(newConnections));
})();

function getObsInfo(obsExePath) {
  const info = {
    exe_path: obsExePath,
    is_portable: null,
    config_path: null,
    root_path: null,
    latest_log_path: null,
    global_data: null,
    extended_ws_info: null, //filled out way later
  };
  const rootPath = path.join(obsExePath, "..", "..", "..");
  const portableConfigPath = path.resolve(
    path.join(rootPath, "config", "obs-studio")
  );
  const isPortable = fs.existsSync(portableConfigPath);
  const configPath = isPortable ? portableConfigPath : getAppDataConfig();
  const logsPath = path.join(configPath, "logs");
  const latestLog = getLatestLog(logsPath);
  const globalsPath = path.join(configPath, "global.ini");
  const globalData = ini.parse(fs.readFileSync(globalsPath, "utf-8"));
  
  info.is_portable = isPortable;
  info.config_path = configPath ? configPath : null;
  info.root_path = rootPath ? rootPath : null;
  info.latest_log_path = latestLog ? latestLog : null;
  info.global_data = globalData ? globalData : null;

  return info;
}

function getAppDataConfig() {
  const execResult = execSync("echo %APPDATA%", { stdio: "pipe" })
    .toString()
    .trim();
  const configPath = path.join(execResult, "obs-studio");
  return configPath;
}

function getLatestLog(logsPath) {
  let files = fs.readdirSync(logsPath, "utf-8");
  for (var i = 0; i < files.length; i++) {
    for (var j = 0; j < files.length; j++) {
      //create the stats files
      var firstFileStats = fs.statSync(path.join(logsPath, files[i]));
      var secondFileStats = fs.statSync(path.join(logsPath, files[j]));
      //if files[i] comes before files[j] and files[i] modification time is older than files[j] modification time, swap them
      if (i > j && firstFileStats.mtimeMs > secondFileStats.mtimeMs) {
        var swap = files[i];
        files[i] = files[j];
        files[j] = swap;
      }
    }
  }
  return path.join(logsPath, files[0]);
}

function getWebsocketData(globalData, configPath) {
  const obj = {
    port: 4455,
    ps: "",
    enabled: true,
    first_load: false,
    auth: false,
  };

  if (globalData.OBSWebSocket.ServerPort !== undefined) {
    obj.port = parseInt(globalData.OBSWebSocket.ServerPort);
    obj.ps = globalData.OBSWebSocket.ServerPassword;
    obj.enabled = globalData.OBSWebSocket.ServerEnabled;
    obj.first_load = false; //not found in obs 30.1 and below
    obj.auth = globalData.OBSWebSocket.AuthRequired;
  } else if (obj.port !== undefined) {
    //could not find first data, means it's an updated OBS
    const websocketPath = path.join(
      configPath,
      "plugin_config",
      "obs-websocket",
      "config.json"
    );
    const data = JSON.parse(fs.readFileSync(websocketPath, "utf-8"));
    obj.port = data.server_port;
    obj.ps = data.server_password;
    obj.enabled = data.server_enabled;
    obj.first_load = data.first_load;
    obj.auth = data.auth_required;
  } else {
      console.log("Could not find websocket data in known locations");
      process.exit(1);
  }

  return obj;
}
