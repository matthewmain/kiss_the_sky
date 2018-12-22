

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
  	do { now = Date.now(); } while ( now - then < milliseconds );
	},

	//creates arc between two points
	arcFromTo: function( startPoint, endPoint, arcHeight ) {
	  var ah = arcHeight;  // arc height as ratio of distance between points
	  var p1 = { x: startPoint.cx, y: startPoint.cy };
	  var p2 = { x: endPoint.cx, y: endPoint.cy };
	  var mp = { x: ( p1.x + p2.x ) / 2, y: ( p1.y + p2.y ) / 2 } ;  // mid point
	  var ccp = { x: mp.x + ( p2.y - p1.y ) * ah, y: mp.y + ( p1.x - p2.x ) * ah };  // curve control point
	  return ctx.quadraticCurveTo( ccp.x, ccp.y, p2.x, p2.y );
	},


};