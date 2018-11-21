# Plant Evolution App, Prototype 1 
## Environment Physics & Basic Competive Growth

- [X] establish verlet physics environment

- [X] basic, stable stalk growth with regenerative segments

- [ ] decide on very simple list of competing plant traits vs. environmental pressures for basic competitive growth:

ENV:
-light
-shadow
-gravity
PLA:
leaves & photosynthesis/plant energy
  -leaf width
  -leaf height
  -energy
plant growth
  -growth rate (dependent on plant's energy level)
plant stability
  -segement width
  -segment rigidity
  -plant height (as segement count and/or lowest y-value)

⋅⋅⋅*Basic competitive scheme: 1) Leaf height and 2) growth rate vs 3) stability. Plants need light energy to grow. Leaves capture light & cast shadows, so the highest leaves will capture the most light. But tall plants are less stable, so the only the stablest plants will grow tallest. But stable plants grow slower (wide segments need longer cross spans?), so the least stable plants will grow fastest. (Leaf height and growth rate comes at the cost of stability. Stability comes at the cost of growth rate and leaf height.)