const mongoose = require("mongoose")
const Schema = mongoose.Schema

const savedSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  manifest: { type: Object, default: {} },
  game: { type: String, default: "{}" },
  username: { type: String, default: "unknown user" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Saved = mongoose.model("Saved", savedSchema)

module.exports = Saved
