const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const sammiDir = path.join(__dirname, "..", "..", "..");
const extsDir = path.join(sammiDir, "bridge", "extensions", "installed");

// const extNameB64 = Buffer.from("LandiTube").toString("base64"); //to be fetched from params, is b64
const extNameB64 = argv[2];
// const extName = Buffer.from(extNameB64, "base64").toString("utf-8");
const extName = Buffer.from('U2FtbWkgQXVkaW8gUGxheWVy', "base64").toString("utf-8");

const extsDirExists = fs.existsSync(extsDir);
if (!extsDirExists) {
  console.log(
    "ERROR: extensions directory does not exist. Please install at least one extension."
  );
  process.exit(0);
}

const extensions = fs.readdirSync(extsDir);
let extPath = "";

for (let i = 0; i < extensions.length; i++) {
  const extension = extensions[i];
  const parsedExtName = pullExtName(path.join(extsDir, extension));
  if (parsedExtName === extName) {
    extPath = path.join(extsDir, extension);
    break;
  }
}

if (extPath === "") {
  console.log(`ERROR: No extension was found with the name "${extName}"`);
  process.exit(0);
}

const extOverData = pullExtOver(extPath);

if (extOverData === null) {
  console.log(
    `ERROR: Was unable to extract [insert_over] data. Is it a proper JSON string that can be parsed?`
  );
  process.exit(0);
}

if (extOverData.extension_assets === undefined) {
  console.log("ERROR: No ass");
  process.exit(0);
}

const assetBufferData = Buffer.from(extOverData.extension_assets, "base64");

if (!isZip(assetBufferData)) {
  console.log("ERROR: Assets bundled are not .zip format! aborting...");
  process.exit(0);
}
fs.writeFileSync(
  path.join(sammiDir, "assets.zip"),
  extOverData.extension_assets,
  {
    encoding: "base64",
  }
);

console.log("done");

function isZip(bufferData) {
  const zipMagicNumber = [0x50, 0x4b, 0x03, 0x04];
  for (let i = 0; i < 4; i++) {
    if (zipMagicNumber[i] !== bufferData[i]) return false;
  }
  return true;
}
function pullExtOver(extPath) {
  const contents = fs.readFileSync(extPath, "utf-8");
  const contentFrags = contents.split("\n");
  let overData;
  try {
    overData = JSON.parse(contentFrags[contentFrags.length - 1]);
  } catch {
    return null;
  }
  return overData;
}

function pullExtName(extPath) {
  const contents = fs.readFileSync(extPath, "utf-8");

  const target = "[extension_name]\n";
  let extNamePos = contents.indexOf(target, 0);
  extNamePos += target.length;
  extNamePos += 2;
  const extNamePosEnd = contents.indexOf("\n", extNamePos);

  const extName = contents
    .substring(extNamePos, extNamePosEnd)
    .replace(/^\s+|\s+$/g, "");

  return extName;
}
