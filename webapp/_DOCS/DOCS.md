# Documentation

### Pages / Routes

* `/` (Alternatives: `/landing`,`/home`,`/game`)
  * 🌅 Basically, this is the main page. But it kinda behaves more like the background to the rest of the app. At least in regards to pages & url routes.  
  * We had to included a `Home` component page that's empty in the `/app.js` file. to hold the pace for pages that are only the main page.... yes it's odd.
  * All other pages with endpoints are "overlays" over this "background" main page

* `/leaderboard` (default `/leaderboard/myhighscores` )
  * `/leaderboard/savedsessions`
  * `/leaderboard/myhighscores`
  * `/leaderboard/settings`

* `/dashboard` : (default `/leaderboard/expert` )
  * `/leaderboard/beginner`
  * `/leaderboard/intermediate`
  * `/leaderboard/expert` >

### Hash pages
* `#signup` > HASH Page
* `#signin`

* Default: `*` > 404 page

### API

*👥 User*

* `/api/user` : GET : returns session logged in user
* `/api/user` : POST : creates new user : returns username & id
* `/api/user/logout` : GET : logs out user : returns success message only
* `/api/user/signup` : POST : creates new user : returns username & id
* `/api/user/checkavailable` : POST : checks used field: returns available(bool)

*🧮 Admin*

* `api/manifest` : GET : Returns complete manifest data.
  * local Example: http://localhost:3004/api/manifest
  * heroku Example: https://kiss-the-sky.herokuapp.com/api/manifest
* `api/manifest` : PUT : Increments "visits" count
