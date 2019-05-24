const db = require("../models")
const bcrypt = require("bcryptjs")

const Users = {

  seedUsers: (seedLogger, next)=>{
    const users= [
      {
        username: "dev",
        email: "dev@dkts.com",
        password: bcrypt.hashSync("asdfasdf", 10)
      },
      {
        username: "Endicott64",
        email: "Endicott64@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10)
      },
      {
        username: "thebodhisattva",
        email: "thebodhisattva@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#C90606" }}
      },
      {
        username: "scooby",
        email: "scooby@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#E8B741" }}
      },
      {
        username: "PappasOnPromNight",
        email: "PappasOnPromNight@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#E76335" }}
      },
      {
        username: "carnubaWaxxx",
        email: "carnubaWaxxx@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#30C1B3" }}
      },
      {
        username: "Grommet_and_die",
        email: "Grommet_and_die@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#A330C1" }}
      },
      {
        username: "JUtah88",
        email: "JUtah88@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#F5E8A8" }}
      },
      {
        username: "richardMNixon",
        email: "richardMNixon@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#FFFFFF" }}
      },
      {
        username: "WARCHILD666",
        email: "WARCHILD666@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#FF0DCB" }}
      },
      {
        username: "ReferenceError",
        email: "ReferenceError@kts.com",
        password: bcrypt.hashSync("asdfasdf", 10),
        avatar: { colors: { pistil: "#E0993E", petal: "#FF0DCB" }}
      }
    ]
    db.User
      .deleteMany({})
      .then(() => db.User.insertMany(users) )
      .then(data => seedLogger(data, next) )
      .catch(err => { console.error(err); process.exit(1); } )
  }

}

module.exports = Users
