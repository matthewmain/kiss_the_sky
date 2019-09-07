const mongoose = require("mongoose")
const db = require("../models")
const Manifest = require("./manifestSeed")
const User = require("./userSeed")
const Winner = require("./winnerSeed")
const Saved = require("./savedSeed")

const seed = process.argv[2]

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/kts", { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log(seed, '\n 🌰...Seeding...💦...💦...🌱 \n \n... 🌰...Seeding ...💦...🌱')

switch (seed) {
  case "manifest": Manifest.seedManifest(logSeed, false); break
  case "users": User.seedUsers(logSeed, false); break
  case "winners": Winner.seedWinners(logSeed, false); break
  case "saved": Saved.seedSaved(logSeed, false); break
  case "reset":
    User.seedUsers(logSeed, ()=>{
      Winner.seedWinners(logSeed, ()=>{
        Saved.seedSaved(logSeed, ()=>{
          Manifest.seedManifest(logSeed)
        })
      })
    })
    break
  case "restore":
    db.User.deleteMany({})
      .then(() => db.Winner.deleteMany({}) )
      .then(() => db.Saved.deleteMany({}) )
      .then(() => Manifest.seedManifest(logSeed, false) )
    // Manifest.seedManifest(logSeed, false)
    break
  default: {
    console.log('\n🤔please enter a seed argument... i.e. `npm run seed manifest`\n')
    process.exit(0)
  }
}

function logSeed(data, next){
  console.log("\nDocument(s) inserted!\n\n" + JSON.stringify(data, null, 2)+"\n")
  if (!next) process.exit(0)
  else { next() }
}
