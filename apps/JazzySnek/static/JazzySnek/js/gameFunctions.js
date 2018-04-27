/*	DOCUMENTATION:

	STRUCTURE OF THE TILE TAG:
		HTML attributes of a tile (which is a span) have relevance for the game's mechanics.
			ID:  Two-digit number representing its mapped X, Y coordinates from the upper-left corner.
			Name:  Who it belongs to.
		
	ADDITIONAL FEATURES:
		Premature Stop:  Player who has a current turn cannot move.
		Reset function
		AI:  Prioritize completing a whole row.

*/


$(document).ready(function(){
	// Master Controller
	$(".tile").click(function(event){
		// if(!checkFreeze("J")) {		// if the game is NOT frozen on J's turn, execute his turn.
			var coords = getCoords(event);
			var owner = checkOwner(coords);
			var eval = evalMove(coords, "J");
			if (eval[0]) {
				//	Perform JazzySnek's move!!!
				var moveScore = doMove(coords, eval[1], "J")
				//	Randomize the border tiles.
				updateScore()
				randomizeBorder();
				updateAIMoves(coords, "J")	//	AI decision dictionary.
				//	Perform Spidey's Move!
				// if(!checkFreeze("S")) {
					var analysis = AITurnAnalysisDict("S");
					var enemyMove = AIDecision(analysis);
					eval = evalMove(enemyMove, "S")
					setTimeout(function() {
						moveScore = doMove(enemyMove, eval[1], "S")
						updateScore()
					}, 1000);
					updateAIMoves(enemyMove, "S")	//	AI decision dictionary.
					// if(gameOver()) {
					// 	gameOverProtocol()	
					// }
				// }
				// else if(gameOver()) {
				// 	gameOverProtocol()
				// }
			}
		// }
		// else {
			// if(gameOver()) {
			// 	gameOverProtocol()
			// }
			// else {
			// 	var analysis = AITurnAnalysisDict("S");
			// 	var enemyMove = AIDecision(analysis);
			// 	eval = evalMove(enemyMove, "S")
			// 	setTimeout(function() {
			// 		moveScore = doMove(enemyMove, eval[1], "S")
			// 		updateScore()
			// 	}, 1000);
			// 	updateAIMoves(enemyMove, "S")	//	AI decision dictionary.
			// 	if(gameOver()) {
			// 		gameOverProtocol()
			// 	}
			// }
		// }
		if(gameOver()) {
			gameOverProtocol()
		}
	});




	function gameOverProtocol() {
		var score = $("#JazzyScore").text()
		$("#finalScore").text(score)
		console.log("Game over!!!")
	}

	function gameOver() {
		JScore = parseInt($("#JazzyScore").text())
		SScore = parseInt($("#SpideyScore").text())
		return (JScore + SScore == 64)
	}

	function checkFreeze(player) {
		checkMoves = Object.keys(AITurnAnalysisDict(player))
		if (checkMoves == []) {
			return true;
		}
		else {
			return false;
		}
	}

	function updateScore() {
		JScore = 0;
		SScore = 0;
		for(var i = 1; i < 9; i++) {
			for(var j = 1; j < 9; j++) {
				if (gameFloorMap[i][j] == 3) {
					JScore++;
				}
				else if (gameFloorMap[i][j] == 5) {
					SScore++;
				}
			}
		}
		$("#JazzyScore").text(JScore)
		$("#SpideyScore").text(SScore)
	}

	function AIDecision(analysis) {
		var keys = Object.keys(analysis)	//	Retrieve the keys from the dict.
		bestKey = keys[0]					//  Initialize the best key with the first key in the dict.
		bestScore = analysis[bestKey]		// 	Initialize the best score with value of the first key
		for (var i = 1; i < keys.length; i++) {
			if (analysis[ keys[i] ] > bestScore) {
				bestKey = keys[i]
				bestScore = analysis[ keys[i] ]
			}
		}
		return parseIDCoords(bestKey);
	}

	/*	FUNCTION:  Populate a dictionary with an AI's analysis of his moves for the turn.
			Iterates across the array of possible moves, calculating the score for each one.
		INPUT:  None.
		OUTPUT:  movesDict dictionary.  Keys are the tile IDs of possible moves (i.e. "#14")
			Values are the evaluation scores.
	*/
	function AITurnAnalysisDict(player) {
		//		*Moves that have fewer free tiles around it get a bonus (defensive!).
		//			*Put some more thought into this one.
		//		*Moves that have fewer unconverted tiles around it get a bonus (defensive!)
		//			*Put some more thought into this one.
		//		*Moves that produce less good moves for the human player get a bonus (advanced).
		var borderMult = 1.5, borderBonus = 1;	// Multiplier and bonus for this condition.
		var movesDict = {}
		var move = "", coords = [], eval = [];
		for (var i = 0; i < possibleMoves.length; i++) {
			move = possibleMoves[i];
			coords = parseIDCoords(move);
			evaluation = evalMove(coords, player);
			//	Disregard any move that returns a score of 0.  Push those moves into a dictionary
			if (evaluation[0] > 0) {
				movesDict[move] = evaluation[0];
			}
		}
		var keys = Object.keys(movesDict)	//	Retrieve the keys from the dict.
		//	AI ADJUSTMENTS:  
		//	*Moves that place the tile against a Border or in a Corner get higher priority.
		for (var i = 0; i < keys.length; i++) {
			key = keys[i]
			coords = parseIDCoords(key)
			if (againstBorder(coords)) {
				movesDict[key] *= borderMult
				movesDict[key] += borderBonus
			}
		}
		//	Add random float value to the scores (randomize just a bit)
		for (var i = 0; i < keys.length; i++) {
			key = keys[i]
			randNum = Math.random() + Math.random() - Math.random()
			movesDict[key] += randNum
		}		
		return movesDict
	}

	/*	FUNCTION:  Checks if the move coordinate is placed against a border tile.
		INPUT:  
			coords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
		OUTPUT:  Boolean.
	*/	
	function againstBorder(coords) {
		return (coords[0] == 1 || coords[0] == 8 || coords[1] == 0 || coords[1] == 8 );
	}


	/*	FUNCTION:  Keep a running tally of possible places for the AI to evaluate where he might move.
			Eliminates a lot of for loops and keeps AI from having to check a good bunch of illegal tiles.
			This function is meant to be executed with each move.
		INPUT:  
			coords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
		OUTPUT:  None.
	*/	
	function updateAIMoves(coords, player) {
		var coordID = "#" + coords[0] + coords[1];
		var y = 0, x = 0;
		var index = possibleMoves.indexOf(coordID);
		if (index >= 0) { possibleMoves.splice(index, 1) }	// Pop the newly placed coordinate move from the list of possible moves.
		//	If the player is JazzySnek, all empty squares around the coordinate are now legal as well.
		//  NEW VERSION:  Algorithm corrected to remove this if statement.  Now the AI possible moves will include
		//	surrounding empty squares for Spidey's placed tiles as well.
		var increment = [], direction = "";
		for (var i = 0; i < directions.length; i++) {
			direction = directions[i]	//	Cardinal direction, i.e. "NW"
			increment = directionDict[direction]	//	Increment for that direction, i.e. [ -1, -1 ]
			y = coords[0] + increment[0]
			x = coords[1] + increment[1]
			coordID = "#" + y + x
			index = possibleMoves.indexOf(coordID);
			if (index == -1) { 
				if($(coordID).attr("name") == "N") {
					possibleMoves.push(coordID)
				}
			}
		}
	}

	/*	FUNCTION:  Randomizes the borders.
			Will alter their class and name attributes to assign the value to a random player.
		INPUT:  None.
		OUTPUT:  None.
	*/	
	function randomizeBorder() {
		var rand = 0
		var elemID = ""
		for (var i = 0; i < borders.length; i++) {
			rand = Math.random()
			elemID = borders[i]
			$(elemID).removeClass();
			if (rand < 0.5) {
				$(elemID).addClass("bord1");
				$(elemID).addClass("bord");
				$(elemID).attr("name", "J")
			}
			else {
				$(elemID).addClass("bord2");
				$(elemID).addClass("bord");
				$(elemID).attr("name", "S")				
			}
		}
	}

	/*	FUNCTION:  High-level function that will attack all vectors from a given move list.
			*Uses takeVector
			*Will move the character's sprite to the correct location.
		INPUT:  
			coords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
			moveList:  a list of cardinal dirctions representing legal moves.
			player:  "N" for neutral, "J" for JazzySnek, "S" for Spidey.
		OUTPUT:  None.
	*/	
	function doMove(coords, moveList, player) {
		var playerClass = "";
		var score = 0
		if (player == "J") { playerClass = ".JazzySnek" }
		else { playerClass = ".SpideyLegs" }
		for (var i = 0; i < moveList.length; i++) {
			score += takeVector(coords, moveList[i], player)
			$(playerClass).css("margin-top", coords[0]*60)
			$(playerClass).css("margin-left", coords[1]*60)
		}
		return score;
	}

	/*	FUNCTION:  High-level function that converts all tiles from a coordinate, along a direction.
			Will execute the following:
				*Change the HTML element's class to match the owner's colors (through CSS)
				*Animate the new color
				*Alter the name attribute to confirm that the new player owns it.
				*Return the score from the move. 
		INPUT:  
			inputCoords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
			direction:  1-2 char String representing cardinal direction, such as "NW" for Northwest
			player:  "N" for neutral, "J" for JazzySnek, "S" for Spidey.
		OUTPUT:  Score gained.  An integer.
	*/
	function takeVector(inputCoords, direction, player) {
		var classes = ["tile6", "tile5", "tile4", "tile3", "tile2", "tile1"];
		var coords = inputCoords.slice();
		var vectIncrement = directionDict[direction];	//	Get vector for direction.
		var score = 0;	// Score for placing the tile.
		var coordID = "";
		var newClass = "";
		var newMap = 0;
		var newColor = ""
		if (player == "J") { newClass = "tile3" ; newMap = 3 ; newColor = "#2e9512" }
		else if (player == "S") { newClass = "tile5" ; newMap = 5 ; newColor = "#bd11cc" }
		while ( coords[0] > 0 && coords[1] > 0 && coords[0] < 9 && coords[1] < 9 ) {
			// While the tile being investigated is within the dance floor (NOT on the border)
			coordID = "#" + coords[0] + coords[1]
			for (var i = 0; i < classes.length; i++) {
				$(coordID).removeClass();
				$(coordID).addClass(newClass);
				$(coordID).addClass("tile");
				$(coordID).animate({ backgroundColor: newColor });
				$(coordID).attr("name", player);
				gameFloorMap[coords[0]][coords[1]] = newMap;
				score++;
				break;
			}
			coords[0] += vectIncrement[0]	//	Incrementing position in given direction.
			coords[1] += vectIncrement[1]
			if (checkOwner(coords) == player) {	// If you hit a tile you own, that's it!
				break;
			}
		}
		return score;
	}

	/*	FUNCTION:  High-level function that evaluates the score that will result from this move,
			along with all legal attack vectors.
		INPUT:  
			coords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
			player:  "N" for neutral, "J" for JazzySnek, "S" for Spidey.
		OUTPUT:  [score, vectors].  Score to be gained, all legal attack vectors in the form of 
			a list of 1-2 char Strings representing cardinal directions, such as "NW" for Northwest
	*/
	function evalMove(coords, player) {
	/*	Tabulates and returns the points earned & legal vectors  when placing a move here.
			0 means illegal move.  Positive # means a legal move.
	*/
		var score = 0;
		var vectors = []
		for (var i = 0; i < 8; i++) {
			var direction = directions[i];
			var vectorScore = checkVector(coords, direction, player);
			if (vectorScore > 0) {
				score += vectorScore
				vectors.push(direction)
			}
		}
		return [score, vectors];
	}

	/*	FUNCTION:  Tabulates and returns the score from placing square at a given coordinate, checking one direction.
			If the score returned is 0, this is not a legitimate move.
		INPUT:  
			inputCoords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
			direction:  1-2 char String representing cardinal direction, such as "NW" for Northwest
			player:  "N" for neutral, "J" for JazzySnek, "S" for Spidey.
		OUTPUT:  Score gained from the attacking from this direction.  If the score returned is 0, this is not a 
			legitimate attack vector.
	*/
	function checkVector(inputCoords, direction, player) {
		var coords = inputCoords.slice()	// COPY the input coordinates. Don't want to modify the inputCoords object!
		var owner = checkOwner(coords)
		if (owner != "N") {		//	If the space we're evaluating to place a tile is not free, return 0.
			return 0;
		}
		else {
			var score = 0;			
			var vectIncrement = directionDict[direction]	//	Get vector for direction.
			coords[0] += vectIncrement[0]	//	Incrementing position in given direction.
			coords[1] += vectIncrement[1]
			while ( coords[0] > 0 && coords[1] > 0 && coords[0] < 9 && coords[1] < 9 ) {
				// While the tile being investigated is within the dance floor (NOT on the border)
				if (checkOwner(coords) == "N") {	// Vector cannot end on an empty space.
					score = 0;
					break;
				}
				else if (checkOwner(coords) == player) {	// If you hit a tile you own, that's it!
					break;
				}
				else {		// If you hit a tile your enemy owns, increment the score.
					score++;
				}
				coords[0] += vectIncrement[0]	//	Incrementing position in given direction.
				coords[1] += vectIncrement[1]
			}
			// Outside the while loop... we've hit the border!
			if (checkOwner(coords) == player) {
				if (score > 0) {	//	Increment score for placing the tile if everything else is legit.
					score++;
				}
				return score
			}
			else {
				return 0;
			}
		}
	}

	/*	FUNCTION:  Identifies the owner of an element at a particular set of y,x gameFloorMap coordinates.
		INPUT:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
		OUTPUT:  "N" for neutral, "J" for JazzySnek, "S" for Spidey.
	*/
	function checkOwner(coords) {
		var y = coords[0];
		var x = coords[1];
		var tile = gameFloorMap[y][x]
		if (tile == 1 || tile == 2) {
			return "N"
		}
		else if (tile == 3 || tile == 4) {
			return "J"
		} 
		else if (tile == 5 || tile == 6) {
			return "S"
		}
		else {
			var id = "#" + y + x
			return $(id).attr("name")
		}
	}

	/*	FUNCTION:  Used within a click function to get the map coordinates of the elment that is clicked.
			This value is derived from the HTML id attribute.
		INPUT:  "event."
		OUTPUT:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
	*/
	function getCoords(event) {
		var yCoord = parseInt(event.target.id[0])
		var xCoord = parseInt(event.target.id[1])
		return [yCoord, xCoord]
	}

	function parseIDCoords(id) {
		var yCoord = parseInt(id[1])
		var xCoord = parseInt(id[2])
		return [yCoord, xCoord]
	}


});


