



//////////////////////////  SAVE GAME PROGRESS  //////////////////////////////




/////**** Record Initial Raw Save Data ****/////


var localSavedGameData = {};



function saveGame() {
	//object collections
	localSavedGameData.points = JSON.parse(JSON.stringify(points));
	localSavedGameData.spans = JSON.parse(JSON.stringify(spans));
	localSavedGameData.skins = JSON.parse(JSON.stringify(skins));
	localSavedGameData.seeds = JSON.parse(JSON.stringify(seeds));
	localSavedGameData.plants = JSON.parse(JSON.stringify(plants));
	localSavedGameData.pollinationAnimations = [];
	//counters
	localSavedGameData.pointCount = pointCount;
	localSavedGameData.spanCount = spanCount;
	localSavedGameData.skinCount = skinCount;
	localSavedGameData.seedCount = seedCount;
	localSavedGameData.plantCount = plantCount;
	localSavedGameData.pollinationAnimationCount = 0;
	//settings
	localSavedGameData.gameDifficulty = gameDifficulty;
	localSavedGameData.ambientMode = ambientMode;
	localSavedGameData.endOfGameAnnouncementDisplayed = endOfGameAnnouncementDisplayed;
	//progress
	localSavedGameData.gameHasBegun = gameHasBegun;
	localSavedGameData.highestRedFlowerPct = highestRedFlowerPct;
	localSavedGameData.heightMarker = heightMarker;
	localSavedGameData.readyForEliminationDemo = readyForEliminationDemo;
	localSavedGameData.readyForChangeDemo = readyForChangeDemo;
	localSavedGameData.eliminationDemoHasBegun = eliminationDemoHasBegun;
	localSavedGameData.changeDemoHasBegun = changeDemoHasBegun;
	localSavedGameData.allDemosHaveRun = allDemosHaveRun;
	localSavedGameData.readyForNextMilestoneAnnouncement = readyForNextMilestoneAnnouncement;
	localSavedGameData.milestoneFirstRedHasBeenRun = milestoneFirstRedHasBeenRun;
	localSavedGameData.milestoneThirdHasBeenRun = milestoneThirdHasBeenRun;
	localSavedGameData.milestoneHalfHasBeenRun = milestoneHalfHasBeenRun;
	localSavedGameData.milestoneTwoThirdsHasBeenRun = milestoneTwoThirdsHasBeenRun;
	localSavedGameData.milestone90HasBeenRun = milestone90HasBeenRun;
	localSavedGameData.gameHasEnded = gameHasEnded;
	//time
	localSavedGameData.timeStamp = new Date();
	localSavedGameData.worldTime = worldTime;
	localSavedGameData.currentYear = currentYear;
	localSavedGameData.yearTime = yearTime;
	localSavedGameData.currentSeason = currentSeason;
	localSavedGameData.spL = spL;
	localSavedGameData.suL = suL;
	localSavedGameData.photosynthesisRatio = photosynthesisRatio;
	localSavedGameData.livEnExp = livEnExp;
	localSavedGameData.csbg = csbg;
	localSavedGameData.psbg = psbg;
	localSavedGameData.ccs1 = ccs1;
	localSavedGameData.ccs2 = ccs2;
	localSavedGameData.ccs3 = ccs3;
	localSavedGameData.ccs4 = ccs4;
	//misc.
	localSavedGameData.initialGeneValueAverages = initialGeneValueAverages;
	//encode & compress data
  localSavedGameData = encodeAndCompressSavedGameData( localSavedGameData );
}




/////**** Data Codification, Compression, & Stringification ****/////


function encodeAndCompressSavedGameData( gameData ) {
	for ( var key in gameData ) {
		if ( Array.isArray(gameData[key]) ) {
			var obColArr = gameData[key];  // object collection array
			for ( var i=0; i<obColArr.length; i++) {
				var colOb = obColArr[i];  // collected object
				for ( var innerKey in colOb ) {
					//encode object references that are direct properties of an object
					if ( needsCodification( colOb[innerKey] ) ) {
						colOb[innerKey] = "#" + colOb[innerKey].saveTagClass + ":" + colOb[innerKey].id;
					//encode object references that are collected in arrays as properties of an object
					} else if ( Array.isArray(colOb[innerKey]) ) {
						encodeInnerObjectCollection( colOb[innerKey] );
					}
				}
			}
		}
	}
	gameData = JSON.stringify( gameData );
	gameData = gameData.replace( /\d*\.\d+/g, ( float ) => { return ( Math.round( float * 1000 ) / 1000 ); } );  // round all floats
	return gameData;
}


