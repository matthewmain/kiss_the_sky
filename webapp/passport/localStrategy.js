const User = require('../models/userModel')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username'
	},
	function(username, password, done) {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				console.log('user not found')
				return done(null, false, { message: 'Unknown username' })
			}
			if (!user.checkPassword(password)) {
				console.log('incorrect password')
				return done(null, false, { message: 'Incorrect password' })
			}
			console.log("success in strategy")
			return done(null, user, { message: 'Successful Log In' })
		})
	}
)

module.exports = strategy
