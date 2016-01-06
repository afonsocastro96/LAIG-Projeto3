/* Handle the prolog connection */
function handleReply(data, target, handler){
	response=JSON.parse(data.target.response);
	
	if(handler != undefined){
		handler(target, response.answer);
	}
}

function makeRequest(target, request, handler){
	postGameRequest(request, function (data) { handleReply(data, target, handler); });	
}

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

Connection.startgame = function(target, handler, boardType) {
	var requestString = "[startgame," + boardType + "]";
	makeRequest(target, requestString, handler);
}

Connection.gamemode = function(target, handler, mode) {
	var requestString = "[gamemode," + mode + "]";
	makeRequest(target, requestString, handler);
}

Connection.setDifficulty = function(target, handler, difficulty) {
	var requestString = "[setDifficulty," + difficulty + "]";
	makeRequest(target, requestString, handler);
}

Connection.setupTowers = function(target, handler) {
	var requestString = "[setuptowers]";
	makeRequest(target, requestString, handler);
}

Connection.addTower = function(tower, row, col, target, handler) {
	var requestString = "[addtower," + tower + "," + row + "," + col + "]";
	makeRequest(target, requestString, handler);
}

Connection.getTowers = function(target, handler) {
	var requestString = "[gettowers]";
	makeRequest(target, requestString, handler);
}

Connection.finishSetup = function(target, handler) {
	var requestString = "[finishsetup]";
	makeRequest(target, requestString, handler);
}

Connection.nextPlay = function(target, handler) {
	var requestString = "[nextplay]";
	makeRequest(target, requestString, handler);
}

Connection.sink = function(target, handler, row, col) {	
	var requestString = "[sink," + row + "," + col + "]";
	makeRequest(target, requestString, handler); 
}

Connection.slide = function(target, handler, startRow, startCol, finalRow, finalCol) {
	var requestString = "[slide," + startRow + "," + startCol + "," + finalRow + "," + finalCol + "]";
	makeRequest(target, requestString, handler);
}

Connection.move = function(target, handler, startRow, startCol, finalRow, finalCol) {
	var requestString = "[move," + startRow + "," + startCol + "," + finalRow + "," + finalCol + "]";
	makeRequest(target, requestString, handler);
}

Connection.pass = function(target, handler) {
	var requestString = "[pass]";
	makeRequest(target, requestString, handler);
}

Connection.botAction = function(target, handler) {
	var requestString = "[botaction]";
	makeRequest(target, requestString, handler);
}

Connection.undo = function(target, handler) {
	var requestString = "[undo]";
	makeRequest(target, requestString, handler);
}

Connection.gameFilm = function(target, handler) {
	var requestString = "[gamefilm]";
	makeRequest(target, requestString, handler);
}

Connection.getScore = function(target, handler) {
	var requestString = "[getscore]";
	makeRequest(target, requestString, handler);
}

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