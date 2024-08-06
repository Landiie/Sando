const fs = require("fs");
const utils = require('../util');
const process = require("process");


const jsonFilePath = process.argv[2];
const targetScene = process.argv[3];
const denyList = process.argv[4].split('|SP|');
const outputFile = process.argv[5];

// Specify the path to your JSON file
// const jsonFilePath = "source_clone_reference_test.json";
// const targetScene = "SceneToPackage";
// const outputFile = "referencetest.txt"

// const jsonFilePath = "L20Gacha.json";
// const targetScene = "compiled";
// const outputFile = "test.txt"

// const jsonFilePath = "LandiTube_0200.json";
// const targetScene = "[LandiTube]";
// const outputFile = "testlanditube.txt"

let parsedScenes = [];
let parsedEmptyScenesCount = 0; //this is a bit silly but it helps let sammi know when scenes are done installing
// let targetSceneParsed = false;
let createdItems = [];
let parsedSceneItemCount = 0;

// process.exit();

const collection = loadJSON(jsonFilePath);
const sceneItems = getSceneItems(collection, targetScene, "vanilla");
const initialFilters = getInitialSceneFilters(collection, targetScene);
const compiled = {
  sceneItems: sceneItems,
  targetScene: targetScene,
  targetSceneFilters: initialFilters,
  parsedSceneItemCount: parsedSceneItemCount,
  parsedScenesCount: parsedScenes.length,
  parsedEmptyScenesCount: parsedEmptyScenesCount
};

console.log(compiled);

fs.writeFileSync(outputFile, JSON.stringify(compiled), "utf-8");

// console.log(sceneItems[1].sceneItems);
// console.log(JSON.stringify(sceneItems))

// postToSAMMI(9451, sceneItems);
// console.log(JSON.stringify(sceneItems));

//? functions
function getInitialSceneFilters(collection, targetScene) {
  let data = null;
  collection.sources.forEach(source => {
    if (source.name === targetScene) {
      data = parseFilters(source.filters, "init");
    }
  });
  if (data) {
    return data;
  } else {
    return [];
  }
}

