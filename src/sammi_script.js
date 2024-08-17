const sandoDelay = ms => new Promise(res => setTimeout(res, ms));
window.addEventListener("load", async () => {
  await sandoDelay(200)
  connectToRelay(); //begin loop
});

function connectToRelay() {
  const wsUrl = "ws://127.0.0.1:6626/sammi-bridge";
  window.wsRelay = new WebSocket(wsUrl); //use window to work around firefox ocnnection issue

  window.wsRelay.onopen = () => {
    console.log("[Sando] Connected to relay server!");
    SAMMI.alert("[Sando] Connected to relay server!");
    //SAMMI.setVariable("bridge_relay_connected", true, "Sando");
  };

  window.wsRelay.onclose = async () => {
    const interval = 500;
    SAMMI.setVariable("bridge_relay_connected", false, "Sando");
    console.log("[Sando] Disconnected from relay server...");
    console.log(
      `[Sando] Retrying conection to relay server in ${interval / 1000}`
    );
    SAMMI.alert("[Sando] Disconnected from relay server...");
    SAMMI.alert(
      `[Sando] Retrying conection to relay server in ${interval / 1000}`
    );
    await sandoDelay(interval);
    connectToRelay();
  };

  window.wsRelay.onerror = error => {
    console.log("[Sando] Relay Server ERROR:");
    console.error(error);
  };

  window.wsRelay.onmessage = async event => {
    console.log("relay data recieved: ", event);
    const eventData = JSON.parse(event.data);
    //separates out unique events
    switch (eventData.event) {
      case "SandoDevHelperConnected":
        SAMMI.setVariable("bridge_relay_connected", true, "Sando");
        break;
      case "SandoDevTriggerExtCustomWindow":
        console.log("Custom event: TriggerExt CustomWindow");
        SAMMI.triggerExt(eventData.extTrigger, eventData.params);
        break;
      case "SandoDevTriggerButtonCustomWindow":
        console.log("Custom event: TriggerButton CustomWindow");
        SAMMI.triggerButton(eventData.button);
        break;
      case "SandoDevGetVariableCustomWindow":
        console.log("Custom event: GetVariable CustomWindow");
        console.log(eventData);
        sandoWindowGetVariable(
          eventData.variable,
          eventData.button,
          eventData.hash,
          eventData.windowHash
        );
        break;
      case "SandoDevSetVariableCustomWindow":
        console.log(eventData);
        console.log("Custom event: SetVariable CustomWindow");
        if (eventData.instance) {
          SAMMI.setVariable(
            eventData.variable,
            eventData.value,
            eventData.button,
            eventData.instance
          );
        } else {
          SAMMI.setVariable(
            eventData.variable,
            eventData.value,
            eventData.button
          );
        }
        break;
      case "SandoDevWindowShowing":
        console.log(eventData);
        console.log("Custom event: Window Visible CustomWindow");
        if (eventData.instance) {
          SAMMI.setVariable(
            eventData.variable,
            eventData.value,
            eventData.button,
            eventData.instance
          );
        } else {
          SAMMI.setVariable(
            eventData.variable,
            eventData.value,
            eventData.button
          );
        }
        break;
      case "SandoDevDialog":
        console.log(eventData);
        console.log("Custom event: Dialog Result");
        if (eventData.instance) {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button,
            eventData.instance
          );
        } else {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button
          );
        }
        break;
      case "SandoDevFileOpen":
        console.log(eventData);
        console.log("Custom event: Dialog open");
        if (eventData.instance) {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button,
            eventData.instance
          );
        } else {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button
          );
        }
        break;
      case "SandoDevFileSave":
        console.log(eventData);
        console.log("Custom event: Dialog save");
        if (eventData.instance) {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button,
            eventData.instance
          );
        } else {
          SAMMI.setVariable(
            eventData.variable,
            eventData.result,
            eventData.button
          );
        }
        break;
      default:
        //typical use case
        SAMMI.alert(
          `[Sando] Bridge recieved message from relay server id "${eventData.source}": ${eventData.data}`
        );
        SAMMI.triggerExt(`SandoRelay: ${eventData.source}`, {
          message: eventData.data,
        });
        console.log(event);
        break;
    }
  };
}

