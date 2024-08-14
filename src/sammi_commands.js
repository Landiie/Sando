SAMMI.extCommand(
  "Sando: Read Folder",
  4467268,
  52,
  {
    var: ["Save Array Variable", 14, "", null, null],
    type: ["Read Type", 19, "", null, ["Files", "Folders"]],
    filter: ["Extension Type (optional)", 14, ".", null, null],
    path: ["Path to Read", 14, "", null, null],
    sort: [
      "Sort By...",
      19,
      "Default",
      null,
      [
        "Default",
        "Date (Newest)",
        "Date (Oldest)",
        "Size (Smallest)",
        "Size (Largest)",
      ],
    ],
  },
  true
);
SAMMI.extCommand(
  "Sando: Extract Zip",
  4467268,
  52,
  {
    status_variable: ["Status Variable", 14, "", null, null],
    zip: ["Zip File", 22, "", null, null],
    delete_zip: ["Delete", 2, false, 0.3, null],
    admin: ["Admin", 2, false, 0.3, null],
    destination: ["Destination Path", 14, "", 2.4, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: Get Process Path",
  4467268,
  52,
  {
    save_variable: ["Status Variable", 14, "", 0.6, null],
    process_name: ["Process Name", 14, "", 1.4, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: Powershell",
  4467268,
  80,
  {
    script: ["Script", 0, "", 2, null],
    no_output: ["No Output?", 2, false, 0.4, null],
    save_variable: ["Save Variable As", 14, "", 0.6, null],
  },
  true
);
SAMMI.extCommand("Sando: Log", 16435448, 52, {
  section: ["Section", 14, "/$s_sec$/", 0.4, null],
  severity: ["Severity", 19, "INFO", 0.3, ["INFO", "WARN", "CRIT", "FUCK"]],
  text: ["Text", 14, "", 2.9, null],
  log_path: ["Log Path", 14, "/$s_logp$/", 0.4, null],
});
SAMMI.extCommand("Sando: Compare Extension Versions", 4467268, 80, {
  exts_array: ["Stringified Array of Objects", 0, "", null, null],
  save_variable: ["Save Array Variable", 14, "", null, null],
});
SAMMI.extCommand("Sando: Compare OBS Plugin Versions", 4467268, 80, {
  obs_path: ["obs64.exe Path", 22, "", 0.5, null],
  plugins_array: ["Stringified Array of Objects", 0, "", 1.8, null],
  save_variable: ["Save Array Variable", 14, "", 0.7, null],
});
SAMMI.extCommand("Sando: Compare Bridge Versions", 4467268, 52, {
  save_variable: ["Save Variable", 14, "", 0.7, null],
  required_version: ["Required Bridge Version", 14, "", 0.7, null],
});
SAMMI.extCommand(
  "Sando: Set Deck Buttons Variables",
  4467268,
  52,
  {
    status_variable: ["Status Variable", 14, "", 0.5, null],
    deck_name: ["Deck Name", 14, "", 0.5, null],
    variables_object: ["Variables Object (JSON)", 0, "", 2, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: OBS Find Scene",
  4467268,
  52,
  {
    obs_name: ["OBS", 32, null, 0.5, null],
    save_variable: ["Save Variable", 14, "", 0.5, null],
    scene_name_target: ["Scene Name", 4, "", 0.5, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: Percentage Map",
  4467268,
  52,
  {
    var: ["Save Variable", 14, "", null, null],
    percent: ["Percent", 15, "", null, null],
    min_percent: ["Minimum Percent", 15, "", null, null],
    max_percent: ["Max Percent", 15, "", null, null],
    min_value: ["Minimum Value", 15, "", null, null],
    max_value: ["Max Value", 15, "", null, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: File Watch/Tail",
  4467268,
  52,
  {
    ext_trigger: ["Extension Trigger", 14, "", null, null],
    path: ["File Path", 22, "", null, null],
    list_type: [
      "List Type (if needed)",
      19,
      "Whitelist",
      null,
      ["Whitelist", "Blacklist"],
    ],
    list: ["Stringified Array of Matches", 15, "", null, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: Scene Packer",
  7873596,
  52,
  {
    mode: [
      "Mode",
      25,
      "Choose Mode...",
      null,
      ["Sando: SP Unpack", "Sando: SP Pack"],
    ],
  },
  true
);
SAMMI.extCommand(
  "Sando: SP Unpack",
  7873596,
  52,
  {
    mode: [
      "Mode",
      25,
      "Sando: SP Unpack",
      null,
      ["Sando: SP Unpack", "Sando: SP Pack"],
    ],
    spkg: [".spkg Path", 22, "", null, null],
    status: ["Save Status Variable", 14, "", null, null],
  },
  true,
  true
);
SAMMI.extCommand(
  "Sando: SP Pack",
  7873596,
  52,
  {
    mode: [
      "Mode",
      25,
      "Sando: SP Pack",
      null,
      ["Sando: SP Unpack", "Sando: SP Pack"],
    ],
    json: ["Scene Collection File", 22, "", null, null],
    scene: ["Target Scene", 4, "", null, null],
    denyList: ["Blocked Scenes", 14, "", null, null],
    savePath: ["Save Path", 14, "", null, null],
    status: ["Save Status Variable", 14, "", null, null],
  },
  true,
  true
);
SAMMI.extCommand("Sando: Array Search", 7873596, 52, {
  mode: ["Mode", 25, "Choose Mode...", null, ["Sando: Array Search (Simple)"]],
});
SAMMI.extCommand(
  "Sando: Array Search (Simple)",
  7873596,
  52,
  {
    mode: [
      "Mode",
      25,
      "Sando: Array Search (Simple)",
      null,
      ["Sando: Array Search (Simple)"],
    ],
    arr: ["Array Name", 14, "", null, null],
    search: ["Value to Search", 14, "", null, null],
    var: ["Save Results Variable", 14, "", null, null],
  },
  false,
  true
);
SAMMI.extCommand("Sando: Websocket Relay Message", 4467268, 80, {
  msg: ["Message", 14, "", null, null],
  target: ["Target", 14, "", null, null],
});
SAMMI.extCommand(
  "Sando: Extract .sef Assets",
  4467268,
  80,
  {
    extName: ["Extension Name", 14, "", null, null],
    var: ["Status Variable", 14, "", null, null],
  },
  true
);
SAMMI.extCommand(
  "Sando: Extract .sef Assets (No Node)",
  4467268,
  80,
  {
    extName: ["Extension Name", 14, "", null, null],
    var: ["Status Variable", 14, "", null, null],
  },
  true,
  true
);
// SAMMI.extCommand('Sando: Install OBS Plugins', 4467268, 80, {
//     arr: ['Plugins (JSON)', 0, '', 1.3, null],
//     path: ['obs64.exe Path', 14, '', 1, null],
//     var: ['Save Results Array Variable', 14, '', 0.7, null]
//   }, true);
SAMMI.extCommand(
  "Sando: Twitch Get User Info (Cached)",
  4467268,
  80,
  {
    user_id: ["User ID", 15, "", null, null],
    var: ["Save Variable", 14, "", null, null],
  },
  true
);
// SAMMI.extCommand('Sando: Semver', 4467268, 52, {
//     mode: ['Mode', 25, 'Choose Mode...', null, ['Sando: Semver Compare']]
// });
// SAMMI.extCommand('Sando: Semver Compare', 4467268, 52, {
//     mode: ['Mode', 25, 'Sando: Semver Compare', null, ['Sando: Semver Compare']],
//     var: ['Save Variable', 14, '', null, null]
//     source: ['Source', 14, '', null, null],
//     comp: ['Compare', 8, '>=', null, null],
//     target: ['Target', 14, '', null, null]
// });
const sandoCwPresets = ["Sando: CW Dropdown", "Sando: CW Custom"];

SAMMI.extCommand(
  "Sando: Custom Window",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Choose Option...", null, sandoCwPresets],
  },
  true
);
SAMMI.extCommand(
  "Sando: CW Custom",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: CW Custom", null, sandoCwPresets],
    html: ["HTML File", 22, "", null, null],
    config: ["Window Config (JSON)", 0, "", null, null],
    payload: ["Custom Payload (JSON)", 0, "", null, null],
    var: ["Save Status Variable", 14, "", null, null],
  },
  false,
  true
);
SAMMI.extCommand(
  "Sando: CW Dropdown",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: CW Dropdown", null, sandoCwPresets],
    header: ["Header", 14, "", null, null],
    caption: ["Caption", 14, "", null, null],
    arr: ["Array Name", 14, "", null, null],
    var: ["Save Status Variable", 14, "", null, null],
  },
  false,
  true
);

const sandoSdPresets = [
  "Sando: SD Choice",
  "Sando: SD Open",
  "Sando: SD Save",
  "Sando: SD Custom",
];

SAMMI.extCommand(
  "Sando: System Dialog",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Choose Option...", null, sandoSdPresets],
  },
  true
);
SAMMI.extCommand(
  "Sando: SD Custom",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: SD Custom", null, sandoSdPresets],
    config: ["Dialog Config (JSON)", 0, "{ }", null, null],
    var: ["Save Result Variable", 14, "", null, null],
  },
  false,
  true
);
SAMMI.extCommand(
  "Sando: SD Choice",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: SD Choice", null, sandoSdPresets],
    type: ["Type", 19, "None", null, ["None", "Info", "Warning", "Error"]],
    title: ["Title", 14, "", null, null],
    message: ["Message", 14, "", null, null],
    detail: ["Details", 14, "", null, null],
    defaultYes: ["Default: Yes", 2, true, null, null],
    var: ["Save Result Variable", 14, "", null, null],
  },
  false,
  true
);

SAMMI.extCommand(
  "Sando: SD Open",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: SD Open", null, sandoSdPresets],
    title: ["Title", 14, "", null, null],
    path: ["Default Path", 14, "", null, null],
    label: ["Confirm Label", 14, "", null, null],
    filters: [
      "Filters (JSON)",
      0,
      '[\n    {\n        "name": "Images",\n        "extensions": ["png", "jpg", "gif"]\n    }\n]',
      null,
      null,
    ],
    properties: ["Properties Array", 14, "", null, null],
    var: ["Save Result Variable", 14, "", null, null],
  },
  false,
  true
);

SAMMI.extCommand(
  "Sando: SD Save",
  4467268,
  80,
  {
    mode: ["Mode", 25, "Sando: SD Save", null, sandoSdPresets],
    title: ["Title", 14, "", null, null],
    path: ["Default Path", 14, "", null, null],
    label: ["Confirm Label", 14, "", null, null],
    filters: [
      "Filters (JSON)",
      0,
      '[\n    {\n        "name": "Images",\n        "extensions": ["png", "jpg", "gif"]\n    }\n]',
      null,
      null,
    ],
    properties: ["Properties Array", 14, "", null, null],
    var: ["Save Result Variable", 14, "", null, null],
  },
  false,
  true
);
