function GameFinishedState() {
	GameState.call(this);
}

GameFinishedState.prototype = Object.create(GameState.prototype);
GameFinishedState.prototype.constructor = GameFinishedState;

GameFinishedState.prototype.init = function(gameSet) {
	this.winner = gameSet.winner;
	this.winReason = gameSet.winReason;
	
	this.newGameButton = new Marker(gameSet.scene);
	this.newGameButton.setText("New Game");
	this.newGamePick = {
		onPick: function() {
			gameSet.setState(new BoardSelectionState());
		}
	};
	
	this.replayButton = new Marker(gameSet.scene);
	this.replayButton.setText("Replay");
	this.replayPick = {
		onPick : function() {
			;
		}
	}
	
	this.winnerPanel = new Marker(gameSet.scene);
	this.winnerPanel.setText(this.winner + " won");
	this.reasonPanel = new Marker(gameSet.scene);
	this.reasonPanel.setText(this.winReason);
	
	console.log("Game finished: " + this.winner + " won by " + this.winReason);
}

GameFinishedState.prototype.display = function(gameSet) {
	gameSet.board.display();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(5,0,0);
		gameSet.scene.rotate(Math.PI / 2, 0, 1, 0);
		gameSet.stack.display();
	gameSet.scene.popMatrix();
	
	for (var i = 0; i < gameSet.towers.length; ++i) {
		var tower = gameSet.towers[i];
		var boardPosition = gameSet.board.getBoardCoordinates(tower.row, tower.col);
		
		gameSet.scene.pushMatrix();
			gameSet.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
			tower.display();
		gameSet.scene.popMatrix();
	}
}

GameFinishedState.prototype.displayHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 3.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		this.winnerPanel.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 2.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		this.reasonPanel.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(-2.5, -2.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		gameSet.scene.registerNextPick(this.replayPick);
		this.replayButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(2.5, -2.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		gameSet.scene.registerNextPick(this.newGamePick);
		this.newGameButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}