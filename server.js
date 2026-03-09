require("module-alias/register");
require("dotenv").config();

const cors = require("cors");
const express = require("express");

const errorHandle = require("@/middlewares/errorHandle");
const responseMiddleware = require("@/middlewares/response");
const routes = require("@/routes");
const pusher = require("@/libs/pusher");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(responseMiddleware);

app.use("/api", routes);

// Tạo route test tạm thời
app.get("/test-broadcast", async (req, res) => {
  await pusher.trigger("conversation-41", "created", {
    id: 999,
    content: "test message",
    senderId: 1,
  });
  res.json({ ok: true });
});

app.use(errorHandle);

app.listen(port, () => {
  console.log(`Demo app listening on port ${port}`);
});
