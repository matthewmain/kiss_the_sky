# Development Notes

Download Robo 3T for localhost mongoDB viewing/editing
- https://robomongo.org/download

For help installing Mongodb on a Mac
- https://treehouse.github.io/installation-guides/mac/mongo-mac.html

Starting development environment
- $`mongod`
  - Not requred: $`mongo` will test the deamon is running which should put you in the mongodb cli `>`.

# Getting Started

To seed your database when you first get your development environment setup.
- $`npm run seed all` > after completion, you may need to [Control+c] to breakout of the process if hangs.

Start Localhost (from `/webapp` folder)
- $`npm start`

# Next Steps

- Thoroughly document development Process (This Readme)
- Actually, the next step is to figure out what the next steps are...
- Build Site Map
  - React Components
  - Routes
  - Database MVC

### Unordered Steps

- Chat With Matt.
- Drop KTS Game Enviroment into place
- Test Launch On Heroku
- Back End Login code base
- Front end login Code Base
- Style Front End login flow.

### Notes / Questions For matt
- Font Style?
- & Widths and margins
  - For instance the Game Mode / Ambient mode buttons say 300px.

----
# General Notes Notes

Deploy to Heroku as sub-folder
- First create the branch on Heroku
  - `git subtree push --prefix webapp heroku testdeploy`
- Then push that branch against Heroku's master
  -`git push heroku webapp:master`

# Resources

Favicon Generator:
- https://realfavicongenerator.net/favicon_result?file_id=p1d6lj02mpfts1l8i1voptk91iaa6#.XJZg1-tKjOR

-----
