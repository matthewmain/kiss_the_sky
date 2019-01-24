


//////////////////// UI ////////////////////////


var headerDiv = document.getElementById("header_div");
var footerDiv = document.getElementById("footer_div");




/////---FUNCTIONS---/////

///attaches header and footer to canvas (after canvas has been resized to window dimensions in verlet.js)
function attachHeaderAndFooter() {
  var canvasHeight = parseFloat(canvasContainerDiv.style.height);
  var canvasTop = canvasContainerDiv.offsetTop - canvasHeight/2;
  headerDiv.style.width = canvasContainerDiv.style.width;
  headerDiv.style.height = canvasHeight*0.15+"px";
  headerDiv.style.top = canvasTop-parseFloat(headerDiv.style.height)+"px";
  footerDiv.style.width = canvasContainerDiv.style.width;
  footerDiv.style.height = canvasHeight*0.075+"px";
  footerDiv.style.top = canvasTop+canvasHeight+"px";
}

///updates UI (runs every iteration)
function updateUI() {
  attachHeaderAndFooter();
  renderSunShades();
  $("#year_count").text( currentYear );
  $("#season").text( currentSeason );
  updateSeasonPieChart();
  $("#highest_height").text( highestFlowerPct );
}





/////---INTERACTION---/////


///toggle shadow visibility
$(".shadows_icon").click(function(){
  if ( viewShadows === true ) {
    document.getElementById("shadows_icon_on_svg").style.visibility = "hidden";
    document.getElementById("shadows_icon_off_svg").style.visibility = "visible";
    viewShadows = false;
  } else {
    document.getElementById("shadows_icon_on_svg").style.visibility = "visible";
    document.getElementById("shadows_icon_off_svg").style.visibility = "hidden";
    viewShadows = true;
  }
});

///download canvas screengrab
$("#save").click(function(){
  var image = canvas.toDataURL("image/png");
  console.log(image);
  var download = document.getElementById("save");
  download.href = image;
  var seasonTitleCase = currentSeason.charAt(0).toUpperCase()+currentSeason.slice(1);
  download.download = "Kiss the Sky - Year "+currentYear+", "+seasonTitleCase+".png";
});

///reloads game
$("#restart_icon_svg").click(function() {
  location.reload();
});





