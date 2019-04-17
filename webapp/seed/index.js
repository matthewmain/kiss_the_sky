const mongoose = require("mongoose")
const db = require("../models")
const Manifest = require("./manifestSeed")

const seed = process.argv[2]

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/kts", { useNewUrlParser: true })
console.log(seed, '🌰...Seeding...💦...💦...🌱')

switch (seed) {
  case "manifest": Manifest.resetManifestDb(logSeed); break;
  case "all": // Users.seeduserDb(logSeed, true)
    Manifest.resetManifestDb(logSeed) // 🚨 👆 Make sure only the LAST seed deosn't have exit === false
    break
  default: {
    console.log('\n🤔please enter a seed argument... i.e. `npm run seed manifest`\n')
    process.exit(0)
  }
}

function logSeed(data, exit){
  console.log("\nDocument(s) inserted!\n" + JSON.stringify(data, null, 2))
  if (!exit) process.exit(0)
}
