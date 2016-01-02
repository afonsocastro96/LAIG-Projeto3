function BoardSelectionState(scene) {
	GameState.call(this);
}

BoardSelectionState.prototype = Object.create(GameState.prototype);
BoardSelectionState.prototype.constructor = BoardSelectionState;

BoardSelectionState.prototype.init = function(gameSet) {
	GameState.prototype.init.call(this, gameSet);
	
	this.minorButton = new Marker(gameSet.scene);
	this.minorButton.setText("Syrtis Minor");
	this.majorButton = new Marker(gameSet.scene);
	this.majorButton.setText("Syrtis Major");
	
	var gameState = this;
	
	this.minorPick = {
		onPick: function() {
			gameState.onPick(gameSet,Connection.minorBoard);
		}
	}
	
	this.majorPick = {
		onPick: function() {
			gameState.onPick(gameSet, Connection.majorBoard);
		}
	}
}

BoardSelectionState.prototype.displayHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);

		gameSet.scene.registerNextPick(this.minorPick);
		this.minorButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,-1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		
		gameSet.scene.registerNextPick(this.majorPick);
		this.majorButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

BoardSelectionState.prototype.onPick = function(gameSet, boardType) {
	Connection.startgame(gameSet, this.gameStarted, boardType);
}

BoardSelectionState.prototype.gameStarted = function(gameSet, requestData) {
	var boardSchema = JSON.parse(requestData);
	var board = new GameBoard(gameSet.scene);
	board.init(boardSchema);
	
	gameSet.setBoard(board);
	gameSet.setState(new ModeSelectionState());
}