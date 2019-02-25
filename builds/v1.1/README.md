### [Plant Evolution App](https://github.com/matthewmain/plant_evolution_app) 
### Version 1.1: Basic Artificial Selection Gamification & UI

<br>
<br>

- [X] choose game name and design title logo (Kiss the Sky)
- [X] add "year _number_, _season_" to season meter
- [X] add highest flower tracker
- [X] add restart button
- [X] add shadow visibility toggle
- [X] add image download button

<br>

Basic gamification: grow a red flower tall enough to reach the top of the viewbox in the fewest generations, "kiss the sky"

- [X] slidable sun shades to let user control which plants get sunlight (...omit)
- [X] ability to pull/kill a plant
- [X] adjust season lengths so that 1) fall & winter are much shorter so that periods of idle time when player doesn't have anything to do are dramatically reduced, and 2) make summer lengths variable based on average or greatest segment count so that as plants grow they have enough time to develop and bloom before fall.
- [X] faint red pulsing animation around red-hued flowers that qaulify as flowers that can be used to reach 100% height to win the game.
- [X] faint yellow pollen-release animation upon full flower bloom to indicate that flower has entered reproductive mode and can cross-polinate with other open flowers
- [X] a supplimental arrow/line indicator for highest red flower height so far (also add red tag to percentage number at bottom right)
- [X] landing page with title/logo and play button
- [X] at startup, provide info about game goals and how app harnesses biological evolution via plant competition for height/light. 
- [X] allow users to choose 1) easy "red flower garden", 2) medium "random flower garden", or 3) hard "tiny white flower", along with option for observation mode
- [X] "Sow" button that kicks off initial falling seeds.
- [X] info, shadows, camera, play/pause, and restart UI icons with hover tips and warnings where appropriate
- [X] add stylized on-screen text notifications throughout game: season change announcements & new best height announcement when current record broken
- [X] game lose announcement screen
- [X] game win announcement screen, with some kind of weird cool animation, summary of achievements (difficulty level and number of generations to reach 100% height with red flower.) and option to play game again or watch ambient mode.

<br>

Improvements & Fixes

- [X] brief instructional notification during first spring about how to swipe to eliminate plants with a simple animation of a hand swiping and eliminating plants 
- [X] brief instructional notification during first summer about how recessive traits and mutations work with a simple animated diagram pointing from trait to seed to new trait
- [X] a few in-game announcements to mark milestones: congratulations on first red plant, on being 1/3 way there, half way there, two thirds way there, and 90% way there
- [X] resolve red-flower color ambiguity: set saturation to 100 and remove gene, adjust criteria for redness
- [X] fix flower petal not fading but just flashing to white
- [X] seeds plant firmly without swinging
- [X] replace megrim font with Dosis on landing & "sow" buttons
- [X] add media queries to update size of game win announcement text & footer text, or possibly use javascript to update based on canvas width
- [X] add shadow to gap between leaves
- [X] fade out shadows as plant dies
- [X] speed up pod opening & seed drop to accomodate faster seasonal changes 
- [X] omit pod closure at plant death
- [X] fix large-plant elimination issue when curser is too far from a point by calibrating elimination radius based on largest plant width)
- [X] change season background gradients so seasons are more distinct and changes are more dramatic (don't overdo it though)
- [X] fix cross-browser issues (safari color value floats, etc.)
- [X] improve performance by rendering less frequently
- [X] fix flashing cursor
- [X] fix flashing new best height line marker
- [X] fix announcement position overlapping
- [X] fix background color changes

