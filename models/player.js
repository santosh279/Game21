const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  total_games: {
    type: Number,
    default: 0
  },
  total_wins: {
    type: Number,
    default: 0
  },
  total_loses: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  update_at: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("player", PlayerSchema)