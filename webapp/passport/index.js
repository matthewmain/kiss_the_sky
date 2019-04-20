const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const User = require('../models/userModel')

passport.serializeUser((user, done) => { // called on login, saves the id to session req.session.passport.user = {id:'..'}
	console.log('\n > * > * > serializeUser called, user: ', user, "\n")
	done(null, { _id: user._id })
})

passport.deserializeUser((id, done) => { // user object attaches to the request as req.user
	console.log('< - < - < DeserializeUser called')
	User.findOne( { _id: id }, 'username',
		(err, user) => {
			console.log('\n *** Deserialize user, user:', user, "\n")
			done(null, user)
		}
	)
})

passport.use(LocalStrategy)

module.exports = passport
