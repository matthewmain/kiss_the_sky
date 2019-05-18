const mongoose = require("mongoose")
const db = require("../models")
const Manifest = require("./manifestSeed")
const User = require("./userSeed")

const seed = process.argv[2]

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/kts", { useNewUrlParser: true })
console.log(seed, '🌰...Seeding...💦...💦...🌱')

switch (seed) {
  case "manifest": Manifest.resetManifestDb(logSeed, true); break
  case "users": User.seedUsers(logSeed, true); break
  case "reset":
    User.seedUsers(logSeed, false, ()=>{
      Manifest.resetManifestDb(logSeed, true)
    })
    break
  default: {
    console.log('\n🤔please enter a seed argument... i.e. `npm run seed manifest`\n')
    process.exit(0)
  }
}

function logSeed(data, exit, next){
  console.log("\nDocument(s) inserted!\n" + JSON.stringify(data, null, 2))
  if (exit) process.exit(0)
  if (next) next()
}
