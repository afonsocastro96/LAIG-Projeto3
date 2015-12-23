/* Handle the prolog connection */


function handleReply(data){
	response=JSON.parse(data.target.response); // Access message and show
	console.log(response.answer);
	alert(response.answer);	
}

function makeRequest(request){
	switch(request){
		case 'startgame':
			var requestString = "[startgame," + this.currentBoardType + "]";
			break;
		case 'undo':
			var requestString = "[undo]";
			break;
		case 'sinkstreak':
			var requestString = "[sinkstreak]";
			break;
		case 'botmove':
			var requestString = "[botmove," + this.currentDifficulty + "]";
			break;
		case 'sink':
			var requestString = "[sink," + this.sinkXCoord + "," + this.sinkYCoord + "]";
			break;
		case 'slide':
			var requestString = "[slide," + this.slideStartXCoord + "," + this.slideStartYCoord + "," + this.slideEndXCoord + "," + this.slideEndYCoord + "]";
			break;
		case 'move':
			var requestString = "[move," + this.moveStartXCoord + "," + this.moveStartYCoord + "," + this.moveEndXCoord + "," + this.moveEndYCoord + "]";
			break;
		case 'pass':
			var requestString = "[pass]";
		default:
			return;
	}
	this.postGameRequest(requestString, handleReply);
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