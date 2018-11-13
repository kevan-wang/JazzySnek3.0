/*	DOCUMENTATION:

		STRUCTURE OF THE TILE TAG:
			HTML attributes of a tile (which is a span) have relevance for the game's mechanics.
				ID:  Two-digit number representing its mapped X, Y coordinates from the upper-left corner.
				Name:  Who it belongs to.
*/


$(document).ready(function(){
	prepFloor()
	window.setInterval(changeColors, 500)	// Changes the tile colors periodically.

	function prepFloor() {
	// Prepares the dance floor background
		/* STRUCTURE OF THE TILE TAG:
			Regardless of the element, its html attributes have relevance for the game's mechanics.
				ID:  Two-digit number representing its mapped X, Y coordinates from the upper-left corner.
				Name:  Who it belongs to.
		*/
		var tileDict = {
			1: tile1, 2: tile2, 3: tile3, 4: tile4,
			5: tile5, 6: tile6, 8: bord1, 9: bord2 
		}
		var elemNum = 0;
		var elem = "";
		var x = 1
		// Populate the dancefloor with tile and border elements.
		for (var i = 0; i <= 9; i++) {
			for (var j = 0; j <= 9; j++) {
				elemNum = danceFloorMap[i][j];
				elem = tileDict[elemNum];
				elem = elem.replace("id=''", "id='" + i + j + "'");
				$("#danceFloor").append(elem);
			}
		}
		newColors = randomColorPair()
		$(".tile1").css("background-color", newColors[0]);
		$(".tile2").css("background-color", newColors[1]);
	}

	// Change the colors of the floor randomly using legal colors from the map (no green or purple).
	function changeColors() {
		newColors = randomColorPair()
		$( ".tile1" ).animate({
			backgroundColor: newColors[0]
		});
		$( ".tile2" ).animate({
			backgroundColor: newColors[1]
		});
	}
});

// Returns a random hexidecimal color string.
function randomColorPair() {
	var randNum1 = Math.floor(Math.random()*28);
	var randNum2 = (randNum1 + 8 + Math.floor(Math.random()*12)) % 27;
	colors = [ floorColors[randNum1], floorColors[randNum2] ];
	return colors
}

var tile1 = "<span id='' class='tile1 tile' name='N'></span>";	// Neutral tile, does not belong to anyone.
var tile2 = "<span id='' class='tile2 tile' name='N'></span>";	// Neutral tile, does not belong to anyone.
var tile3 = "<span id='' class='tile3 tile' name='J'></span>";	// Neutral tile, does not belong to anyone.
var tile4 = "<span id='' class='tile4 tile' name='J'></span>";	// Neutral tile, does not belong to anyone.
var tile5 = "<span id='' class='tile5 tile' name='S'></span>";	// Neutral tile, does not belong to anyone.
var tile6 = "<span id='' class='tile6 tile' name='S'></span>";	// Neutral tile, does not belong to anyone.
var bord1 = "<span id='' class='bord1' name='J'></span>";	// JazzySnek's border tile.  Green dot.
var bord2 = "<span id='' class='bord2' name='S'></span>";	// SpideySlick's border tile.  Purple dot.

var danceFloorMap = [
		[ 8, 9, 8, 9, 8, 9, 8, 9, 8, 9 ],	// Row 0
		[ 9, 2, 1, 2, 1, 2, 1, 2, 1, 8 ],
		[ 8, 1, 2, 1, 2, 1, 2, 1, 2, 9 ],
		[ 9, 2, 1, 2, 1, 2, 1, 2, 1, 8 ],
		[ 8, 1, 2, 1, 3, 5, 2, 1, 2, 9 ],
		[ 9, 2, 1, 2, 5, 3, 1, 2, 1, 8 ],
		[ 8, 1, 2, 1, 2, 1, 2, 1, 2, 9 ],
		[ 9, 2, 1, 2, 1, 2, 1, 2, 1, 8 ],
		[ 8, 1, 2, 1, 2, 1, 2, 1, 2, 9 ],
		[ 9, 8, 9, 8, 9, 8, 9, 8, 9, 8 ],	// Row 9
	]

