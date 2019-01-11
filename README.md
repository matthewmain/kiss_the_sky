# Plant Evolution App

<br>
<br>

- [X] [Prototype 1](https://github.com/matthewmain/plant_evolution_app/tree/master/prototypes/prototype_1) - _Environment Physics & Basic Competitive Growth_  
- [X] [Prototype 2](https://github.com/matthewmain/plant_evolution_app/tree/master/prototypes/prototype_2) - _Flowers, Seeds, & Reproduction with Randomized Traits_  
- [X] [Prototype 3](https://github.com/matthewmain/plant_evolution_app/tree/master/prototypes/prototype_3) - _Seasons_

<br>

- [X] [Version 1.0](https://github.com/matthewmain/plant_evolution_app/tree/master/builds/v1.0) - _Genes, Alleles, Mutations, & Reproduction with Mendelian Genetics (random pollination among bloomed flowers)_
- [ ] [Version 1.1](https://github.com/matthewmain/plant_evolution_app/tree/master/builds/v1.1) - _Selective Pollination_ _**(decide whether to use insect polination only, user selection/manual polination only, or a combination in which user can select different bee types every year from a catalogue of bees that have different flower characterstics preferences.)**_
- [ ] Version 1.2 - _Plant Branching_

<br>

- [ ] Version 2.0 - _Stylization (advanced sprouting, blooming, pod development, seed dispersal, and plant collapse animations, plus plant and flower petal styling, advanced colors and gradients, lighting, changing seasonal background imagery, possibly winter snowfall, etc.)_ 
- [ ] Version 2.1 - _Plant interaction (swiping for breeze, cutting/pruning) & gamification (storing & planting seeds, possibly ability to apply shade and/or other ways to manipulate environment, goals like height or flower color, etc.)_

<br>
<br>
<br>

to add/ideas:

 - to make v1.0 presentable: 
   - app name and simple logo/title with decent font
   - at startup, provide info about how app harnesses biological evolution via plant competition for height/light.
   - allow users to choose 1) "tiny white flower" or 2) "random garden" to "see what happens" as the years pass and the plants evolve.
   - "Sew" button that kicks of initial falling seeds.
   - add "year _X_, _season_>" to season meter, using title font 
   - add restart button
   - (possibly, add drawer with tree menu for each gene and current allele values for each)
 - update flowers so that all points are non-verlet, built relationally around the uppermost segment
   - add complexity to flowers by adding radial symmetry, variable petal counts, petal layers, petal lengths, petal shapes, petal gradients/stripes, etc.
 - performance enhancement
   - run sun rays less often with stronger intensity (probably need to address plant color-change flashing)
   - possibly run verlet less often, or with fewer rigidity iterations (after updating flowers)
 - image capture every mid summer
 - ...
