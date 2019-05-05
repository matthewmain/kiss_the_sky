import API from "./API"

export default {

  getManifest(app) {
    console.log("🧮 requesting manifest from API" )
    API.getManifest()
      .then( resp => {
        console.log(" - 🧮 manifest :", resp.data)
        app.set({manifest: resp.data})
      })
      .catch( err => console.log(err))
  }

}
