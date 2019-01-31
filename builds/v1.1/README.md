### [Plant Evolution App](https://github.com/matthewmain/plant_evolution_app) 
### Version 1.1: Basic Artificial Selection Gamification & UI

<br>
<br>

- [X] choose game name and design title logo (Kiss the Sky)
- [X] add "year _number_, _season_" to season meter, using attractive font
- [X] add highest flower tracker
- [X] add restart button
- [X] add shadow visibility toggle
- [X] add image download button

<br>

Basic gamification: grow a red flower tall enough to reach the top of the viewbox in the fewest generations, "kiss the sky"

- [X] slidable sun shades to let user control which plants get sunlight
- [X] ability to pull/kill a plant
- [X] adjust season lengths so that 1) fall & winter are much shorter so that periods of idle time when player doesn't have anything to do are dramatically reduced, and 2) make summer lengths variable based on average or greatest segment count so that as plants grow they have enough time to develop and bloom before fall.
- [X] faint red pulsing animation around red-hued flowers that qaulify as flowers that can be used to reach 100% height to win the game.
- [X] faint yellow pollen-release animation upon full flower bloom to indicate that flower has entered reproductive mode and can cross-polinate with other open flowers
- [ ] a line or pointer indicator to show 100% height (possibly also add red circle around percentage number at bottom right)
- [ ] a supplimental arrow/line indicator for highest red flower height so far
- [ ] at startup, provide info about game goals and how app harnesses biological evolution via plant competition for height/light. (probably also add an info button that provides this information on demand during game play too.)
- [ ] allow users to choose 1) easy "red flower garden", 2) medium "random flower garden", and 3) hard "tiny white flower"
- [ ] "Sew" button that kicks off initial falling seeds.
- [ ] add stylized on-screen text notifications throughout game: season change announcements, new best height announcement when current record broken, periodic/annual progress updates about how far average sizes/colors have progressed, etc. (and possibly quotes from biologists, or weird mountain-like phrases in first person plural as if coming from plants)
- [ ] game win announcement screen with some kind of weird cool animation

<br>

Misc. improvements

- [ ] fade out shadows when leaf angle falls to below about -80 degrees from horizontal (will avoid narrow shadows when leaves are vertical as well as shadows flashing off at plant death)
- [ ] omit pod closure at plant death
- [ ] add shadow to gap between leaves
- [ ] fix all forward growth based on y-values by replacing with trig formula to ensure new growth is forward regardless of stalk angle
- [ ] give stalks & leaves variable fills instead of stroke outlines (should look better and may improve rendering performance)
- [ ] seeds plant firmly without swinging, even at worldspeed 1
- [ ] change season background gradients so seasons are more distinct and changes are more dramatic

<br>

Fixes

- [ ] performance enhancement: run sun rays less often with stronger intensity (probably need to address plant color-change flashing), and/or render less frequently
- [ ] performance enhancement: consolidate redundant loops
- [ ] performance enhancement: use Chrome performance tools to track down any other other performance issues
- [ ] fix safari issues (color value floats, etc.)
