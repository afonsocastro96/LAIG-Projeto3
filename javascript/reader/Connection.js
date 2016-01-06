/**
 * Handle prolog reply
 * @param data {Object} connection reply.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
function handleReply(data, target, handler){
	response=JSON.parse(data.target.response);
	
	if(handler != undefined){
		handler(target, response.answer);
	}
}

/**
 * Make request to prolog server
 * @param target {Object} object to be sent to the handler function.
 * @param request {String} request to make.
 * @param handler {Function} handler function.
 */
function makeRequest(target, request, handler){
	postGameRequest(request, function (data) { handleReply(data, target, handler); });	
}

/**
 * Make post request to prolog server.
 * @param requestString {String} request to make.
 * @param onSuccess {Function} function to be called on success.
 * @param onError {Function} function to be called on error.
 */
function postGameRequest(requestString, onSuccess, onError)
{
	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));
}

Connection = new Object();

Connection.minorBoard = 0;
Connection.majorBoard = 1;

Connection.humanVsHumanMode = "'HvH'";
Connection.humanVsMachineMode = "'HvM'";
Connection.machineVsMachineMode = "'MvM'";

Connection.easyDifficulty = 0;
Connection.hardDifficulty = 1;

Connection.tileEmpty = 0;
Connection.tileWhite = 1;
Connection.tileBlack = 2;
Connection.tileCircle = 3;
Connection.tileSquare = 4;

Connection.lightTower = 0;
Connection.darkTower = 1;
Connection.gameFinished = 2;

Connection.light = "'light'";
Connection.dark = "'dark'";

Connection.sinkCode = 0;
Connection.slideCode = 1;
Connection.moveCode = 2;
Connection.passCode = 3;
Connection.raiseCode = 4;
Connection.botActionCode = 0;

Connection.players = ["Light", "Dark"];

Connection.winReasons = [
	"Quicksand", "Double Island", "Completed Island",
	"Double Pass", "Four Passes"
	];

/**
 * Start syrtis game.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param boardType {Integer} board type.
 */
Connection.startgame = function(target, handler, boardType) {
	var requestString = "[startgame," + boardType + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Select game mode.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param mode {String} game mode.
 */
Connection.gamemode = function(target, handler, mode) {
	var requestString = "[gamemode," + mode + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Set difficulty.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param difficulty {Integer} game difficulty.
 */
Connection.setDifficulty = function(target, handler, difficulty) {
	var requestString = "[setDifficulty," + difficulty + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Setup towers.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.setupTowers = function(target, handler) {
	var requestString = "[setuptowers]";
	makeRequest(target, requestString, handler);
}

/**
 * Add tower to the board.
 * @param tower {String} player tower.
 * @param row {Integer} tower row.
 * @param col {Integer} tower column.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.addTower = function(tower, row, col, target, handler) {
	var requestString = "[addtower," + tower + "," + row + "," + col + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Get game towers.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.getTowers = function(target, handler) {
	var requestString = "[gettowers]";
	makeRequest(target, requestString, handler);
}

/**
 * Finish game setup.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.finishSetup = function(target, handler) {
	var requestString = "[finishsetup]";
	makeRequest(target, requestString, handler);
}

/**
 * Request next play.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.nextPlay = function(target, handler) {
	var requestString = "[nextplay]";
	makeRequest(target, requestString, handler);
}

/**
 * Sink tile.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param row {Integer} tile row.
 * @param col {Integer} tile column.
 */
Connection.sink = function(target, handler, row, col) {	
	var requestString = "[sink," + row + "," + col + "]";
	makeRequest(target, requestString, handler); 
}

/**
 * Slide tile.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param startRow {Integer} start row.
 * @param startCol {Integer} start column.
 * @param finalRow {Integer} end row.
 * @param finalCol {Integer} end column.
 */
Connection.slide = function(target, handler, startRow, startCol, finalRow, finalCol) {
	var requestString = "[slide," + startRow + "," + startCol + "," + finalRow + "," + finalCol + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Move tower.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 * @param startRow {Integer} start row.
 * @param startCol {Integer} start column.
 * @param finalRow {Integer} end row.
 * @param finalCol {Integer} end column.
 */
Connection.move = function(target, handler, startRow, startCol, finalRow, finalCol) {
	var requestString = "[move," + startRow + "," + startCol + "," + finalRow + "," + finalCol + "]";
	makeRequest(target, requestString, handler);
}

/**
 * Pass turn.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.pass = function(target, handler) {
	var requestString = "[pass]";
	makeRequest(target, requestString, handler);
}

/**
 * Request bot action.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.botAction = function(target, handler) {
	var requestString = "[botaction]";
	makeRequest(target, requestString, handler);
}

/**
 * Undo last human play.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.undo = function(target, handler) {
	var requestString = "[undo]";
	makeRequest(target, requestString, handler);
}

/**
 * Reques game film.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.gameFilm = function(target, handler) {
	var requestString = "[gamefilm]";
	makeRequest(target, requestString, handler);
}

/**
 * Get current score.
 * @param target {Object} object to be sent to the handler function.
 * @param handler {Function} handler function.
 */
Connection.getScore = function(target, handler) {
	var requestString = "[getscore]";
	makeRequest(target, requestString, handler);
}

/**
 * Parse tile info.
 * @param colourCode {Integer} tile colour code.
 * @param shapeCode {Integer} tile shape code.
 * @param scene {CGFscene} scene the tile belongs to.
 * @return {BoardTile} returns board tile corresponding to codes.
 */
Connection.parseTile = function(colourCode, shapeCode, scene) {
	if (colourCode == Connection.tileBlack) {
		if (shapeCode == Connection.tileCircle) {
			return new BlackCircleTile(scene);
		}
		if (shapeCode == Connection.tileSquare) {
			return new BlackSquareTile(scene);
		}
	}
	
	if (colourCode == Connection.tileWhite) {
		if (shapeCode == Connection.tileCircle) {
			return new WhiteCircleTile(scene);
		}
		if (shapeCode == Connection.tileSquare) {
			return new WhiteSquareTile(scene);
		}
	}
}