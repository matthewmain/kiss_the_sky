const db = require("../models")
const mongoose = require("mongoose")
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/kts", { useNewUrlParser: true })


const ManifestControllers = {

  getManifest: function(req, res) {
    console.log('\n 📜 Get manifest API attempt 📜 \n')
    db.Manifest.findOne({ name: "manifest" })
      .then(resp => { db.User.countDocuments()
        .then(users => { db.Saved.countDocuments()
          .then(saved => { db.Winner.countDocuments()
            .then (winners => { mongoose.connection.db.stats()
              .then(stats => {
                const manifest = {...resp}._doc
                manifest.saved = saved
                manifest.users = users
                manifest.winners = winners
                manifest.db_dataSizse = Math.round(stats.dataSize / 1000).toLocaleString()+' kb'
                manifest.db_storageSize = Math.round(stats.storageSize / 1000).toLocaleString()+' kb'
                manifest.user_list = "http://"+req.headers.host+"/api/manifest/userList"
                manifest.saved_list = "http://"+req.headers.host+"/api/manifest/savedList"
                manifest.saved_stats = "http://"+req.headers.host+"/api/manifest/savedstats"
                res.json(manifest)
              })
            })
          })
        })
      })
      .catch(err => res.status(422).json(err) )
  },

  savedStats: function(req, res) {
    console.log('\n 📜 💾 Get Saved Stats attempt  💾 📜 \n')
    db.Saved.collection.stats()
      .then(savedStats => {
        const s = {...savedStats}
        s.size = Math.round(s.size / 1000).toLocaleString()+' kb'
        s.avgObjSize = Math.round(s.avgObjSize / 1000).toLocaleString()+' kb'
        s.storageSize = Math.round(s.storageSize / 1000).toLocaleString()+' kb'
        res.json(s)
      })
  },

  incrementPage: function(req, res) {
    console.log('\n 🧮 👊 ➕➕ Increment visits attempt ➕➕ 👊 🧮 \n')
    const edits = { $inc : {visits : 1} }
    db.Manifest.findOneAndUpdate( { name: "manifest" }, edits )
      .then(resp=> res.json({fullManifest: "http://"+req.headers.host+"/api/manifest"}))
      .catch(err=> res.status(422).json(err) )
  },

  userList: function(req, res) {
    console.log('\n 👥👥👥 get list of all users attempt 👥👥👥 \n')
    db.User.find({}, {"username": 1, "_id": 0, "saved": 1})
      .then(users => {
        res.json(users.map(u=>{
          return {
            username: u.username,
            saved: u.saved.length,
            profile: "http://"+req.headers.host+"/api/manifest/user/"+u.username
          }
        }))
      })
      .catch(err => console.log(err) )
  },

  savedList: function(req, res) {
    console.log('\n 💾💾💾 get list of all saveds attempt 💾💾💾 \n')
    db.Saved.find({})
      .then(saveds => {
        res.json(saveds.map(s=>{
          const size = Math.round(s.game.length / 1000).toLocaleString()+' kb'
          return { game: size+' - '+s.manifest.title+' - user: '+s.username }
        }))
      })
      .catch(err => console.log(err) )
  },

  user: function(req, res) {
    console.log('\n 👥 get users attempt 👥 \n')
    console.log(req.params.username)
    db.User.findOne({username: req.params.username})
      .then(resp => {
        const users = {...resp}._doc
        delete(users.password)
        res.json(users)
      })
      .catch(err => console.log(err) )
  },

}

module.exports = ManifestControllers
