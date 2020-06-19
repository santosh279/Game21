const mongoose = require("mongoose")

const LiveGameSchema = new mongoose.Schema({
  game_uid: {
    type: String,
    required: true,
    trim: true
  },
  game_details: [
    {
      player_name: {
        type: String,
        required: true
      },
      cardsOnHand: {
        type: Array,
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      player_status: {
        type: String,
        enum: ["bust", "active", "blackjack", "stand", "win", "loss"]
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("livegame", LiveGameSchema);

