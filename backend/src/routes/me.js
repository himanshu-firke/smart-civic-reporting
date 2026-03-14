const express = require("express");

const { authMiddleware } = require("../middleware/auth");

const meRouter = express.Router();

meRouter.get("/", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { meRouter };
