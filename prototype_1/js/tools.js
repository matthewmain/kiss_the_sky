

///////// TOOLS.JS /////////



const Tool = {


	//random integer between two numbers (inclusive)
	rib: function( min, max ) {
 		return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
	},

	//random float between two numbers
	rfb: function( min, max ) {
 		return Math.random() * ( max - min ) + min;
	}


};