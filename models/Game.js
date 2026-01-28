import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  winner: String,
  losers: [
    {
      name: String,
      amount: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const gameSchema = new mongoose.Schema({
  gameName: String,
  players: [String],

  ledger: {
    type: Map,
    of: Map,
    default: {}
  },

  rounds: [roundSchema],

  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "ongoing" }
});

export default mongoose.model("Game", gameSchema);
