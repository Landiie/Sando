const fs = require("fs");
const { execSync } = require("child_process");
const crypto = require('crypto');

module.exports = {
  packageCheck: function () {
    // Check if the node_modules folder exists
    // console.log("checking packages..");
    if (!fs.existsSync("./node_modules")) {
      console.log("no dependancies, installing..?");
      console.log("Installing dependencies...");
      const installCommand = "npm install";

      const childProcess = execSync(installCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error}`);
        } else {
          console.log("Done, executing...");
        }
      });
    }
  },
  calculateHash: function (filePath, hashType) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(hashType); // You can use other algorithms like md5, sha1, sha256, etc.
      const input = fs.createReadStream(filePath);

      input.on("error", err => {
        reject(err);
      });

      hash.setEncoding("hex");

      input.pipe(hash).on("finish", () => {
        hash.end();
        const fileHash = hash.read();
        resolve(fileHash);
      });
    });
  },
  calculateHashString: function (string, hashType) {
    return hash = crypto.createHash(hashType).update(string).digest("hex")
  },
  stringToBool: function (string) {
    return string.toLowerCase() == "true" ? true : false
  },
  b64ToString: function (b64) {
    return Buffer.from(b64, "base64").toString("utf-8")
  }
};
