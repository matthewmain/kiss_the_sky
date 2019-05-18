const db = require("../models")
const bcrypt = require("bcryptjs")

const Manifest = {

  seedUsers: (seedLogger, exit, next)=>{
    const users= [
      {
        username: "dev",
        email: "dev@dev.com",
        password: bcrypt.hashSync("asdfasdf", 10)
      },
      {
        username: "Endicott64",
        email: "Endicott64@dev.com",
        password: bcrypt.hashSync("asdfasdf", 10)
      },
      {
        username: "thebodhisattva",
        email: "thebodhisattva@dev.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#C90606" }}
      },
      {
        username: "scooby",
        email: "scooby@dev.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#E8B741" }}
      }
    ]
    db.User
      .deleteMany({})
      .then(() => db.User.insertMany(users) )
      .then(data => seedLogger(data, exit, next) )
      .catch(err => { console.error(err); process.exit(1); } )
  }

}

module.exports = Manifest
