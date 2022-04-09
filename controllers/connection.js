const connectionReady = (cb = () => {}) => {
  console.log("Ready to listen to messages");
  console.log("Client is ready!");
  cb();
};

const connectionLost = (cb = () => {}) => {
  console.log(
    "** Authentication error generates the QRCODE again (Delete the session.json file) **"
  );
  cb();
};

module.exports = {
  connectionReady,
  connectionLost,
};
