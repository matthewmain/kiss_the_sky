### [Plant Evolution App](https://github.com/matthewmain/plant_evolution_app), Prototype 1 
#### Environment Physics & Basic Competive Growth

<br>

- [X] establish verlet physics environment

- [X] basic, stable stalk growth with regenerative segments

- [X] decide on very simple list of competing plant traits vs. environmental pressures for basic competitive growth:

   PLANTS:

   leaves & photosynthesis/plant energy
  - leaf width
  - leaf elevation
  - plant energy level

   plant growth
  - growth rate (dependent on plant's energy level)

   plant stability
  - segment width
  - segment rigidity
  - plant height (as segment count and/or lowest y-value)

   ENVIRONMENT:

  - light
  - shadow
  - gravity

   Basic competitive scheme: 1) Leaf height and 2) growth rate vs. 3) stability. Plants need light energy to grow. Leaves capture light and cast shadows, so the highest leaves will capture the most light. But tall plants are less stable, so only the stablest plants will grow tallest. But stable plants grow slower (wide segments need longer cross spans which take longer to develop, and more energy is required to grow wider/stronger segments), so the least stable plants will grow fastest. (Leaf height and growth rate comes at the cost of stability. Stability comes at the cost of growth rate and leaf height.)

- [ ] add leaves

- [ ] ...