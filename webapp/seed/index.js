const mongoose = require("mongoose")
const db = require("../models")
const Manifest = require("./manifestSeed")
const User = require("./userSeed")

const seed = process.argv[2]

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/kts", { useNewUrlParser: true })
console.log(seed, '🌰...Seeding...💦...💦...🌱')

switch (seed) {
  case "manifest": Manifest.resetManifestDb(logSeed, false); break
  case "users": User.seedUsers(logSeed, false); break
  case "reset":
    mongoose.connection.dropCollection('sessions')
      .then(resp => console.log("dropped sessions:", resp))
      .then(()=> db.Saved.deleteMany({}))
      .then(resp=>console.log("cleared saveds:", resp))
      .then(()=>{
        User.seedUsers(logSeed, ()=>{
          Manifest.resetManifestDb(logSeed)
        })
      })
    break
  default: {
    console.log('\n🤔please enter a seed argument... i.e. `npm run seed manifest`\n')
    process.exit(0)
  }
}

function logSeed(data, next){
  console.log("\nDocument(s) inserted!\n" + JSON.stringify(data, null, 2))
  if (!next) process.exit(0)
  else { next() }
}
