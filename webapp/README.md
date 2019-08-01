# Development Setup Notes

### Overview
This is a MERN (Mongodb, Express, React, Node) Application, and here are the required installations...
- Node JS: https://nodejs.org/en/download/
- MongoDb:
  - Download: https://treehouse.github.io/installation-guides/mac/mongo-mac.html
  - Info: https://www.mongodb.com/
  - Recommended software for visualizing database (not required)
    - Robo 3T: https://robomongo.org/download
  - Recommended software for testing API requests
    - postman: https://www.getpostman.com/

### Getting Started
Once you have all the required software install.
- Run $`mongod` (don't forget the `d`) in your bash.
  - This will create a mongodb deamon running in your OS background.
  - The first time you do this, the output will likely hang.
- In a new window, run $`mongo` (NO `d` this time) to test that it's running
  - If setup correctly, your command line will now show the `>` symbol
  - From here, you can run mongodb commands.
  - NOTE, running `mongo` is a way to test your mongodb deamon, you likely wont do any work directly in this command line, and can close it while developing

### Seed your database
The application may behave oddly if you haven't seeded any data.
- From the within the `webapp` folder, run $`npm run seed reset`
  - NOTE: there are other specific seeds, but $`npm run seed reset` will restore all seeds for basic testing.
  - OR: you can just run $`npm run seed manifest` if you don't want any seeds, just basic
- WARNING! You will lose any saved data locally when running these commands.

Finally, start your local development environment
- Do this within the `/webapp` folder (NOT inside the `/client`)
- Run $`npm start`

Your Front End should now be serving to `http://localhost:3003`

Test API Get requests at `http://localhost:3004`
- Example: `http://localhost:3004/api/manifest`

### Potential issues

Port in use error.
- To kill a port that is stuck in use
  - Run $`lsof -i :3003` (Or whatever port you need).
- This will show a list of services using that port.
- Find the `PID` number associated with the port you want to kill
  - Run $`kill -QUIT PID`
  - Example: $`kill -QUIT 23451` (NOTE: number character length may vary.)

----
# Deployment Notes

Deploy to Heroku as sub-folder (from the top level)
- `git subtree push --prefix webapp heroku master`

Location
- primary: [kissthesky.app](https://www.kissthesky.app) 
- heroku direct: [kiss-the-sky.herokuapp.com](https://kiss-the-sky.herokuapp.com)

# Resources

Favicon Generator:
- https://realfavicongenerator.net/favicon_result?file_id=p1d6lj02mpfts1l8i1voptk91iaa6#.XJZg1-tKjOR

-----
