const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
  game_status: {
    type: String,
    enum: ["active", "done"],
    required: true
  },
  players: [String],
  deck_of_cards: {
    type: Array,
    required: true,
  },
  current_player: {
    type: String
  },
  game_end_status: [{
    player: {
      type: String,
      trim: true
    },
    score: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["win", "loss", "tie"]
    }
  }],
  remaining_players: [String],
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model("game", GameSchema)