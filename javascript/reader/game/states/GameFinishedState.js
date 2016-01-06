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
	var filmInfo = JSON.parse(request);
	
	var boardSchema = filmInfo[0];
	var board = new GameBoard(gameSet.scene);
	board.init(boardSchema);
	gameSet.setBoard(board);
	
	var towerSchema = filmInfo[1];
	var towers = [];
	for (var i = 0; i < towerSchema.length; ++i) {
		switch (towerSchema[i][0]) {
			case Connection.lightTower:
				towers.push(new LightTower(gameSet.scene));
				towers[towers.length - 1].setPosition(towerSchema[i][1], towerSchema[i][2]);
				break;
			case Connection.darkTower:
				towers.push(new DarkTower(gameSet.scene));
				towers[towers.length - 1].setPosition(towerSchema[i][1], towerSchema[i][2]);
				break;
		}
	}
	gameSet.setTowers(towers);
}