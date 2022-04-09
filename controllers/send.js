const ExcelJS = require("exceljs");
const moment = require("moment");
const fs = require("fs");
const { MessageMedia, Buttons } = require("whatsapp-web.js");
const { cleanNumber } = require("./handle");
const DELAY_TIME = 170; // ms
const DIR_MEDIA = `${__dirname}/../mediaSend`;
const { saveMessage } = require("../adapter/app");
/**
 * Enviamos archivos multimedia a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media, { sendAudioAsVoice: true });
  }
};

/**
 * Enviamos archivos multimedia 1 a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia1 = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media1 = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media1, { sendAudioAsVoice: true });
  }
};
/**
 * Enviamos archivos multimedia 2 a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia2 = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media2 = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media2, { sendAudioAsVoice: true });
  }
};
/**
 * Enviamos archivos multimedia 3 a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia3 = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media3 = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media3, { sendAudioAsVoice: true });
  }
};
/**
 * Enviamos archivos multimedia 4 a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia4 = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media4 = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media4, { sendAudioAsVoice: true });
  }
};
/**
 * Enviamos archivos multimedia 5 a nuestro cliente
 * @param {*} number
 * @param {*} fileName
 */

const sendMedia5 = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media5 = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media5, { sendAudioAsVoice: true });
  }
};
/**
 * Enviamos archivos como notas de voz
 * @param {*} number
 * @param {*} fileName
 */

const sendMediaVoiceNote = (client, number, fileName) => {
  number = cleanNumber(number);
  const file = `${DIR_MEDIA}/${fileName}`;
  if (fs.existsSync(file)) {
    const media = MessageMedia.fromFilePath(file);
    client.sendMessage(number, media, { sendAudioAsVoice: true });
  }
};

/**
 * Enviamos un mensaje simple (texto) a nuestro cliente
 * @param {*} number
 */
const sendMessage = async (
  client,
  number = null,
  text = null,
  trigger = null
) => {
  setTimeout(async () => {
    number = cleanNumber(number);
    const message = text;
    client.sendMessage(number, message);
    await readChat(number, message, trigger);
    console.log(`⚡ Sending Message....`);
  }, DELAY_TIME);
};

/**
 * Enviamos un mensaje con buttons a nuestro cliente
 * @param {*} number
 */
const sendMessageButton = async (
  client,
  number = null,
  text = null,
  actionButtons
) => {
  number = cleanNumber(number);
  const {
    title = null,
    message = null,
    footer = null,
    buttons = [],
  } = actionButtons;
  let button = new Buttons(message, [...buttons], title, footer);
  client.sendMessage(number, button);

  console.log(`⚡ Sending Message....`);
};

/**
 * Opte
 */
const lastTrigger = (number) =>
  new Promise((resolve, reject) => {
    number = cleanNumber(number);
    const pathExcel = `${__dirname}/../chats/${number}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    if (fs.existsSync(pathExcel)) {
      workbook.xlsx.readFile(pathExcel).then(() => {
        const worksheet = workbook.getWorksheet(1);
        const lastRow = worksheet.lastRow;
        const getRowPrevStep = worksheet.getRow(lastRow.number);
        const lastStep = getRowPrevStep.getCell("C").value;
        resolve(lastStep);
      });
    } else {
      resolve(null);
    }
  });

/**
 * Guardar historial de conversacion
 * @param {*} number
 * @param {*} message
 */
const readChat = async (number, message, trigger = null) => {
  number = cleanNumber(number);
  await saveMessage(message, trigger, number);
  console.log("Saved");
};

module.exports = {
  sendMessage,
  sendMedia,
  lastTrigger,
  sendMessageButton,
  readChat,
  sendMediaVoiceNote,
  sendMedia1,
  sendMedia2,
  sendMedia3,
  sendMedia4,
  sendMedia5,
};
