const mongoose = require("mongoose")
const Schema = mongoose.Schema

const winnerSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  avatar: { type: Object, required: true },
  username: { type: String, required: true },
  difficulty: { type: String, required: true },
  date: { type: String, required: true },
  years: { type: mongoose.Decimal128, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Winner',
    required: true,
  }
})

const Winner = mongoose.model("Winner", winnerSchema)

module.exports = Winner
