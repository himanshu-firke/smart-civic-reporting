const http = require("http");

require("dotenv").config();

const { createApp } = require("./app");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    process.stdout.write(`Backend listening on port ${PORT}\n`);
  });
}

start().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
