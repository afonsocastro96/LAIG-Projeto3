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
	
	this.playerPanel = new Marker(gameSet.scene);
	this.sinkStreakPanel = new Marker(gameSet.scene);
	this.passesPanel = new Marker(gameSet.scene);
	
	this.winnerPanel = new Marker(gameSet.scene);
	this.winnerPanel.setText(this.winner + " won");
	this.reasonPanel = new Marker(gameSet.scene);
	this.reasonPanel.setText(this.winReason);
}

GameFinishedState.prototype.displayStatic = function(gameSet) {
	gameSet.displayStatic();
}

GameFinishedState.prototype.display = GameFinishedState.prototype.displayStatic;

GameFinishedState.prototype.displayAnimated = function(gameSet) {
	gameSet.displayAnimated();
}

GameFinishedState.prototype.displayWinHUD = function(gameSet) {
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

GameFinishedState.prototype.displayHUD = GameFinishedState.prototype.displayWinHUD;


GameFinishedState.prototype.getFilm = function(gameSet) {
	var state = this;
	Connection.gameFilm(gameSet, function(target, request) {state.displayFilm(target, request)});
}

GameFinishedState.prototype.displayScoresHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 3.5, -20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		this.playerPanel.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, -3, -20);
		gameSet.scene.scale(0.25, 0.25, 0.25);
		this.sinkStreakPanel.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, -3.5, -20);
		gameSet.scene.scale(0.25, 0.25, 0.25);
		this.passesPanel.display();
	gameSet.scene.popMatrix();
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
	
	var plays = filmInfo[2];
	var sinkStreaks = filmInfo[3];
	var passes = filmInfo[4];
	var player = Connection.players[1];
	
	
	this.update = function(gameSet, currTime) {
		if (!gameSet.animating) {
			if (plays.length == 0) {
				gameSet.setState(new GameFinishedState);
				return;
			}

			if (player == Connection.players[0]) {
				player = Connection.players[1];
			} else {
				player = Connection.players[0];
			}
			this.playerPanel.setText(player);
			
			var sinkStreakInfo = sinkStreaks.pop();
			var streaker = Connection.players[sinkStreakInfo[0]];
			var sinkStreak = sinkStreakInfo[1];
			
			var passInfo = passes.pop();
			var passWhite = passInfo[Connection.lightTower];
			var passBlack = passInfo[Connection.darkTower];
			
			
			this.sinkStreakPanel.setText("Sink Streak: " + streaker + sinkStreak.toString());
			this.passesPanel.setText("Passes: White" + passWhite.toString() + " Dark" + passBlack.toString());
			
			var playInfo = plays.pop();
			gameSet.animatePlay(playInfo);
			
		}
	}
	
	this.display = this.displayAnimated;
	this.displayHUD = this.displayScoresHUD;
}