async function sandoWindowGetVariable(name, button, hash, windowHash) {
  console.log(
    "running util function to get variable because we dont want to hold up anything"
  );
  console.log("grabbing variable", name, "from", button);
  const res = await SAMMI.getVariable(name, button);
  console.log("result: ", res);
  const obj = {
    target_client_id: "Sando Helper",
    data: JSON.stringify({
      event: "GetVariableResult",
      value: res.Value,
      hash: hash,
      windowHash: windowHash,
    }),
  };
  //console.log(window.wsRelay);
  window.wsRelay.send(JSON.stringify(obj));
  console.log("should send now");
}

async function sandoCustomWindowDropdown(
  header,
  caption,
  arrName,
  saveVar,
  btn,
  instanceId
) {
  if (!header) {
    devSandoError(btn, "Sando: CW Dropdown", `No header specified. Required!`);
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }

  if (!arrName) {
    devSandoError(
      btn,
      "Sando: CW Dropdown",
      `No array name specified. Your dropdown needs options to pick from!`
    );
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }
  let arrContents = await SAMMI.getVariable(arrName, btn);
  arrContents = arrContents.value;

  console.log("arr contents: ", arrContents);

  if (!Array.isArray(arrContents)) {
    devSandoError(
      btn,
      "Sando: CW Dropdown",
      `Array name "${arrName}" does not exist`
    );
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }

  if (arrContents.length < 2) {
    devSandoError(
      btn,
      "Sando: CW Dropdown",
      `${arrContents.length} elements found inside "${arrName}". You need at least two options!`
    );
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }

  SAMMI.triggerExt("Sando: CW Dropdown", {
    header: header,
    caption: caption,
    arr: arrContents,
    var: saveVar,
    FromButton: btn,
    instanceId: instanceId,
  });
}

function sandoCustomWindow(
  htmlPath,
  config,
  payload,
  id,
  saveVarVis,
  saveVar,
  btn,
  instanceId
) {
  if (!htmlPath) {
    devSandoError(btn, "Sando: Custom Window", `No HTML file path specified.`);
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }
  htmlPath = "file:///" + htmlPath.replaceAll("\\", "/");
  const obj = {
    target_client_id: "Sando Helper",
    data: {
      event: "NewWindow",
      htmlPath: htmlPath,
      sammiBtn: btn,
      sammiVarVis: saveVarVis,
      sammiVar: saveVar,
      sammiInstance: instanceId,
      windowConfig: {},
      payload: {},
      id: id,
    },
  };

  if (payload !== "") {
    try {
      const parsedPayload = JSON.parse(payload);
      obj.data.payload = parsedPayload;
    } catch (e) {
      devSandoError(btn, "Sando: Custom Window", `JSON Payload is malformed.`);
      SAMMI.setVariable(saveVar, undefined, btn, instanceId);
      return;
    }
  }

  if (config !== "") {
    try {
      const parsedConfig = JSON.parse(config);
      obj.data.windowConfig = parsedConfig;
    } catch (e) {
      devSandoError(
        btn,
        "Sando: Custom Window",
        `JSON Window Config is malformed.`
      );
      SAMMI.setVariable(saveVar, undefined, btn, instanceId);
      return;
    }
  }

  //relay recieves data as string from bridge
  obj.data = JSON.stringify(obj.data);

  console.log("sending a custom window, heres the data: ", obj);
  window.wsRelay.send(JSON.stringify(obj));
}

