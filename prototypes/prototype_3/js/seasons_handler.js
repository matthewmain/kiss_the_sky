

///////// SEASONS HANDLER /////////



var yearTime = 0;
var currentSeason;

function trackSeasons() {
  yearTime++;
  if ( yearTime < 10000 ) {
    currentSeason = "spring"
  } else if ( yearTime < 50000 ) {
    currentSeason = "summer"
  } else if ( yearTime < 55000 ) {
    currentSeason = "fall"
  } else if ( yearTime < 60000 ) {
    currentSeason = "winter"
  } else {
    yearTime = 0;
  }
}













