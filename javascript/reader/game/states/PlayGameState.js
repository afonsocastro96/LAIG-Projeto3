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
	
	this.turnDuration = gameSet.turnDuration;
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
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 3.5, -20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		this.timerPanel.display();
	gameSet.scene.popMatrix();
}

PlayGameState.prototype.updateTimer = function(gameSet, currentTime) {
	var timeLeft = this.turnDuration - Math.trunc((currentTime - this.lastPlayTime) / 1000);
	if (timeLeft <= 0) {
		timeLeft = 0;
		console.log("Turn finished");
	}
	this.timerPanel.setText(timeLeft.toString());
}

PlayGameState.prototype.setScore = function(gameSet, request) {
	this.displayHUD = this.displayScoresHUD;
	this.update = this.updateTimer;
	
	this.nextPlay(gameSet);
}

PlayGameState.prototype.nextPlay = function(gameSet) {
	var gameState = this;
	Connection.nextPlay(gameSet, function(target, request) { gameState.pickPlay(target, request)});
}

PlayGameState.prototype.pickPlay = function(gameSet, request) {
	console.log(request);
}