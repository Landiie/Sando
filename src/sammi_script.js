const socketDelay = ms => new Promise(res => setTimeout(res, ms));
window.addEventListener("load", () => {
  connectToRelay(); //begin loop
});

function connectToRelay() {
  const wsUrl = "ws://127.0.0.1:6626/sammi-bridge";
  window.wsRelay = new WebSocket(wsUrl); //use window to work around firefox ocnnection issue

  window.wsRelay.onopen = () => {
    console.log("[Sando] Connected to relay server!");
    SAMMI.alert("[Sando] Connected to relay server!");
    SAMMI.setVariable("bridge_relay_connected", true, "Sando");
  };

  window.wsRelay.onclose = async () => {
    const interval = 3000;
    SAMMI.setVariable("bridge_relay_connected", false, "Sando");
    console.log("[Sando] Disconnected from relay server...");
    console.log(
      `[Sando] Retrying conection to relay server in ${interval / 1000}`
    );
    SAMMI.alert("[Sando] Disconnected from relay server...");
    SAMMI.alert(
      `[Sando] Retrying conection to relay server in ${interval / 1000}`
    );
    await socketDelay(interval);
    connectToRelay();
  };

  window.wsRelay.onerror = error => {
    console.log("[Sando] Relay Server ERROR:");
    console.error(error);
  };

  window.wsRelay.onmessage = event => {
    const eventData = JSON.parse(event.data);
    SAMMI.alert(
      `[Sando] Bridge recieved message from relay server id "${eventData.source}": ${eventData.data}`
    );
    SAMMI.triggerExt(`SandoRelay: ${eventData.source}`, {
      message: eventData.data,
    });
    console.log(event);
  };
}

function sandoCustomWindow(htmlPath, payload, saveVar, btn, instanceId) {
  if (!htmlPath) {
    devSandoError(btn, "Sando: Custom Window", `No HTML file path specified.`);
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }
  htmlPath = "file:///" + htmlPath.replaceAll("\\", "/");
  const obj = {
    client_id: "sando-helper",
    htmlPath: htmlPath,
    sammiBtn: btn,
    sammiVar: saveVar,
    sammiInstance: instanceId
  };

  if (payload !== "") {
    try {
      const parsedPayload = JSON.parse(payload);
      obj.data = parsedPayload;
    } catch (e) {
      devSandoError(btn, "Sando: Custom Window", `JSON Payload is malformed.`);
      SAMMI.setVariable(saveVar, undefined, btn, instanceId);
      return;
    }
  } else {
    payload = {}
  }

  window.wsRelay.send(JSON.stringify(obj));
}
function sandoWsRelay(msg, target, button) {
  if (target === "") {
    SAMMI.alert("[Sando] You need to provide a Client ID!");
    return;
  }

  if (target === "sammi-bridge") {
    SAMMI.alert(
      '[Sando] Sending to bridge? Use "Send JSON To Extension" instead and set up listeners in your extension code!'
    );
    return;
  }
  const obj = {
    client_id: target,
    data: msg,
  };
  window.wsRelay.send(JSON.stringify(obj));
}
// function sandoSemverCompare(mode, saveVar, source, compare, target, fromButton) {
//     if (!saveVar) {
//         devSandoError(fromButton, 'Sando: Semver Compare', `"Save Variable" missing in "${fromButton}"!`)
//     }
//     if (!source) {
//         devSandoError(fromButton, 'Sando: Semver Compare', `"Source" missing in "${fromButton}"!`)
//     }
//     if (!target) {
//         devSandoError(fromButton, 'Sando: Semver Compare', `"Target" missing in "${fromButton}"!`)
//     }
// }
// function sandoSemver(fromButton) {
//     devSandoError(fromButton, 'Sando: Semver', `Mode was not selected in button "${fromButton}"! Please choose a mode before running.`)
// }
function sandoArraySearch(fromButton) {
  devSandoError(
    fromButton,
    "Sando: Array Search",
    `Mode was not selected in button "${fromButton}"! Please choose a mode before running.`
  );
}

