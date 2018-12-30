### [Plant Evolution App](https://github.com/matthewmain/plant_evolution_app) 
### Prototype 3: Seasons

<br>
<br>

- [X] internal season tracker
- [X] seasonal background color changes _(preliminary, with a simple gradient)_
- [X] season meter & year counter UI
- [X] energy and/or photosynthesis and/or sun ray intensity level changes by season
- [ ] winter plant collapse & span removal/fixing all points at fallen location _(possibly remove all verlet points entirely and store as simple canvas coordinates, if improves performance; and/or, possibly fade out or slowly compress to 100% y-value previous year's decomposed plants and remove from both verlet & rendering entirely, if improves perfomance)_

-(go over plant dying cycle and remove any unused points)
-in winter after plant's collapse: 
	-slowly reduce all arcs to 0
	-slowly move all points to 100% y-value (probably update spans to avoid bouncing/compression)
-remove all of plant's points, spans, skin, segment, & flower objects (segments & flowers removed with plant...)
-remove plant object

