

///////// TOOLS.JS /////////



const Tl = {


	//random integer between two numbers (min/max inclusive)
	rib: function( min, max ) {
 		return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
	},

	//random float between two numbers
	rfb: function( min, max ) {
 		return Math.random() * ( max - min ) + min;
	},

	//converts radians to degrees
	radToDeg: function( radian ) {
	  return radian * 180 / Math.PI;
	},

	//converts degrees to radians
	degToRad: function( degree ) {
	  return degree / 180 * Math.PI;
	},

	//pauses program
	pause: function( milliseconds ) {
  	var then = Date.now(); 
  	var now;
  	do { now = Date.now() } while ( now - then < milliseconds );
	}


};