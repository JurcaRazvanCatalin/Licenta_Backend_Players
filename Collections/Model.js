const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  playerName: {
    type: String,
  },
  playerNameSmall: {
    type: String,
  },
  teamName: {
    type: String,
  },
  playerImg: {
    type: String,
  },
  playerCountry: {
    type: String,
  },
  position: {
    type: String,
  },
  birthday: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  number: {
    type: Number,
  },
  pts_per_game: {
    type: Number,
  },
  reb_per_game: { type: Number },
  ass_per_game: { type: Number },
  stats: {
    year: {
      type: String,
    },
    matchPlayed: {
      type: Number,
    },
    two_fgm: {
      type: Number,
    },
    two_fga: { type: Number },
    two_fgp: { type: Number },
    three_fgm: { type: Number },
    three_fga: { type: Number },
    three_fgp: { type: Number },
    fta: { type: Number },
    ftm: { type: Number },
    ftp: { type: Number },
    reb: { type: Number },
    ass: { type: Number },
    pts: { type: Number },
    blocks: { type: Number },
  },
});

module.exports = mongoose.model("players", playerSchema);
