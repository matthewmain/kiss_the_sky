

///////// TOOLS.JS /////////




///generates random integer between a minimum and maximum value
function randIntBet(min,max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

///generates random Float between a minimum and maximum value
function randFltBet(min,max) {
  return Math.random()*(max-min)+min;
}