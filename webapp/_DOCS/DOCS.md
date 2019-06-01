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

#### Hash pages
* `#signup` > HASH Page
* `#signin`

* Default: `*` > 404 page


----
### Validators:

username
  - Must be unique (back-end quick check and on submit)
  - Must be less than 31 characters (back-end)

email
  - Must be unique (back-end quick check and on submit)
  - Must be less than 128 characters (back-end)

password
  - must match confirm (front-end)
  - must be longer than 6 characters (front/back-end)
  - Must be less than 128 characters (back-end)

NOTE: Non-custom errors send default error message(s) from back-end.


----
### API

*🧮 Admin*

* `api/manifest` : GET : Returns complete manifest data.
  * local Example: http://localhost:3004/api/manifest
  * heroku Example: https://kiss-the-sky.herokuapp.com/api/manifest
* `api/manifest` : PUT : Increments "visits" count
* `api/manifest/userlist` : GET : returns all users (username,saveds,link to profile)
* `api/manifest/savedlist` : GET : returns all saved game info
* `api/manifest/savedstats` : GET : returns saved collection stats
* `api/manifest/user/:username` : GET : returns user profile

*👥 User*

* `/api/user` : GET : returns session logged in user
* `/api/user` : POST : creates new user : returns username & id
* `/api/user/logout` : GET : logs out user : returns message only
* `/api/user/signup` : POST : creates new user : returns username & id
* `/api/user/checkavailable` : POST : checks used field: returns available(bool)

*💾 Saved*

* `/api/saved` : POST : returns all saved game's manifests
* `/api/saved` : PUT : returns message only
* `/api/saved/resume` : POST : returns game Object
* `/api/saved/delete` : POST : returns message only
* `/api/saved/update` : PUT : returns message only

*⭐️ Winner*

* `/api/winner` : GET : return all winner's with condensed array.
* `/api/winner` : POST : returns message only
* `/api/winner/leaderboard/:difficulty/:page` : GET : returns paginated leaderboard page
* `/api/winner/myhighscores` : GET : returns user's high scores.
