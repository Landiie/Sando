const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

const ASSETS_PATH = path.join(__dirname, "extension_asset_structure");
const OUT_FILE = path.join(__dirname, "ext_assets.zip");
const MANIFEST_PATH = path.join(__dirname, "ext_manifest.json")

main();

async function main() {
  await zipDirectory(ASSETS_PATH, OUT_FILE);
  const b64Assets = fs.readFileSync(OUT_FILE, "base64");
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  manifest.deck_config.extension_assets = b64Assets;
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest), "utf-8");
  console.log("done");
}

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", err => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}
