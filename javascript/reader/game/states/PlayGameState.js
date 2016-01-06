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
	
	this.selectionPanel = new MyPlane(gameSet.scene, 100);
	this.selectionPanelAppearance = new CGFappearance(gameSet.scene);
	this.selectionPanelAppearance.setAmbient(0.0, 0.0, 0.3, 0.1);
	this.selectionPanelAppearance.setDiffuse(0.0, 0.0, 0.8, 0.1);
	this.selectionPanelAppearance.setSpecular(0.0, 0.0, 0.8, 0.1);
	
	this.turnDuration = gameSet.turnDuration;
	this.lastPlayTime = Date.now();
	
	this.display = this.displayStatic;	
	var gameState = this;
	Connection.finishSetup(gameSet, function(gameSet, request) { gameState.setScore(gameSet, request)});
}

PlayGameState.prototype.displayStatic = function(gameSet) {
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

PlayGameState.prototype.displayScoresHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 3.5, -20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		this.timerPanel.display();
	gameSet.scene.popMatrix();
}

PlayGameState.prototype.displayTurnHUD = function(gameSet) {
	this.displayScoresHUD(gameSet);
}

PlayGameState.prototype.updateTimer = function(gameSet, currentTime) {
	var timeLeft = this.turnDuration - Math.trunc((currentTime - this.lastPlayTime) / 1000);
	if (timeLeft <= 0) {
		timeLeft = 0;
		this.turnDurationFinished(gameSet);
	}
	this.timerPanel.setText(this.currentPlayer + " " + timeLeft.toString());
}

PlayGameState.prototype.getScore = function(gameSet) {
	var gameState = this;
	this.display = this.displayStatic;
	Connection.getScore(gameSet, function(target, request) { gameState.setScore(target, request);});
}

PlayGameState.prototype.setScore = function(gameSet, request) {
	this.displayHUD = this.displayScoresHUD;
	var scoreInfo = JSON.parse(request);
	
	var streaker = Connection.players[scoreInfo[0][0]];
	var sinkStreak = scoreInfo[0][1];
	var passWhite = scoreInfo[1][Connection.lightTower];
	var passBlack = scoreInfo[1][Connection.darkTower];
	
	this.nextPlay(gameSet);
}

PlayGameState.prototype.nextPlay = function(gameSet) {
	var gameState = this;
	Connection.nextPlay(gameSet, function(target, request) { gameState.pickPlay(target, request)});
}

PlayGameState.prototype.pickPlay = function(gameSet, request) {
	var nextPlayInfo = JSON.parse(request);
	if (nextPlayInfo[0] == Connection.gameFinished) {
		gameSet.winner = Connection.players[nextPlayInfo[1]];
		gameSet.winReason = Connection.winReasons[nextPlayInfo[2]];
		gameSet.setState(new GameFinishedState());
		return;
	}
	
	this.currentPlayer = Connection.players[nextPlayInfo[0]];
	
	if (nextPlayInfo[1] == Connection.botActionCode) {
		var gameState = this;
		Connection.botAction(gameSet, function(target, request) {gameState.animatePlay(target, request);});
		return;
	}
	
	this.askPlayer(gameSet, nextPlayInfo[1]);
}

