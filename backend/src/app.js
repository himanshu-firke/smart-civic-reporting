const express = require("express");
const cors = require("cors");

const { authRouter } = require("./routes/auth");
const { healthRouter } = require("./routes/health");
const { meRouter } = require("./routes/me");
const { adminRouter } = require("./routes/admin");
const { departmentsRouter } = require("./routes/departments");
const { deptAdminRouter } = require("./routes/deptAdmin");
const { issuesRouter } = require("./routes/issues");
const { workerRouter } = require("./routes/worker");
const { citizenRouter } = require("./routes/citizen");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || true,
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));

  app.use("/api/auth", authRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/me", meRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/departments", departmentsRouter);
  app.use("/api/dept-admin", deptAdminRouter);
  app.use("/api/issues", issuesRouter);
  app.use("/api/worker", workerRouter);
  app.use("/api/citizen", citizenRouter);

  return app;
}

module.exports = { createApp };