function encodeInnerObjectCollection( objectCollectionArray ) {
	for ( var i=0; i<objectCollectionArray.length; i++) {
		if ( needsCodification( objectCollectionArray[i] ) ) {
			objectCollectionArray[i] = "#" + objectCollectionArray[i].saveTagClass + ":" + objectCollectionArray[i].id;
		} else {
			for ( var key in objectCollectionArray[i] ) {
				//encode object references that are direct properties of an object
				if ( needsCodification( objectCollectionArray[i][key] ) ) {
					objectCollectionArray[i][key] = "#" + objectCollectionArray[i][key].saveTagClass + ":" + objectCollectionArray[i][key].id;
				//encode object references that are collected in arrays as properties of an object
				} else if ( Array.isArray(objectCollectionArray[i][key]) ) {
					encodeInnerObjectCollection( objectCollectionArray[i][key] );
				}
			}
		}
	}
}




/////**** Data Parsing, De-Codification, & Assignment ****/////


var parsedData;


function needsCodification( value ) {
	return value !== null && value.saveTagClass;
}

function existsInCollection( object ) {

}


function assignPoints() {
	points = parsedData.points;
}


function assignSpans() {
	for ( var i=0; i<parsedData.spans.length; i++ ) {
		var span = parsedData.spans[i];
		for ( var key in span ) {
			if ( typeof span[key] === "string" && /^#/.test(span[key]) ) {
				var objectId = parseInt( span[key].match(/:(.*)/)[1] );
				span[key] = points.find( object => object.id === objectId );
			}
		}
	}
	spans = parsedData.spans;
}


function assignSkins() {
	for ( var i=0; i<parsedData.skins.length; i++ ) {
		var skin = parsedData.skins[i];
		for ( var j=0; j<skin.points.length; j++) {
			var objectId = parseInt( skin.points[j].match(/:(.*)/)[1] );
			skin.points[j] = points.find( object => object.id === objectId );
		}
	}
	skins = parsedData.skins;
}


