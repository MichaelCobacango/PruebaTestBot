const { saveMessageJson } = require("./jsonDb");
const stepsInitial = require("../flow/initial.json");
const stepsReponse = require("../flow/response.json");

const get = (message) =>
  new Promise((resolve, reject) => {
    if (process.env.DATABASE === "none") {
      const { key } = stepsInitial.find((k) =>
        k.keywords.includes(message)
      ) || { key: null };
      const response = key || null;
      resolve(response);
    }
  });

const reply = (step) =>
  new Promise((resolve, reject) => {
    if (process.env.DATABASE === "none") {
      let resData = { replyMessage: "", media: null, trigger: null };
      const responseFind = stepsReponse[step] || {};
      resData = {
        ...resData,
        ...responseFind,
        replyMessage: responseFind.replyMessage.join(""),
      };
      resolve(resData);
      return;
    }
  });

/**
 *
 * @param {*} message
 * @param {*} date
 * @param {*} trigger
 * @param {*} number
 * @returns
 */
const saveMessage = (message, trigger, number) =>
  new Promise(async (resolve, reject) => {
    switch (process.env.DATABASE) {
      case "none":
        resolve(await saveMessageJson(message, trigger, number));
        break;
      default:
        break;
    }
  });

module.exports = { get, reply, saveMessage };
