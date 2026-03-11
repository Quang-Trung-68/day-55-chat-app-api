const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.SOKETI_APP_ID,
  key: process.env.SOKETI_APP_KEY,
  secret: process.env.SOKETI_APP_SECRET,
  cluster: process.env.SOKETI_CLUSTER || "",
  useTLS: process.env.SOKETI_USE_TLS === "true",
  host: process.env.SOKETI_HOST || "127.0.0.1",
  port: process.env.SOKETI_PORT || "6001",
});

module.exports = pusher;
