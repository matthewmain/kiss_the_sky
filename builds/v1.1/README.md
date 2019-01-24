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

- [X] slidable sun shades to let user control which plants get sunlight
- [ ] ability to pull a plant
- [ ] basic gamification: grow a red flower tall enough to reach the top of the viewbox in the fewest generations, "kiss the sky"
- [ ] at startup, provide info about how app harnesses biological evolution via plant competition for height/light.
- [ ] allow users to choose 1) "tiny white flower" or 2) "random garden" to "see what happens" as the years pass and the plants evolve. (maybe add option for one small & one large plant also.)
- [ ] "Sew" button that kicks off initial falling seeds.

<br>

- [ ] fade out shadows when leaf angle falls to below about -80 degrees from horizontal (will avoid narrow shadows when leaves are vertical as well as shadows flashing off at plant death)
- [ ] omit pod closure at plant death
- [ ] add shadow to gap between leaves
- [ ] fix all forward growth based on y-values by replacing with trig formula to ensure new growth is forward regardless of stalk angle
- [ ] give stalks & leaves variable fills instead of stroke outlines (should look better and may improve rendering performance)
- [ ] performance enhancement: run sun rays less often with stronger intensity (probably need to address plant color-change flashing), and/or render less frequently
- [ ] fix safari issues (color value floats, etc.)
