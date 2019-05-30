const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const userSavedSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  title: { type: String },
  date: { type: String },
  ambientMode: { type: Boolean },
  gameDifficulty: { type: String },
  currentSeason: { type: String },
  currentYear: { type: String },
  highestRedFlowerPct: { type: String },
  saved_id: { type: String },
  size: { type: String }
})

const userWinnerSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  avatar: { type: Object, required: true },
  username: { type: String, required: true },
  difficulty: { type: String, required: true },
  date: { type: String, required: true },
  years: { type: String, required: true },
  winner_id: { type: String, required: true  },
})

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 }, //NOTE maxlength message is hardcoded in userController.
  email: { type: String, required: true, unique: true, maxlength: 127 }, 
  password: { type: String, required: true, minlength: 6, maxlength: 127 },
  created_at: { type: Date, default: Date.now },
  avatar: { type: Object, default: {
    colors: {
      pistil: "#E0993E",
      petal: "#0E7FD9"
    }
  }},
  saved: [userSavedSchema],
  scores: [userWinnerSchema]
})

userSchema.methods = {
	checkPassword: function (inputPassword) {
    console.log(' * * * checkPassword')
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: plainTextPassword => {
    console.log(' - - - hashPassword')
		return bcrypt.hashSync(plainTextPassword, 10)
	}
}

userSchema.pre('save', function (next) {
  this.password = this.hashPassword(this.password)
  next()
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)
module.exports = User