PlayGameState.prototype.askPlayer = function(gameSet, actions) {
	var sinkableTiles = [];
	var selectableTowers = [];
	var slidableTiles = [[],[]];
	var movableTiles = [[], []];
	
	for (var i = 0; i < actions.length; ++i) {
		var action = actions[i];
		switch (action[0]) {
			case Connection.slideCode:
			case Connection.moveCode:
				if (selectableTowers.indexOf(gameSet.getTower(action[1], action[2])) == -1) {
					selectableTowers.push(gameSet.getTower(action[1], action[2]));
				}
			break;
		}
		if (selectableTowers.length == 2)
			break;
	}
	
	for (var i = 0; i < actions.length; ++i) {
		var action = actions[i];
		switch (action[0]) {
			case Connection.sinkCode:
				sinkableTiles.push([action[1], action[2]]);
				break;
			case Connection.slideCode:
				slidableTiles[selectableTowers.indexOf(gameSet.getTower(action[1],action[2]))].push([action[3], action[4]]);
				break;
			case Connection.moveCode:
				movableTiles[selectableTowers.indexOf(gameSet.getTower(action[1],action[2]))].push([action[3], action[4]]);
				break;
		}
	}
	
	var gameState = this;
	
	var firstSelection = function(gameSet) {
		gameSet.board.display();
	
		gameSet.scene.pushMatrix();
			gameSet.scene.translate(5,0,0);
			gameSet.scene.rotate(Math.PI / 2, 0, 1, 0);
			gameSet.stack.display();
		gameSet.scene.popMatrix();
		
		for (var i = 0; i < gameSet.towers.length; ++i) {
			var tower = gameSet.towers[i];
			gameSet.scene.clearPickRegistration();
			if (selectableTowers.indexOf(tower) != -1) {
				gameSet.scene.registerNextPick({
					selectedTower: tower,
					onPick : function() {
						gameState.selectedTower = this.selectedTower;
					}
				});
			}
			var boardPosition = gameSet.board.getBoardCoordinates(tower.row, tower.col);
			
			gameSet.scene.pushMatrix();
				gameSet.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
				tower.display();
			gameSet.scene.popMatrix();
		}
		
		var prevValue;
		if (!gameSet.scene.pickMode) {
				prevValue = gameSet.scene.activeShader.getUniformValue("uAlphaScaling");
				gameSet.scene.activeShader.setUniformsValues({uAlphaScaling: 0.5});
				this.selectionPanelAppearance.apply();
		}
		
		for (var i = 0; i < sinkableTiles.length; ++i) {
			var position = sinkableTiles[i];
			var boardPosition = gameSet.board.getBoardCoordinates(position[0], position[1]);
				
			gameSet.scene.pushMatrix();
				gameSet.scene.translate(boardPosition[0], boardPosition[1] + 0.01, boardPosition[2]);
				gameSet.scene.registerNextPick({
					row: position[0],
					col: position[1],
					onPick: function() {
						gameState.sink(gameSet, this.row, this.col);
					}
				});
				this.selectionPanel.display();
			gameSet.scene.popMatrix();
		}
		
		if (!gameSet.scene.pickMode) {
			gameSet.scene.activeShader.setUniformsValues({uAlphaScaling: prevValue});
		}
		
		gameSet.scene.clearPickRegistration();
	}
	
	this.lastPlayTime = Date.now();
	this.update = this.updateTimer;
	this.displayHUD = this.displayTurnHUD;
	this.display = firstSelection;
}

PlayGameState.prototype.turnDurationFinished = function(gameSet) {
	var gameState = this;
	this.pass(gameSet);
}

PlayGameState.prototype.animatePlay = function(gameSet, request) {
	this.timerPanel.setText(this.currentPlayer);
	this.displayHUD = this.displayScoresHUD;
	var playInfo = JSON.parse(request);
	
	switch(playInfo[0]) {
		case Connection.sinkCode:
			this.animateSink(gameSet, playInfo[1], playInfo[2]);
			break;
		case Connection.slideCode:
			this.animateSlide(gameSet, playInfo[1], playInfo[2], playInfo[3], playInfo[4]);
			break;
		case Connection.moveCode:
			this.animateMove(gameSet, playInfo[1], playInfo[2], playInfo[3], playInfo[4]);
			break;
		case Connection.passCode:
			this.animatePass(gameSet);
			break;
		case Connection.raiseCode:
			this.animateRaise(gameSet,playInfo[1], playInfo[2], Connection.parseTile(playInfo[3], playInfo[4], gameSet.scene));
			break;
	}
}

