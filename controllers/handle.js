const { Client, LegacySessionAuth, LocalAuth } = require("whatsapp-web.js");
const http = require("http");
const https = require("https");
const fs = require("fs");
const qr = require("qr-image");

const MULTI_DEVICE = process.env.MULTI_DEVICE || "false";

const cleanNumber = (number) => {
  number = number.replace("@c.us", "");
  number = `${number}@c.us`;
  return number;
};

const saveExternalFile = (url) =>
  new Promise((resolve, reject) => {
    const ext = url.split(".").pop();
    const checkProtocol = url.split("/").includes("https:");
    const handleHttp = checkProtocol ? https : http;
    const name = `${Date.now()}.${ext}`;
    const file = fs.createWriteStream(`${__dirname}/../mediaSend/${name}`);
    console.log(url);
    handleHttp.get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close();
        resolve(name);
      });
      file.on("error", function () {
        console.log("errro");
        file.close();
        resolve(null);
      });
    });
  });

const checkIsUrl = (path) => {
  try {
    regex =
      /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;
    match = path.match(regex);
    return match[0];
  } catch (e) {
    return null;
  }
};

const generateImage = (base64, cb = () => {}) => {
  let qr_svg = qr.image(base64, {
    type: "svg",
    margin: 4,
  });
  qr_svg.pipe(require("fs").createWriteStream("./mediaSend/qr-code.svg"));
  console.log(`⚡ Remember that the QR is updated every minute ⚡'`);
  console.log(`⚡ Update F5 the browser to keep the best QR⚡`);
  cb();
};

const checkEnvFile = () => {
  const pathEnv = `${__dirname}/../.env`;
  const isExist = fs.existsSync(pathEnv);
  if (!isExist) {
    console.log(`missing env file`);
  }
};

/**
 *
 * @param {*} session
 * @param {*} cb
 */
const createClient = (session = {}, login = false) => {
  console.log(
    `Mode: ${MULTI_DEVICE === "false" ? "No Multi-device" : "Si Multi-device"} `
  );
  const objectLegacy = login
    ? {
        authStrategy: new LegacySessionAuth({ session }),
      }
    : {
        session,
      };

  if (MULTI_DEVICE == "false") {
    return {
      ...objectLegacy,
      restartOnAuthFail: true,
      puppeteer: {
        args: ["--no-sandbox"],
      },
    };
  } else {
    return {
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
      clientId: "client-one",
    };
  }
};

module.exports = {
  cleanNumber,
  saveExternalFile,
  generateImage,
  checkIsUrl,
  checkEnvFile,
  createClient,
};