var floorColors = [
	"#ff3080", "#ff3060", "#ff3040", "#ff3020", "#ff3000", "#ff2030", "#ff4030", 
	"#ff6030", "#ff8030", "#ffa030", "#ffc030", "#ffe030", "#ffff30", "#e0ff30", 
	"#c0ff30", "#30ffff", "#30e0ff", "#30c0ff", "#30a0ff", "#3080ff", "#3060ff", 
	"#3040ff", "#3020ff", "#3030ff", "#2030ff", "#4030ff", "#6030ff", "#8030ff"
]	// Should be brighter





//			CODE GRAVEYARD

/*


	function prepFloor() {
	// Prepares the dance floor background
		 STRUCTURE OF THE TILE TAG:
			Regardless of the element, its html attributes have relevance for the game's mechanics.
				ID:  Two-digit number representing its mapped X, Y coordinates from the upper-left corner.
				Name:  Who it belongs to.
		
		var tileDict = {
			1: tile1, 2: tile2, 3: tile3, 4: tile4,
			5: tile5, 6: tile6, 8: bord1, 9: bord2 
		}
		var elemNum = 0;
		var elem = "";
		var x = 1
		// Populate the dancefloor with tile and border elements.
		for (var i = 0; i <= 9; i++) {
			for (var j = 0; j <= 9; j++) {
				elemNum = danceFloorMap[i][j];
				elem = tileDict[elemNum];
				elem = elem.replace("id=''", "id='" + i + j + "'");
				$("#danceFloor").append(elem);
			}
		}
		newColors = randomColorPair()
		$(".tile1").css("background-color", newColors[0]);
		$(".tile2").css("background-color", newColors[1]);
	}


$(document).ready(function(){
	// Prepares the dance floor background
	for(i = 0; i < 32; i++) {
		var tile1 = "<span class='tile1'></span>"
		var tile2 = "<span class='tile2'></span>"
		if (Math.floor(i/4) % 2 == 0) {
			$("#danceFloor").append(tile1);
			$("#danceFloor").append(tile2);
		}
		else {
			$("#danceFloor").append(tile2);
			$("#danceFloor").append(tile1);
		}
	}
	$(".tile1").css("background-color", randomColor("00"));
	$(".tile2").css("background-color", randomColor("ff"));


	window.setInterval(changeColors, 500)

	function changeColors() {
		$( ".tile1" ).animate({
			color: randomColor(),
			backgroundColor: randomColor("00")
		});
		$( ".tile2" ).animate({
			color: randomColor(),
			backgroundColor: randomColor("ff")
		});
	}

function randomColor(hexhex) {
	var randNum1 = Math.floor(Math.random()*16);
	var randNum2 = Math.floor(Math.random()*16);
	var randColorArr = ["ff", hexhex, hexVal[randNum1] + hexVal[randNum2]];
	for(i = 0; i < 3; i++) {
		var j = Math.floor(Math.random()*3);
		var temp = randColorArr[i];
		randColorArr[i] = randColorArr[j];
		randColorArr[j] = temp;
		return "#" + randColorArr[0] + randColorArr[1] + randColorArr[2];
	}
}

});

var floorColors = [
	"#ff0080", "#ff0060", "#ff0040", "#ff0020", "#ff0000", "#ff2000", "#ff4000", 
	"#ff6000", "#ff8000", "#ffa000", "#ffc000", "#ffe000", "#ffff00", "#e0ff00", 
	"#c0ff00", "#00ffff", "#00e0ff", "#00c0ff", "#00a0ff", "#0080ff", "#0060ff", 
	"#0040ff", "#0020ff", "#0000ff", "#2000ff", "#4000ff", "#6000ff", "#8000ff"
]

*/


















