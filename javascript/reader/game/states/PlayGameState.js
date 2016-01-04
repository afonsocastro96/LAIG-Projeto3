function PlayGameState() {
	GameState.call(this);
}

PlayGameState.prototype = Object.create(GameState.prototype);
PlayGameState.prototype.constructor = PlayGameState;

PlayGameState.prototype.init = function(gameSet) {
	this.undoButton = new Marker(gameSet.scene);
	this.undoButton.setText("Undo");
	this.cancelButton = new Marker(gameSet.scene);
	this.cancelButton.setText("Cancel");
	this.sinkStreakPanel = new Marker(gameSet.scene);
	this.numPassLightPanel = new Marker(gameSet.scene);
	this.numPassDarkPanel = new Marker(gameSet.scene);
	this.timerPanel = new Marker(gameSet.scene);
	
	
	this.turnDuration = 30;
	this.lastPlayTime = Date.now();
	
	var gameState = this;
	Connection.finishSetup(gameSet, function(gameSet, request) { gameState.setScore(gameSet, request)});
}

PlayGameState.prototype.display = function(gameSet) {
	gameSet.board.display();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,0,-5);
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

PlayGameState.prototype.displayScoresHUD = function(gameSet) {
	
}

PlayGameState.prototype.update = function(gameSet, currentTime) {
	this.timerPanel.setText(Math.trunc((this.lastPlayTime - currentTime) / 1000).toString());
}

PlayGameState.prototype.setScore = function(gameSet, request) {
	
}