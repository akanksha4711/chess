const express = require("express");
const { leaderboard } = require("../controllers/leaderboard.controller");
const { verifyAuth } = require("../middlewares/verifyAuth");

const leaderboardRouter = express.Router();

leaderboardRouter.get("/", verifyAuth, leaderboard);

module.exports = { leaderboardRouter };