function getSceneItems(collection, targetScene, nestingType) {
  // let pushEndKeyword = false;
  // if (!targetSceneParsed) {
  //   pushEndKeyword = true;
  //   targetSceneParsed = true;
  // }

  let sceneItems = [];

  //check to see if targetScene is already parsed or not
  let sceneParsed = false;

  for (i = 0; i < parsedScenes.length; i++) {
    const name = parsedScenes[i];
    if (name === targetScene) {
      sceneParsed = true;
      break;
    }
  }

  if (sceneParsed) return "already parsed";

  //check to see if targetscene is actually a loaded scene
  let sceneFound = false;

  for (i = 0; i < collection.scene_order.length; i++) {
    const name = collection.scene_order[i].name;
    if (name === targetScene) {
      sceneFound = true;
      break;
    }
  }

  if (!sceneFound) return "not a scene";

  collection.sources.forEach(source => {
    if (source.name === targetScene) {
      //target scene found
      
      //if there are no scene items, add to blank parsed scenes
      if (source.settings.items.length === 0) parsedEmptyScenesCount++

      //create array of objects with source name and their settings
      source.settings.items.forEach(item => {
        
        if (denyList.includes(item.name)) return;

        parsedSceneItemCount++;
        let obj = {};
        const itemName = item.name;

        obj.name = itemName;

        //goes back to collection of all sources (holds scenes and inputs i guess) and try to find the item name
        collection.sources.forEach(source => {
          if (source.name === itemName) {
            //* identify if scene or not. if not scene, input settings
            if (source.versioned_id !== "scene") {
              obj.settings = JSON.stringify(source.settings);
              //check to see if source clone aswell
              if (source.versioned_id === "source-clone") {
                obj.sceneItems = getSceneItems(
                  collection,
                  source.settings.clone,
                  "clone"
                );
                obj.sceneName = source.settings.clone;

                // checks to see if the scene name has any filters
                // gotta find it in collection first
                for (i = 0; i < collection.sources.length; i++) {
                  const collectionSourceName = collection.sources[i].name;
                  if (collectionSourceName === source.settings.clone) {
                    //found the scene name, parse it's filters, save
                    const sourceFilters = collection.sources[i].filters;
                    obj.cloneSceneFilters = parseFilters(sourceFilters);
                  }
                }
              }
              // check to see if this item has already been created. if so, this is a reference. set to non-standard input in sammi
              let itemCreated = false;
              for (i = 0; i < createdItems.length; i++) {
                const name = createdItems[i];
                if (name === source.name) {
                  itemCreated = true;
                  break;
                }
              }
              obj.isReference = itemCreated;
              if (!itemCreated) createdItems.push(source.name);
            } else {
              //vanilla nested scene
              obj.settings = null;
              obj.sceneItems = getSceneItems(
                collection,
                source.name,
                "vanilla"
              );
              obj.sceneName = source.name;
            }

            //* filters
            obj.filters = parseFilters(source.filters);

            //* scene item transformations

            //translate bounds type number to websocket string
            let boundsType;
            switch (item.bounds_type) {
              case 0:
                boundsType = "OBS_BOUNDS_NONE";
                break;
              case 1:
                boundsType = "OBS_BOUNDS_STRETCH";
                break;
              case 2:
                boundsType = "OBS_BOUNDS_SCALE_INNER";
                break;
              case 3:
                boundsType = "OBS_BOUNDS_SCALE_OUTER";
                break;
              case 4:
                boundsType = "OBS_BOUNDS_SCALE_TO_WIDTH";
                break;
              case 5:
                boundsType = "OBS_BOUNDS_SCALE_TO_HEIGHT";
                break;
              case 6:
                boundsType = "OBS_BOUNDS_MAX_ONLY";
                break;

              default:
                console.log(`Bounds type ${item.bounds_type} unknown!`);
                boundsType = "UNKNOWN";
                break;
            }

            //* scene item blend type

            //translate blend type number to websocket string
            let blendType;
            switch (item.blend_type) {
              case "normal":
                blendType = "OBS_BLEND_NORMAL";
                break;
              case "additive":
                blendType = "OBS_BLEND_ADDITIVE";
                break;
              case "subtract":
                blendType = "OBS_BLEND_SUBTRACT";
                break;
              case "screen":
                blendType = "OBS_BLEND_SCREEN";
                break;
              case "multiply":
                blendType = "OBS_BLEND_MULTIPLY";
                break;
              case "lighten":
                blendType = "OBS_BLEND_LIGHTEN";
                break;
              case "darken":
                blendType = "OBS_BLEND_DARKEN";
                break;

              default:
                console.log(`Blend type ${item.blend_type} unknown!`);
                blendType = "UNKNOWN";
                break;
            }

            //* input monitor type

            //translate monitor type number to websocket string
            let monitorType;
            switch (source.monitoring_type) {
              case 0:
                monitorType = "OBS_MONITORING_TYPE_NONE";
                break;
              case 1:
                monitorType = "OBS_MONITORING_TYPE_MONITOR_ONLY";
                break;
              case 2:
                monitorType = "OBS_MONITORING_TYPE_MONITOR_AND_OUTPUT";
                break;

              default:
                console.log(`Monitor type ${source.monitoring_type} unknown!`);
                monitorType = "UNKNOWN";
                break;
            }

            //* bounds dimensions fix
            //for some reason websocket wants bounds to be 1 or higher? ok.
            if (item.bounds.x === 0) item.bounds.x = 1;
            if (item.bounds.y === 0) item.bounds.y = 1;

            obj.transformations = {
              alignment: item.align,
              boundsAlignment: item.bounds_align,
              boundsHeight: item.bounds.y,
              boundsType: boundsType,
              boundsWidth: item.bounds.x,
              rotation: item.rot,
              positionX: item.pos.x,
              positionY: item.pos.y,
              scaleX: item.scale.x,
              scaleY: item.scale.y,
              cropBottom: item.crop_bottom,
              cropTop: item.crop_top,
              cropLeft: item.crop_left,
              cropRight: item.crop_right,
            };
            obj.blendType = blendType;
            obj.monitorType = monitorType;
            obj.type = source.versioned_id;
            obj.visibility = `${item.visible}`;
            obj.locked = `${item.locked}`;
            obj.volume = source.volume;
          }
        });
        sceneItems.push(obj);
      });
    }
  });
  parsedScenes.push(targetScene); //so a scene doesn't infinitely parse

  // if (pushEndKeyword) {
  //   sceneItems.push({
  //     end: true,
  //   });
  // }

  return sceneItems;
}

function parseFilters(filterList, origin) {
  let filters = [];
  if (filterList)
    filterList.forEach(filter => {
      let filterObj = {
        type: filter.versioned_id,
        name: filter.name,
        visibility: `${filter.enabled}`, //converts bool to string, maintains the bool in sammi (stupid i know)
        settings: JSON.stringify(filter.settings),
      };

      filters.push(filterObj);
    });

  // if (origin) {
  //   console.log(filters);
  // }
  return filters;
}

function loadJSON(path) {
  const jsonRaw = fs.readFileSync(path, "utf8");
  const jsonObject = JSON.parse(jsonRaw);
  return jsonObject;
}