function sandoCustomWindowEvent(id, eventToEmit, payload, btn, instanceId) {
  if (!id) {
    devSandoError(
      btn,
      "Sando: CW Custom (Event)",
      'No "ID" provided, no window to identify'
    );
    //SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }

  if (!eventToEmit) {
    devSandoError(
      btn,
      "Sando: CW Custom (Event)",
      'No "Event Name" provided, no event to emit to window'
    );
    //SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }

  const obj = {
    target_client_id: "Sando Helper",
    data: {
      event: "EmitEventWindow",
      id: id,
      eventToEmit: eventToEmit,
      payload: {},
      sammiBtn: btn,
      //sammiVar: saveVar,
      sammiInstance: instanceId,
    },
  };

  if (payload !== "") {
    try {
      const parsedPayload = JSON.parse(payload);
      obj.data.payload = parsedPayload;
    } catch (e) {
      devSandoError(
        btn,
        "Sando: CW Custom (Event)",
        `JSON Payload is malformed.`
      );
      //SAMMI.setVariable(saveVar, undefined, btn, instanceId);
      return;
    }
  }

  //relay recieves data as string from bridge
  obj.data = JSON.stringify(obj.data);

  console.log("sending a event to be emitted, heres the data: ", obj);
  window.wsRelay.send(JSON.stringify(obj));
}

async function sandoSystemDialogPopup() {}

async function sandoSystemDialogSave(
  title,
  path,
  label,
  filters,
  properties,
  saveVar,
  btn,
  instanceId
) {
  if (!saveVar) {
    devSandoError(
      saveVar,
      "Sando: SD Save",
      'No "Save Variable" provided, you cant get the response from the user without this!'
    );
  }
  const obj = {
    target_client_id: "Sando Helper",
    data: {
      event: "NewFileSave",
      title: title,
      path: path,
      label: label,
      filters: filters,
      properties: properties,
      sammiBtn: btn,
      sammiVar: saveVar,
      sammiInstance: instanceId,
    },
  };

  //relay recieves data as string from bridge
  obj.data = JSON.stringify(obj.data);

  console.log("sending a file save dialog, heres the data: ", obj);
  window.wsRelay.send(JSON.stringify(obj));
}

async function sandoSystemDialogOpen(
  title,
  path,
  label,
  filters,
  properties,
  saveVar,
  btn,
  instanceId
) {
  if (!saveVar) {
    devSandoError(
      btn,
      "Sando: SD Open",
      'No "Save Variable" provided, you cant get the response from the user without this!'
    );
    SAMMI.setVariable(saveVar, undefined, btn, instanceId);
    return;
  }
  const obj = {
    target_client_id: "Sando Helper",
    data: {
      event: "NewFileOpen",
      title: title,
      path: path,
      label: label,
      filters: filters,
      properties: properties,
      sammiBtn: btn,
      sammiVar: saveVar,
      sammiInstance: instanceId,
    },
  };

  //relay recieves data as string from bridge
  obj.data = JSON.stringify(obj.data);

  console.log("sending a file open dialog, heres the data: ", obj);
  window.wsRelay.send(JSON.stringify(obj));
}

async function sandoSystemDialogChoice(
  type,
  title,
  message,
  details,
  defaultYes,
  saveVar,
  button,
  instanceId
) {
  if (!saveVar) {
    devSandoError(
      button,
      "Sando: SD Choice",
      'No "Save Variable" provided, you cant get the response from the user without this!'
    );
    return;
  }

  SAMMI.triggerExt("Sando: SD Choice", {
    type: type.toLowerCase(),
    title: title,
    message: message,
    detail: details,
    defaultYes: defaultYes,
    var: saveVar,
    FromButton: button,
    instanceId: instanceId,
  });
}

function sandoSystemDialog(config, saveVar, btn, instanceId) {
  const obj = {
    target_client_id: "Sando Helper",
    data: {
      event: "NewDialog",
      sammiBtn: btn,
      sammiVar: saveVar,
      sammiInstance: instanceId,
      dialogConfig: {},
    },
  };

  if (config !== "") {
    try {
      const parsedConfig = JSON.parse(config);
      obj.data.dialogConfig = parsedConfig;
    } catch (e) {
      devSandoError(
        btn,
        "Sando: System Dialog",
        `JSON Dialog Config is malformed.`
      );
      SAMMI.setVariable(saveVar, undefined, btn, instanceId);
      return;
    }
  }

  //relay recieves data as string from bridge
  obj.data = JSON.stringify(obj.data);

  console.log("sending a custom dialog, heres the data: ", obj);
  window.wsRelay.send(JSON.stringify(obj));
}

function sandoWsRelay(msg, target, button) {
  if (target === "") {
    SAMMI.alert("[Sando] You need to provide a Target Client ID!");
    return;
  }

  if (target === "sammi-bridge") {
    SAMMI.alert(
      '[Sando] Sending to bridge? Use "Send JSON To Extension" instead and set up listeners in your extension code!'
    );
    return;
  }
  const obj = {
    target_client_id: target,
    data: msg,
  };
  console.log("relaying to clients, data:", obj);
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
