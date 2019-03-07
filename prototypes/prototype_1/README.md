### [Kiss The Sky](https://github.com/matthewmain/kiss_the_sky) 
### Prototype 1: Environment Physics & Basic Competive Growth

<br>
<br>

Basic competitive growth scheme: 1) Leaf height and 2) growth rate vs. 3) stability. Plants need light energy to grow. Leaves capture light and cast shadows, so the highest leaves will capture the most light. But tall plants are less stable, so only the stablest plants will grow tallest. But stable plants grow slower (wide segments need longer cross spans which take longer to develop, and more energy is required to grow wider/stronger segments), so the least stable plants will grow fastest. (Leaf height and growth rate comes at the cost of stability. Stability comes at the cost of growth rate and leaf height.)

<br>

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

<br>

- [X] establish verlet physics environment

- [X] basic, stable stalk growth with regenerative segments

- [X] leaves

- [X] light & shadows, logic

- [X] energy: storage, usage for growth rate

- [X] add ability to slow scene without affecting the physics

- [X] light & shadows, visualization