function assignSeeds() {
	for ( var i=0; i<parsedData.seeds.length; i++ ) {
		var seed = parsedData.seeds[i];
		for ( var key in seed ) {
			if ( typeof seed[key] === "string" && /^#/.test(seed[key]) ) {
				var objectClass = seed[key].match(/#(.*?):/)[1];
				var objectId = parseInt( seed[key].match(/:(.*)/)[1] );
				switch( objectClass ) {
					case "point":
						seed[key] = points.find( object => object.id === objectId ); break;
					case "span":
						seed[key] = spans.find( object => object.id === objectId );
				}
			}
		}
	}
	seeds = parsedData.seeds;
}


function assignPlants() {
	for ( var i=0; i<parsedData.plants.length; i++ ) {
		var plant = parsedData.plants[i];
		for ( var key in plant ) {
			if ( typeof plant[key] === "string" && /^#/.test(plant[key]) ) {
				var objectClass = plant[key].match(/#(.*?):/)[1];
				var objectId = parseInt( plant[key].match(/:(.*)/)[1] );
				switch( objectClass ) {
					case "point":
						plant[key] = points.find( object => object.id === objectId ); break;
					case "span":
						plant[key] = spans.find( object => object.id === objectId ); break;
					case "seed":
						plant[key] = seeds.find( object => object.id === objectId );
				}
			} else if ( key === "flowers" ) {
				assignFlowers( plant );
			} else if ( key === "segments" ) {
				assignSegments( plant );
			}
		}
	}
	plants = parsedData.plants;
}


function assignFlowers( plant ) {
	for ( var i=0; i<plant.flowers.length; i++ ) {
		var flower = plant.flowers[i];
		for ( var key in flower ) {
			var objectClass, objectId;
			if ( typeof flower[key] === "string" && /^#/.test(flower[key]) ) {
				objectClass = flower[key].match(/#(.*?):/)[1];
				objectId = parseInt( flower[key].match(/:(.*)/)[1] );
				switch( objectClass ) {
					case "point":
						flower[key] = points.find( object => object.id === objectId ); break;
					case "span":
						flower[key] = spans.find( object => object.id === objectId );
				}
			} else if ( key === "seeds") {
				for ( var j=0; j<flower[key].length; j++) {
					objectId = parseInt( flower[key][j].match(/:(.*)/)[1] );
					flower[key][j] = seeds.find( object => object.id === objectId );
				}
			}
		}
	}
}


function assignSegments( plant ) {
	for ( var i=0; i<plant.segments.length; i++ ) {
		var segment = plant.segments[i];
		for ( var key in segment ) {
			var objectClass, objectId;
			if ( typeof segment[key] === "string" && /^#/.test(segment[key]) ) {
				objectClass = segment[key].match(/#(.*?):/)[1];
				objectId = parseInt( segment[key].match(/:(.*)/)[1] );
				switch( objectClass ) {
					case "point":
						segment[key] = points.find( object => object.id === objectId ); break;
					case "span":
						segment[key] = spans.find( object => object.id === objectId );
				}
			} else if ( key === "skins") {
				for ( var j=0; j<segment[key].length; j++) {
					objectId = parseInt( segment[key][j].match(/:(.*)/)[1] );
					segment[key][j] = skins.find( object => object.id === objectId );
				}
			}
		}
	}
}




/////**** Resume Saved Game ****/////


function resumeSavedGame( retrievedGameData ) {
	parsedData = JSON.parse( retrievedGameData );
	//object collections
	assignPoints();
	assignSpans();
	assignSkins();
	assignSeeds();
	assignPlants();
	sunRays = []; createSunRays();
	pollinationAnimations = [];
	//counters
	pointCount = parsedData.pointCount;
	spanCount = parsedData.spanCount;
	skinCount = parsedData.skinCount;
	seedCount = parsedData.seedCount;
	plantCount = parsedData.plantCount;
	pollinationAnimationCount = 0;
	//settings
	ambientMode = parsedData.ambientMode;
	gameDifficulty = parsedData.gameDifficulty;
	endOfGameAnnouncementDisplayed = parsedData.endOfGameAnnouncementDisplayed;
	//progress
	highestRedFlowerPct = parsedData.highestRedFlowerPct;
	$("#height_number").text( Math.floor( highestRedFlowerPct ) );
	heightMarker = parsedData.heightMarker;
	gameHasBegun = parsedData.gameHasBegun;
	readyForEliminationDemo = parsedData.readyForEliminationDemo;
	readyForChangeDemo = parsedData.readyForChangeDemo;
	eliminationDemoHasBegun = parsedData.eliminationDemoHasBegun;
	changeDemoHasBegun = parsedData.changeDemoHasBegun;
	allDemosHaveRun = parsedData.allDemosHaveRun;
	readyForNextMilestoneAnnouncement = parsedData.readyForNextMilestoneAnnouncement;
	milestoneFirstRedHasBeenRun = parsedData.milestoneFirstRedHasBeenRun;
	milestoneThirdHasBeenRun = parsedData.milestoneThirdHasBeenRun;
	milestoneHalfHasBeenRun = parsedData.milestoneHalfHasBeenRun;
	milestoneTwoThirdsHasBeenRun = parsedData.milestoneTwoThirdsHasBeenRun;
	milestone90HasBeenRun = parsedData.milestone90HasBeenRun;
	gameHasEnded = parsedData.gameHasEnded;
	//time
	worldTime = parsedData.worldTime;
	currentYear = parsedData.currentYear;
	yearTime = parsedData.yearTime;
	currentSeason = parsedData.currentSeason;
	spL = parsedData.spL;  // spring length (varies depending on whether first year)
	suL = parsedData.suL;  // summer length (varies depending on average plant segment count)
	photosynthesisRatio = parsedData.photosynthesisRatio;
	livEnExp = parsedData.livEnExp;
	csbg = parsedData.csbg;  // current season background
	psbg = parsedData.psbg;  // previous season background
	ccs1 = parsedData.ccs1;  // current color stop 1
	ccs2 = parsedData.ccs2;  // current color stop 2
	ccs3 = parsedData.ccs3;  // current color stop 3
	ccs4 = parsedData.ccs4;  // current color stop 4
	//game end display remove & reset
	if ( gameWinFlowerAnimationDisplayed && !gameWinFlowerAnimationComplete) {
		stopGameWinFlowersAnimation = true;  // (clearGameEndDisplays() & replaceGameEndDisplays() handled in runGameWinFlowersAnimation())
	} else {
		clearGameEndDisplays();
		replaceGameEndDisplays();
	}
	//initiation
	$("#landing_page_div, #overlay_game_mode_options_div, #overlay_ambient_mode_options_div").hide();
	$(".icon, #footer_div").show();
	$(".announcement").finish();
	scaleContent();
	initialGeneValueAverages = parsedData.initialGeneValueAverages;
}


function resumeState( game ) {
	resumeSavedGame( game );
	localSavedGameData = {};
	if ( ambientMode ) { displayAmbientModeUI(); } else { displayGameModeUI(); }
	if ( !endOfGameAnnouncementDisplayed ) { pause(); }
	renderBackground();
	renderPlants();
	display();
}
