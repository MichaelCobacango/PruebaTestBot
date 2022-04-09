require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode-terminal");
const { Client, LegacySessionAuth, LocalAuth } = require("whatsapp-web.js");
const { middlewareClient } = require("./middleware/client");
const {
  generateImage,
  cleanNumber,
  checkEnvFile,
  createClient,
} = require("./controllers/handle");
const { connectionReady, connectionLost } = require("./controllers/connection");
const { saveMedia } = require("./controllers/save");
const {
  getMessages,
  responseMessages,
  bothResponse,
} = require("./controllers/flows");
const {
  sendMedia,
  sendMedia1,
  sendMedia2,
  sendMedia3,
  sendMedia4,
  sendMedia5,
  sendMessage,
  lastTrigger,
  sendMessageButton,
  readChat,
} = require("./controllers/send");
const app = express();
app.use(cors());
app.use(express.json());
const MULTI_DEVICE = process.env.MULTI_DEVICE || "false";
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});

let socketEvents = {
  sendQR: () => {},
  sendStatus: () => {},
};

io.on("connection", (socket) => {
  const CHANNEL = "main-channel";
  socket.join(CHANNEL);
  socketEvents = require("./controllers/socket")(socket);
  console.log("Se conecto");
});

app.use("/", require("./routes/web"));

const port = process.env.PORT || 3000;
const SESSION_FILE_PATH = "./session.json";
var client;
var sessionData;

const listenMessage = () =>
  client.on("message", async (msg) => {
    const { from, body, hasMedia } = msg;
    if (from === "status@broadcast") {
      return;
    }
    message = body.toLowerCase();
    console.log("BODY", message);
    const number = cleanNumber(from);
    await readChat(number, message);

    const step = await getMessages(message);

    if (step) {
      const response = await responseMessages(step);

      await sendMessage(client, from, response.replyMessage, response.trigger);
      if (response.hasOwnProperty("actions")) {
        const { actions } = response;
        await sendMessageButton(client, from, null, actions);
        return;
      }

      if (!response.delay && response.media) {
        sendMedia(client, from, response.media);
        sendMedia1(client, from, response.media1);
        sendMedia2(client, from, response.media2);
        sendMedia3(client, from, response.media3);
        sendMedia4(client, from, response.media4);
        sendMedia5(client, from, response.media5);
      }
      if (response.delay && response.media) {
        setTimeout(() => {
          sendMedia(client, from, response.media);
          sendMedia1(client, from, response.media1);
          sendMedia2(client, from, response.media2);
          sendMedia3(client, from, response.media3);
          sendMedia4(client, from, response.media4);
          sendMedia5(client, from, response.media5);
        }, response.delay);
      }
      return;
    }

    /*Message Default*/
    if (process.env.DEFAULT_MESSAGE === "true") {
      const response = await responseMessages("DEFAULT");
      await sendMessage(client, from, response.replyMessage, response.trigger);
      if (response.hasOwnProperty("actions")) {
        const { actions } = response;
        await sendMessageButton(client, from, null, actions);
      }
      return;
    }
  });

/**
 * Connection with session registered
 * This is function we are not scanner QR
 */
const withSession = () => {
  console.log(`Validating session with WhatsApp...`);
  sessionData = require(SESSION_FILE_PATH);
  client = new Client(createClient(sessionData, true));

  client.on("ready", () => {
    connectionReady();
    listenMessage();
    loadRoutes(client);
    socketEvents.sendStatus();
  });

  client.on("auth_failure", () => connectionLost());

  client.initialize();
};

/*Generate the code QR */
const withOutSession = () => {
  console.log("We do not have a saved session");
  client = new Client(createClient());

  client.on("qr", (qr) =>
    generateImage(qr, () => {
      qrcode.generate(qr, { small: true });
      console.log(`Ver QR http://localhost:${port}/qr`);
      socketEvents.sendQR(qr);
    })
  );

  client.on("ready", (a) => {
    connectionReady();
    listenMessage();
    loadRoutes(client);
  });

  client.on("authenticated", (session) => {
    sessionData = session;
    if (sessionData) {
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
          console.log(`An error occurred with the file: `, err);
        }
      });
    }
  });

  client.initialize();
};

/*Routes the Express */
const loadRoutes = (client) => {
  app.use("/api/", middlewareClient(client), require("./routes/api"));
};
/*Check the credenciales */
fs.existsSync(SESSION_FILE_PATH) && MULTI_DEVICE === "false"
  ? withSession()
  : withOutSession();

server.listen(port, () => {
  console.log(`The server in the port: ${port}`);
});
checkEnvFile();
