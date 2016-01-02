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

Connection.startgame = function(target, handler, boardType) {
	makeRequest(target, "[startgame," + boardType + "]", handler);
}