


//////////////////////////  SAVE GAME PROGRESS  //////////////////////////////


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









