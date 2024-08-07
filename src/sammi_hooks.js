case "Sando: Compare Extension Versions": {
    sandoCompareExtensionVersions(SAMMIJSON.exts_array, SAMMIJSON.save_variable, SAMMIJSON.FromButton);
} break
case "Sando: Compare OBS Plugin Versions": {
    sandoCompareObsPluginVersions(SAMMIJSON.obs_path, SAMMIJSON.plugins_array, SAMMIJSON.save_variable, SAMMIJSON.FromButton);
} break
case "Sando: Compare Bridge Versions": {
    sandoCompareBridgeVersions(SAMMIJSON.save_variable, SAMMIJSON.required_version, SAMMIJSON.FromButton);
} break
case "Sando: Log": {
    sandoLog(SAMMIJSON.section, SAMMIJSON.severity, SAMMIJSON.text, SAMMIJSON.log_path, SAMMIJSON.FromButton);
} break
case "Sando: Array Search (Simple)": {
    sandoArraySearchSimple(SAMMIJSON.mode, SAMMIJSON.arr, SAMMIJSON.search, SAMMIJSON.var, SAMMIJSON.FromButton);
} break
case "Sando: Array Search": {
    sandoArraySearch(SAMMIJSON.FromButton);
} break
case "Sando: Websocket Relay Message": {
    sandoWsRelay(SAMMIJSON.msg, SAMMIJSON.target, SAMMIJSON.FromButton);
} break
// case "Sando: Semver Compare": {
//     sandoSemverCompare(SAMMIJSON.mode, SAMMIJSON.var, SAMMIJSON.source, SAMMIJSON.comp, SAMMIJSON.target, SAMMIJSON.FromButton);
// } break
// case "Sando: Semver": {
//     sandoSemver(SAMMIJSON.FromButton);
// } break
case "Sando: CW Custom": {
    sandoCustomWindow(SAMMIJSON.html, SAMMIJSON.config, SAMMIJSON.payload, SAMMIJSON.var, SAMMIJSON.FromButton, SAMMIJSON.instanceId);
} break
case "Sando: CW Dropdown": {
    sandoCustomWindowDropdown(SAMMIJSON.header, SAMMIJSON.caption, SAMMIJSON.arr, SAMMIJSON.var, SAMMIJSON.FromButton, SAMMIJSON.instanceId);
} break