



//////////////////////////  SAVE GAME PROGRESS  //////////////////////////////



/////---Initial Raw Save Data---/////

var saveData = {};

function save() {
	//object collections & counters
	saveData.points = points; saveData.pointCount = pointCount;
	saveData.spans = spans; saveData.spanCount = spanCount;
	saveData.skins = skins; saveData.skinCount = skinCount;
	saveData.seeds = seeds; saveData.seedCount = seedCount;
	saveData.plants = plants; saveData.plantCount = plantCount;
	saveData.pollinationAnimations = pollinationAnimations; saveData.pollinationAnimationCount = pollinationAnimationCount;
	saveData.sunRays = sunRays; saveData.sunRayCount = sunRayCount;
	saveData.shadows = shadows; saveData.shadowCount = shadowCount;
	//settings
	saveData.gameDifficulty = gameDifficulty;
	saveData.ambientMode = ambientMode;
	saveData.endOfGameAnnouncementDisplayed = endOfGameAnnouncementDisplayed;
	saveData.darkMode = darkMode;
	saveData.viewShadows = viewShadows;
	saveData.gamePaused = true;
	//progress
	saveData.highestRedFlowerPct = highestRedFlowerPct;
	saveData.gameHasBegun = gameHasBegun;
	saveData.readyForEliminationDemo = readyForEliminationDemo; 
	saveData.readyForChangeDemo = readyForChangeDemo; 
	saveData.eliminationDemoHasBegun = eliminationDemoHasBegun;
	saveData.changeDemoHasBegun = changeDemoHasBegun;
	saveData.allDemosHaveRun = allDemosHaveRun; 
	saveData.readyForNextMilestoneAnnouncement = readyForNextMilestoneAnnouncement;
	saveData.milestoneFirstRedHasBeenRun = milestoneFirstRedHasBeenRun;
	saveData.milestoneThirdHasBeenRun = milestoneThirdHasBeenRun;
	saveData.milestoneHalfHasBeenRun = milestoneHalfHasBeenRun;
	saveData.milestoneTwoThirdsHasBeenRun = milestoneTwoThirdsHasBeenRun;
	saveData.milestone90HasBeenRun = milestone90HasBeenRun;
	//time
	saveData.worldTime = worldTime;  
	saveData.currentYear = currentYear;
	saveData.yearTime = yearTime;
	saveData.currentSeason = currentSeason;
	saveData.currentGreatestMaxSegment = currentGreatestMaxSegment;
	//misc.
	saveData.initialGeneValueAverages = initialGeneValueAverages;
}



/////---Data Codification, Compression, & Stringification---/////


function encodeAllSaveData() {

	//iterate through saveData object

		//if hit an array of object references, 

			//check array for objects with object references and replace with placeholders...
			handleObjectArray( array );


}

function handleObjectArray( array ) {

	//iterate through array.
	
		//if hit an object, 
		
			//iterate through object.
			
				//if value is an object, 
				
					//replace object with a codified placeholder tag as a string marking the class name and instance id.

				//else if value is an array (handles plant instance segments & flowers collection arrays)

					//check array for objects with object references and replace with placeholders (recursively)
					handleObjectArray( array );

}












// save(); 
// console.log( saveData );








