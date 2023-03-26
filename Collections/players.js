const express = require("express");
const { StatusCodes } = require("http-status-codes");
const Player = require("./Model");
const playerRouter = express.Router();

const getAllPlayers = async (req, res) => {
  const { teamNameSmall } = req.query;
  const queryParams = {};
  if (teamNameSmall) {
    queryParams.teamNameSmall = teamNameSmall;
  }
  const players = await Player.find(queryParams);
  res.status(StatusCodes.OK).json({ players });
};

const getPlayer = async (req, res) => {
  const { playerNameSmall: playerNameSmall } = req.params;
  const task = await Player.findOne({ playerNameSmall: playerNameSmall });
  res.status(StatusCodes.OK).json({ task });
};

const deletePlayer = async (req, res) => {
  const { playerNameSmall: playerNameSmall } = req.params;
  const task = await Teams.findOneAndDelete({
    playerNameSmall: playerNameSmall,
  });
  res.send(StatusCodes.OK).json({ task });
};

playerRouter.route("/create-player").get(getAllPlayers);
playerRouter
  .route("/create-player/:playerNameSmall")
  .get(getPlayer)
  .delete(deletePlayer);

module.exports = playerRouter;
