import axios from "axios"

export default {

  // 🧮 Admin
  getManifest: function() {
    return axios.put("/api/manifest")
  },

}
