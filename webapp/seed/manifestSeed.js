const db = require("../models")

const Manifest = {

  resetManifestDb: (seedLogger, exit)=>{
    db.Manifest
      .deleteMany({})
      .then(() => db.Manifest.insertMany([{}]) )
      .then(data => seedLogger(data, exit) )
      .catch(err => { console.error(err); process.exit(1); } )
  }

}

module.exports = Manifest