function sandoArraySearchSimple(
  mode,
  arrayName,
  searchString,
  saveVariable,
  fromButton
) {
  SAMMI.getVariable(arrayName, fromButton).then(resp => {
    // console.log(resp)
    if (!resp.value) {
      devSandoError(
        fromButton,
        "Sando: Array Search (Simple)",
        `Could not find array "${arrayName}"!`
      );
      SAMMI.setVariable(saveVariable, undefined, fromButton);
      return;
    }
    const arrayToSearch = resp.value;

    //check to see if is array, and if it has all the same values
    let typeCheck = "";
    const isSameValues = arrayToSearch.every(value => {
      if (typeCheck === "") {
        typeCheck = typeof value;
      } else {
        if (typeCheck != typeof value) return false;
      }
      return true;
    });

    if (!isSameValues) {
      devSandoError(
        fromButton,
        "Sando: Array Search (Simple)",
        `values in array "${arrayName}" are not all the same type. Please make sure only one datatype is inside the array! ex: only strings, numbers, etc`
      );
      SAMMI.setVariable(saveVariable, undefined, fromButton);
      return;
    }

    const fuse = new Fuse(arrayToSearch);
    let fuseResult = fuse.search(searchString);
    if (fuseResult.length === 0) fuseResult = undefined;

    SAMMI.setVariable(saveVariable, fuseResult, fromButton);
  });
}

function sandoLog(section, severity, text, logPath, button) {
  let pass = true;
  if (!text) {
    SAMMI.alert('[Sando: Log] box "Text" missing');
    pass = false;
  }

  if (!pass) return;

  if (section !== "{{!!Settings}}") {
    const obj = {
      section: section,
      severity: severity,
      text: text,
      log_path: logPath,
      button: button,
    };
    SAMMI.triggerExt("Sando: Log", obj);
  }
}
function sandoCompareExtensionVersions(extsArray, saveVariable, button) {
  if (extsArray === "{{!!SendArrayThroughBridge}}") {
    console.log(saveVariable);
    const data = JSON.parse(saveVariable); //actually a data object
    const saveTargetVariable = data.save_variable; //target button's save variable provided
    const button = data.button; //target button's button provided
    const result = JSON.parse(data.result); //target button's data to be returned as an array

    SAMMI.setVariable(saveTargetVariable, result, button);
    return;
  } else {
    const obj = {
      exts_array: extsArray,
      save_variable: saveVariable,
      FromButton: button,
    };
    SAMMI.triggerExt("Sando: Compare Extension Versions", obj);
    return;
  }
}
function sandoCompareObsPluginVersions(
  obsPath,
  pluginsArray,
  saveVariable,
  button
) {
  if (pluginsArray === "{{!!SendArrayThroughBridge}}") {
    console.log(saveVariable);
    const data = JSON.parse(saveVariable); //actually a data object
    const saveTargetVariable = data.save_variable; //target button's save variable provided
    const button = data.button; //target button's button provided
    const result = JSON.parse(data.result); //target button's data to be returned as an array

    SAMMI.setVariable(saveTargetVariable, result, button);
    return;
  } else {
    const obj = {
      obs_path: obsPath,
      plugins_array: pluginsArray,
      save_variable: saveVariable,
      FromButton: button,
    };
    SAMMI.triggerExt("Sando: Compare OBS Plugin Versions", obj);
    return;
  }
}

function sandoCompareBridgeVersions(saveVariable, requiredVersion, button) {
  const obj = {
    save_variable: saveVariable,
    required_version: requiredVersion,
    FromButton: button,
  };
  SAMMI.triggerExt("Sando: Compare Bridge Versions", obj);
}

function devSandoError(buttonid, commandName, message) {
  SAMMI.alert(
    `[Sando] ERR in button '${buttonid}' command "${commandName}": ${message}`
  );
}
