

///////// TOOLS.JS /////////



const Tool = {


	//random integer between two numbers
	rib: function( min, max ) {
 		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	},

	//random float between two numbers
	rfb: function( min, max ) {
 		return Math.random() * ( max - min ) + min;
	}


};