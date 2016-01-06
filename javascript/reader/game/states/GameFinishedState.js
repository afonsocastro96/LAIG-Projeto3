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
	var state = this;
	this.replayPick = {
		onPick : function() {
			state.getFilm(gameSet);
		}
	}
	
	this.winnerPanel = new Marker(gameSet.scene);
	this.winnerPanel.setText(this.winner + " won");
	this.reasonPanel = new Marker(gameSet.scene);
	this.reasonPanel.setText(this.winReason);
	
	console.log("Game finished: " + this.winner + " won by " + this.winReason);
}

GameFinishedState.prototype.display = function(gameSet) {
	gameSet.displayStatic();
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
		gameSet.scene.translate(-2.5, -3.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		gameSet.scene.registerNextPick(this.replayPick);
		this.replayButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(2.5, -3.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		gameSet.scene.registerNextPick(this.newGamePick);
		this.newGameButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

GameFinishedState.prototype.getFilm = function(gameSet) {
	var state = this;
	Connection.gameFilm(gameSet, function(target, request) {state.displayFilm(target, request)});
}

GameFinishedState.prototype.displayFilm = function(gameSet, request) {
	
}