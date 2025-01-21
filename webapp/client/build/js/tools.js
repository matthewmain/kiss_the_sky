


///////// TOOLS.JS /////////



var Tl = {

	//random integer between two numbers (min/max inclusive)
	rib: function( min, max ) {
 		return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
	},

	//random float between two numbers
	rfb: function( min, max ) {
 		return Math.random() * ( max - min ) + min;
	},

	//random element from array
	refa: function( array ) {
		return array[ Math.floor( Math.random() * array.length ) ];
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
  	do { now = Date.now(); } while ( now - then < milliseconds );
	},

	//draws a simple symmetrical arc between two points
	arcFromTo: function( startPoint, endPoint, arcHeight ) {
	  var ah = arcHeight;  // arc height as ratio of distance between points
	  var p1 = { x: startPoint.cx, y: startPoint.cy };
	  var p2 = { x: endPoint.cx, y: endPoint.cy };
	  var mp = { x: ( p1.x + p2.x ) / 2, y: ( p1.y + p2.y ) / 2 } ;  // mid point
	  var ccp = { x: mp.x + ( p2.y - p1.y ) * ah, y: mp.y + ( p1.x - p2.x ) * ah };  // curve control point
	  return ctx.quadraticCurveTo( ccp.x, ccp.y, p2.x, p2.y );
	},

	///rgba color shift (shifts an rgba color gradually over a designated number of iterations)
	rgbaCs: function( startColor, endColor, currentColor, totalIterations ) {
		var sc = startColor;
		var ec = endColor;
		var cc = currentColor;
		var ti = totalIterations;
		var rsi = (ec.r-sc.r)/ti;  // red shift increment
		var gsi = (ec.g-sc.g)/ti;  // green shift increment
		var bsi = (ec.b-sc.b)/ti;  // blue shift increment
		var asi = (ec.a-sc.a)/ti;  // alpha shift increment
	  var r = Math.abs(ec.r-cc.r) < Math.abs(rsi) ? ec.r : cc.r + rsi;  // redshift
	  var g = Math.abs(ec.g-cc.g) < Math.abs(gsi) ? ec.g : cc.g + gsi;  // greenshift
	  var b = Math.abs(ec.b-cc.b) < Math.abs(bsi) ? ec.b : cc.b + bsi;  // blueshift
	  var a = Math.abs(ec.a-cc.a) < Math.abs(asi) ? ec.a : cc.a + asi;  // alphashift
	  return { r: r, g: g, b: b, a: a };
	},

	///returns an object from an array by object id (requires the object have an "id" key with a unique numerical value)
	obById: function( array, id ) {
		return array.find( x => x.id === id );
	}


};



