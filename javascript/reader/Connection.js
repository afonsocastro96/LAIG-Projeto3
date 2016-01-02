/* Handle the prolog connection */
function handleReply(data){
	response=JSON.parse(data.target.response); // Access message and show	
	console.log(response.answer);
	
	if(replyHandler != undefined){	
		replyHandler(window.targ, response.answer);
		replyHandler = undefined;
		window.targ = undefined;
	}
}

function makeRequest(target, request, handler){
	window.replyHandler = handler;
	window.targ = target;
	postGameRequest(request, handleReply);	
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

Connection.startgame = function(target, handler, boardType) {
	var requestString = "[startgame," + boardType + "]";
	makeRequest(target, requestString, handler);
}

Connection.gamemode = function(target, handler, mode) {
	var requestString = "[gamemode," + mode + "]";
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