PlayGameState.prototype.move = function(gameSet, startRow, startCol, endRow, endCol) {
	this.display = this.displayStatic;
	this.update = function() {};
	var gameState = this;
	Connection.move(gameSet, function(target, request) {
		gameState.animatePlay(target, request);
	},
	startRow, startCol, endRow, endCol);
}

PlayGameState.prototype.slide = function(gameSet, startRow, startCol, endRow, endCol) {
	this.display = this.displayStatic;
	this.update = function() {};
	var gameState = this;
	Connection.slide(gameSet, function(target, request) {
		gameState.animatePlay(target, request);
	},
	startRow, startCol, endRow, endCol);
}

PlayGameState.prototype.sink = function(gameSet, row, col) {
	this.display = this.displayStatic;
	this.update = function() {};
	var gameState = this;
	Connection.sink(gameSet, function(target, request) {
		gameState.animatePlay(target, request);
	},
	row, col);
}

PlayGameState.prototype.pass = function(gameSet) {
	this.display = this.displayStatic;
	this.update = function() {};
	var gameState = this;
	Connection.pass(gameSet, function(target, request) {
		gameState.animatePlay(target, request);
	});
}

PlayGameState.prototype.animateMove = function(gameSet, startRow, startCol, endRow, endCol) {
	gameSet.move(startRow, startCol, endRow, endCol);
	this.getScore(gameSet);
}

PlayGameState.prototype.animateSlide = function(gameSet, startRow, startCol, endRow, endCol) {
	gameSet.slide(startRow, startCol, endRow, endCol);
	this.getScore(gameSet);
	/*
	var tile = this.board.getTile(startRow, startCol);
	var fadeOutAnimation = new FadeAnimation(tile, span/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(tile, span/2, 0.0, 1.0);
	fadeOutAnimation.start();
	this.scene.addUpdatable(fadeOutAnimation);
	tile.setTransparency(true);
	
	var fadeIn = function() {
		this.displayNoPicking();
	
		if (fadeInAnimation.finished) {
			this.scene.removeUpdatable(fadeInAnimation);
			tile.setTransparency(false);
			this.animating = false;
			this.displayNextAnimation();
		}
	}
	
	var fadeOut = function () {
		this.displayNoPicking();
		
		if (fadeOutAnimation.finished) {
			this.board.moveTile(startRow, startCol, endRow, endCol);
			this.scene.removeUpdatable(fadeOutAnimation);
			fadeInAnimation.start();
			this.scene.addUpdatable(fadeInAnimation);
			this.displayFunction = fadeIn;
		}
	}
	
	this.displayFunction = fadeOut;
	*/
}

PlayGameState.prototype.animateSink = function(gameSet, row, col) {
	gameSet.sink(row, col);
	this.getScore(gameSet);
	/*
	var tile = gameSet.board.getTile(row, col);
	var fadeOutAnimation = new FadeAnimation(tile, span/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(tile, span/2, 0.0, 1.0);
	fadeOutAnimation.start();
	gameSet.scene.addUpdatable(fadeOutAnimation);
	tile.setTransparency(true);
	
	var fadeIn = function() {
		this.displayNoPicking();
	
		if (fadeInAnimation.finished) {
			this.scene.removeUpdatable(fadeInAnimation);
			tile.setTransparency(false);
			this.animating = false;
			this.displayNextAnimation();
		}
	}
	
	var fadeOut = function () {
		this.displayNoPicking();
		
		if (fadeOutAnimation.finished) {
			this.board.removeTile(row, col);
			this.scene.removeUpdatable(fadeOutAnimation);
			this.stack.addTile(tile);
			fadeInAnimation.start();
			this.scene.addUpdatable(fadeInAnimation);
			this.displayFunction = fadeIn;
		}
	}
	
	this.displayFunction = fadeOut;
	*/
}

PlayGameState.prototype.animateRaise = function(gameSet, row, col, tile) {
	gameSet.raise(row, col, tile);
	this.getScore(gameSet);
}

PlayGameState.prototype.animatePass = function(gameSet) {
	gameSet.pass();
	this.getScore(gameSet);
}