const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  saved_games: { type: Array, default: []}, 
  created_at: { type: Date, default: Date.now },
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
