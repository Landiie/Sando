const puppeteer = require("puppeteer");
const utils = require("../util.js");
const https = require("https");
const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const process = require("process");

const LINK_TEMPLATE = "https://obsproject.com/forum/resources/";

let results = {};

const plugins = JSON.parse(utils.b64ToString(process.argv[2]));

// const plugins = [
//   {
//   link: "https://obsproject.com/forum/resources/retro-effects.1972/download",
//   keywords: ["windows"],
//     denyKeywords: ["install"],
//   },
//   {
//   link: "https://obsproject.com/forum/resources/source-copy.1261/download",
//   keywords: ["windows"],
//     denyKeywords: ["install"],
//   },
//   {
//   link: "https://obsproject.com/forum/resources/markdown-source.1764/download",
//   keywords: ["windows"],
//     denyKeywords: ["install"],
//   },
//   {
//   link: "https://obsproject.com/forum/resources/move.913/download",
//   keywords: ["windows"],
//     denyKeywords: ["install"],
//   },
// ];

(async () => {
  prepare();

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const pluginName = getPluginName(plugin.link);
    const pluginObjKey = "plugin-" + pluginName;

    const downloadLink = await getDownloadLink(plugin);
    if (downloadLink === null) {
      results[pluginObjKey].status.code = 404;
      results[pluginObjKey].status.msg =
        "Could not find any download sections that matched filters!";
      continue;
    }

    const downloadResult = await downloadPlugin(downloadLink);

    if (typeof downloadResult !== "string") {
      results[pluginObjKey].status.code = 404;
      results[pluginObjKey].status.msg = "wa";
      continue;
    }

    const installResult = installPlugin(downloadResult);
    if (installResult === null) {
      results[pluginObjKey].status.code = 404;
      results[pluginObjKey].status.msg = "Could not install/extract plugin";
      continue;
    }
  }

  console.log(JSON.stringify(results));
})();

async function downloadPlugin(plugin) {
  return new Promise((resolve, reject) => {
    https
      .get(plugin, res => {
        let filename = "downloaded-file";

        // Check if the 'content-disposition' header is present
        const contentDisposition = res.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        const writeStream = fs.createWriteStream(
          path.join(__dirname, "downloaded_plugins", filename)
        );

        res.pipe(writeStream);

        writeStream.on("finish", () => {
          writeStream.close();
          resolve(filename);
        });

        writeStream.on("error", err => {
          console.log("writing failed");
          reject(err);
        });
      })
      .on("error", err => {
        console.log("downloading failed");
        reject(err);
      });
  });
}

async function installPlugin(zipName) {
  if (path.extname(zipName) !== ".zip") return null;
  const zipPath = path.join(__dirname, "downloaded_plugins", zipName);
  await extract(zipPath, {
    dir: path.join(__dirname, "testing_output"),
  });
  fs.unlinkSync(zipPath);
}

function prepare() {
  //check to see if downloaded_plugins dir exists
  if (!fs.existsSync("downloaded_plugins")) {
    fs.mkdirSync("downloaded_plugins");
  } else {
    removeFiles("downloaded_plugins");
  }

  plugins.forEach(plugin => {
    //check to see if link is valid

    const pos = plugin.link.indexOf(LINK_TEMPLATE);
    if (pos !== 0) {
      console.log(`ERR: Plugin link ${plugin.link} is not valid!`);
      process.exit(1);
    }
    //clamp out name for obj key
    const pluginName = getPluginName(plugin.link);
    const objKey = "plugin-" + pluginName;

    results[objKey] = {
      name: pluginName,
      link: plugin.link,
      status: {
        code: 200,
        msg: "installed successfully",
      },
    };
  });
}

function removeFiles(dirpath) {
  const files = fs.readdirSync(dirpath);
  files.forEach(file => {
    fs.unlinkSync(path.join(dirpath, file));
  });
}

function getPluginName(pluginLink) {
  const endPos = pluginLink.indexOf(".", LINK_TEMPLATE.length);
  const pluginName = pluginLink.substring(LINK_TEMPLATE.length, endPos);
  return pluginName;
}

async function getDownloadLink(pluginInfo) {
  const pluginName = getPluginName(pluginInfo.link);
  const pluginObjKey = "plugin-" + pluginName;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(pluginInfo.link);

  const pageResult = await page.evaluate(
    (keywords, denyKeywords) => {
      let foundSection = null;
      const downloadSections = document.querySelector(".block-body");

      for (let i = 0; i < downloadSections.children.length; i++) {
        const section = downloadSections.children[i];
        const downloadTitle = section
          .querySelector(".contentRow-title")
          .textContent.toLowerCase();

        let hasInvalidKeyword = false;
        let hasKeywords = false;
        let countKeywords = 0;

        denyKeywords.forEach(keyword => {
          if (downloadTitle.includes(keyword)) hasInvalidKeyword = true;
        });

        if (hasInvalidKeyword) continue;

        keywords.forEach(keyword => {
          if (downloadTitle.includes(keyword)) countKeywords++;
        });

        if (countKeywords !== keywords.length) continue;

        foundSection = section;
        break;
      }

      if (foundSection === null) return null;

      const foundLink = foundSection.querySelector(
        ".button--icon--download"
      ).href;
      return foundLink;
    },
    pluginInfo.keywords,
    pluginInfo.denyKeywords
  );
  browser.close();
  return pageResult;
}
