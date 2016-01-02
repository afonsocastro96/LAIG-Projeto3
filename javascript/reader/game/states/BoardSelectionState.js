function BoardSelectionState(scene) {
	GameState.call(this);
}

BoardSelectionState.prototype = Object.create(GameState.prototype);
BoardSelectionState.prototype.constructor = BoardSelectionState;

BoardSelectionState.prototype.init = function(gameSet) {
	GameState.prototype.init.call(this, gameSet);
	
	this.minorButton = new Marker(gameSet.scene, "Syrtis Minor");
	this.majorButton = new Marker(gameSet.scene, "Syrtis Major");
	
	var gameState = this;
	
	this.minorPick = {
		gameSet: null,
		onPick: function() {
			gameState.onPick(this.gameSet,Connection.minorBoard);
		}
	}
	
	this.majorPick = {
		gameSet: null,
		onPick: function() {
			gameState.onPick(this.gameSet, Connection.majorBoard);
		}
	}
}

BoardSelectionState.prototype.display = function(gameSet) {
	// Nothing to display
}

BoardSelectionState.prototype.displayHUD = function(gameSet) {
	this.minorPick.gameSet = gameSet;
	this.majorPick.gameSet = gameSet;
	
	gameSet.scene.registerNextPick(this.minorPick);
	gameSet.scene.pushMatrix();
	gameSet.scene.translate(0,1,-20);
	gameSet.scene.scale(0.75, 0.75, 0.75);
	this.minorButton.display();
	gameSet.scene.popMatrix();
	gameSet.scene.registerNextPick(this.majorPick);
	gameSet.scene.pushMatrix();
	gameSet.scene.translate(0,-1,-20);
	gameSet.scene.scale(0.75, 0.75, 0.75);
	this.majorButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

BoardSelectionState.prototype.update = function(gameSet, currentTime) {
	// nothing to update
}

BoardSelectionState.prototype.onPick = function(gameSet, boardType) {
	console.log("Selected board: " + boardType);
	
	Connection.startgame(gameSet, this.gameStarted, boardType);
}

BoardSelectionState.prototype.gameStarted = function(gameSet, requestData) {
	var board = JSON.parse(requestData);
	var gameBoard = [];
	for(var row = 0; row < board.length; ++row){
		var currentRow = [];
		for(var col = 0; col < board[row].length; ++col){
			switch(board[row][col][0]){
				case 0:
					currentRow.push(new EmptyTile());
					break;
				case 1:
					if(board[row][col][1] == 3)
						currentRow.push(new WhiteCircleTile(gameSet.scene));
					else
						currentRow.push(new WhiteSquareTile(gameSet.scene));
					break;
				case 2:
					if(board[row][col][1] == 3)
						currentRow.push(new BlackCircleTile(gameSet.scene));
					else
						currentRow.push(new BlackSquareTile(gameSet.scene));
					break;
				default:
					break;
			}
		}
		gameBoard.push(currentRow);
	}
	gameSet.setBoard(new GameBoard(gameSet.scene, gameBoard));
	gameSet.setState(new ModeSelectionState());
}