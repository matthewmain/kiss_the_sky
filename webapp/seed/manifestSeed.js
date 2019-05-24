const db = require("../models")

const Manifest = {

  seedManifest: (seedLogger, next)=>{
    db.User.collection.count()
      .then( users => {
        db.Manifest
          .deleteMany({})
          .then(() => db.Manifest.insertMany([{
            total_users: users
          }]) )
          .then(data => seedLogger(data, next) )
          .catch(err => { console.error(err); process.exit(1); } )
      })
  }

}

module.exports = Manifest
