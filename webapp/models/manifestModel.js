const mongoose = require("mongoose")
const Schema = mongoose.Schema

const manifestSchema = new Schema({
  name: { type: String, default: "manifest" },
  created_at: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
})

const Manifest = mongoose.model("Manifest", manifestSchema)

module.exports = Manifest
