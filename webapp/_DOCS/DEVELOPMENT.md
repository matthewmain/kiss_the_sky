# Deployment Notes

⚠️Warning

- When first deploying, make sure you seed any required data within any package.json `postbuild` scripts.
- Here's an example WITH seeds for heroku:
  - $`"heroku-postbuild": "npm run build && npm run seed manifest",`
- ... And, without seeds
  - $`"heroku-postbuild": "npm run build",`

### Heroku (Inital Setup Steps)

From the root level of the **ready-to-deploy**, **updated** master branch

- $`heroku create <name_of_app>`
- Example: $`heroku create kiss-the-sky`

Add mLabs (MongoDB)

- `heroku addons:create mongolab -a <name-of-heroku-app>`
- Example: $`heroku addons:create mongolab -a kiss-the-sky`

### Heroku deploy

For deployment on root level of master branch

- $`git push heroku master`

OR, for deployment on sub-folder of master branch

- $`git subtree push --prefix <your_sub-folder> heroku master`

- Example: `git subtree push --prefix webapp heroku master`🧨

That's it! Should be at live at address they give you as output after (loooong) build process. 

Note: modification