//  Array representation of the dance floor.  Will be altered with each move.
var gameFloorMap = [
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

//	Dictionary of cardinal directions and their associated increments.
directionDict = { 
	"N":  [ -1, 0 ], "NE":  [ -1, 1 ], "E":  [ 0, 1 ], "SE":  [ 1, 1 ], 
	"S":  [ 1, 0 ], "SW":  [ 1, -1 ], "W":  [ 0, -1 ], "NW":  [ -1, -1 ] 
}

//	Array of cardinal directions.
directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

//	Array map of border tiles.
borders = [ "#00", "#01", "#02", "#03", "#04", "#05", "#06", "#07", "#08", 
			"#09", "#10", "#20", "#30", "#40", "#50", "#60", "#70", "#80", 
			"#19", "#29", "#39", "#49", "#59", "#69", "#79", "#89", "#90", 
			"#91", "#92", "#93", "#94", "#95", "#96", "#97", "#98", "#99" ]

//	Array map of possible moves... free spaces adjacent to placed tiles.
//		Subject to alteration as the game goes on.
possibleMoves = [ "#33", "#34", "#35", "#36", "#43", "#46", "#53", "#56", "#63", "#64", "#65", "#66"]









//			CODE GRAVEYARD

/*

		FUNCTION:  Keep a running tally of possible places for the AI to evaluate where he might move.
			Eliminates a lot of for loops and keeps AI from having to check a good bunch of illegal tiles.
			This function is meant to be executed with each move.
		INPUT:  
			coords:  [y,x] coordinates.  Y and X are integers from 1 to 8, with origin at top left corner.
		OUTPUT:  None.
		
	function updateAIMoves(coords, player) {
		var coordID = "#" + coords[0] + coords[1];
		var y = 0, x = 0;
		var increment = [], direction = "";
		var index = possibleMoves.indexOf(coordID);
		if (index >= 0) { possibleMoves.splice(index, 1) }
		//	If the player is JazzySnek, all empty squares around the coordinate are now legal as well.
		if (player = "J") {
			for (var i = 0; i < directions.length; i++) {
				direction = directions[i]	//	Cardinal direction, i.e. "NW"
				increment = directionDict[direction]	//	Increment for that direction, i.e. [ -1, -1 ]
				y = coords[0] + increment[0]
				x = coords[1] + increment[1]
				coordID = "#" + y + x
				index = possibleMoves.indexOf(coordID);
				if (index == -1) { 
					if($(coordID).attr("name") == "N") {
						possibleMoves.push(coordID)
					}
				}
			}
		}
	}


*/


















