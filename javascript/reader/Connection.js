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
	/*switch(request){
		case 'startgame':
			this.startGameHandler();
			break;
		case 'undo':
			var requestString = "[undo]";
			break;
		case 'sinkstreak':

			break;
		case 'botmove':
			
			break;
		case 'sink':
			
			break;
		case 'slide':
			
			break;
		case 'move':
			
			break;
		case 'pass':
			
		default:
			return;
	}*/
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