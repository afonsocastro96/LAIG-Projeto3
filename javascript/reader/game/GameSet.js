function GameSet(scene) {
	CGFobject.call(this, scene);
}

GameSet.prototype = Object.create(CGFobject.prototype);
GameSet.prototype.constructor = GameSet;

GameSet.prototype.init = function() {
	this.minTurnDuration = 15
	this.turnDuration = 30;
	this.maxTurnDuration = 60;
	this.animationSpan = 2000;
	this.animating = false;
	this.towers = [];
	
	this.setState(new BoardSelectionState());
}

GameSet.prototype.setState = function(state) {
	this.state = state;
	this.state.init(this);
}

GameSet.prototype.setBoard = function(gameBoard) {
	this.board = gameBoard;
	this.stack = new TileStack(this.scene);
}

GameSet.prototype.setTowers = function(towers) {
	this.towers = towers;
}

GameSet.prototype.display = function() {
	this.state.display(this);
}

GameSet.prototype.displayHUD = function() {
	this.state.displayHUD(this);
}

GameSet.prototype.updateState = function(currenTime) {
	this.state.update(this, currenTime);
}

GameSet.prototype.update = GameSet.prototype.updateState;

GameSet.prototype.getTower = function(row, col) {
	for (var i = 0; i < this.towers.length; ++i) {
		var tower = this.towers[i];
		if (tower.row == row && tower.col == col) {
			return tower;
		}
	}
}

GameSet.prototype.moveTower = function(startRow, startCol, endRow, endCol) {
	var tower = this.getTower(startRow, startCol);
	if (tower != null) {
		tower.setPosition(endRow, endCol);
	}
}

GameSet.prototype.move = function(startRow, startCol, endRow, endCol) {
	this.moveTower(startRow, startCol, endRow, endCol);
}

GameSet.prototype.slide = function(startRow, startCol, endRow, endCol) {
	this.moveTower(startRow, startCol, endRow, endCol);
	var tile = this.board.getTile(startRow, startCol);
	this.board.removeTile(startRow, startCol);
	this.board.addTile(endRow, endCol, tile);
}

GameSet.prototype.sink = function(row, col) {
	var tile = this.board.getTile(row, col);
	this.board.removeTile(row, col);
	this.stack.addTile(tile);
}

GameSet.prototype.raise = function(row, col, tile) {
	this.stack.removeTile(tile);
	this.board.addTile(row, col, tile);
}

GameSet.prototype.pass = function() {
	// do nothing
}

GameSet.prototype.displayStatic = function() {
	this.board.display();
	
	this.scene.pushMatrix();
		this.scene.translate(5,0,0);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.stack.display();
	this.scene.popMatrix();
	
	for (var i = 0; i < this.towers.length; ++i) {
		var tower = this.towers[i];
		var boardPosition = this.board.getBoardCoordinates(tower.row, tower.col);
		
		this.scene.pushMatrix();
			this.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
			tower.display();
		this.scene.popMatrix();
	}
}

GameSet.prototype.displayAnimated = GameSet.prototype.displayStatic;
GameSet.prototype.finishAnimation = function() {
	this.animating = false;
	this.displayAnimated = this.displayStatic;
	this.update = this.updateState;
}

GameSet.prototype.animateSlide = function(startRow, startCol, endRow, endCol) {
	this.animating = true;
	
	var tile = this.board.getTile(startRow, startCol);
	var selectedTower = this.getTower(startRow, startCol);
	var startBoardPosition = this.board.getBoardCoordinates(startRow, startCol);
	var endBoardPosition = this.board.getBoardCoordinates(endRow, endCol);
	
	var fadeOutAnimation = new FadeAnimation(this.animationSpan/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(this.animationSpan/2, 0.0, 1.0);
		
	var parabolicAnimation = new ParabolicAnimation(startBoardPosition, endBoardPosition, 1.0, 1.0, this.animationSpan);
	
	
	tile.setTransparency(true);
	
	var startTime = Date.now();
	var timer = 0;
	
	this.displayAnimated = function() {
		this.board.display();
		
		this.scene.pushMatrix();
			this.scene.translate(5,0,0);
			this.scene.rotate(Math.PI / 2, 0, 1, 0);
			this.stack.display();
		this.scene.popMatrix();
		
		for (var i = 0; i < this.towers.length; ++i) {
			var tower = this.towers[i];
			var boardPosition;
			if (tower == selectedTower) {
				boardPosition = parabolicAnimation.getPoint(timer);
			} else {
				boardPosition = this.board.getBoardCoordinates(tower.row, tower.col);
			}
			this.scene.pushMatrix();
				this.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
				tower.display();
			this.scene.popMatrix();
		}
	}
	
	var secondUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan) {
			tile.setTransparency(false);
			selectedTower.setPosition(endRow, endCol);
			this.finishAnimation();
			return;
		}
		tile.setAlphaScaling(fadeInAnimation.getScaling(timer - this.animationSpan/2));
	}
	
	var firstUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan/2) {
			this.board.moveTile(startRow, startCol, endRow, endCol);
			this.update = secondUpdate;
			return;
		}
		tile.setAlphaScaling(fadeOutAnimation.getScaling(timer));
	}	
	
	this.update = firstUpdate;
}

GameSet.prototype.animateMove = function(startRow, startCol, endRow, endCol) {
	this.animating = true;
	
	var selectedTower = this.getTower(startRow, startCol);
	var startBoardPosition = this.board.getBoardCoordinates(startRow, startCol);
	var endBoardPosition = this.board.getBoardCoordinates(endRow, endCol);
		
	var parabolicAnimation = new ParabolicAnimation(startBoardPosition, endBoardPosition, 1.0, 1.0, this.animationSpan);
	
	var startTime = Date.now();
	var timer = 0;
	
	this.displayAnimated = function() {
		this.board.display();
		
		this.scene.pushMatrix();
			this.scene.translate(5,0,0);
			this.scene.rotate(Math.PI / 2, 0, 1, 0);
			this.stack.display();
		this.scene.popMatrix();
		
		for (var i = 0; i < this.towers.length; ++i) {
			var tower = this.towers[i];
			var boardPosition;
			if (tower == selectedTower) {
				boardPosition = parabolicAnimation.getPoint(timer);
			} else {
				boardPosition = this.board.getBoardCoordinates(tower.row, tower.col);
			}
			this.scene.pushMatrix();
				this.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
				tower.display();
			this.scene.popMatrix();
		}
	}
	
	this.update = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan) {
			selectedTower.setPosition(endRow, endCol);
			this.finishAnimation();
			return;
		}
	}
}


GameSet.prototype.animateSink = function(row, col) {
	this.animating = true;
	
	var tile = this.board.getTile(row, col);
	var fadeOutAnimation = new FadeAnimation(this.animationSpan/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(this.animationSpan/2, 0.0, 1.0);
	
	tile.setTransparency(true);
	
	var startTime = Date.now();
	var timer = 0;
	
	this.displayAnimated = this.displayStatic;
	
	var secondUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan) {
			tile.setTransparency(false);
			this.finishAnimation();
			return;
		}
		tile.setAlphaScaling(fadeInAnimation.getScaling(timer - this.animationSpan/2));
	}
	
	var firstUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan/2) {
			this.board.removeTile(row, col);
			this.stack.addTile(tile);
			this.update = secondUpdate;
			return;
		}
		tile.setAlphaScaling(fadeOutAnimation.getScaling(timer));
	}	
	
	this.update = firstUpdate;
}

GameSet.prototype.animateRaise = function(row, col, tile) {
	this.animating = true;
	
	var fadeOutAnimation = new FadeAnimation(this.animationSpan/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(this.animationSpan/2, 0.0, 1.0);
	
	tile.setTransparency(true);
	this.stack.removeTile(tile);
	this.stack.addTile(tile);
	
	var startTime = Date.now();
	var timer = 0;
	
	this.displayAnimated = this.displayStatic;
	
	var secondUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan) {
			tile.setTransparency(false);
			this.finishAnimation();
			return;
		}
		tile.setAlphaScaling(fadeInAnimation.getScaling(timer - this.animationSpan/2));
	}
	
	var firstUpdate = function(currTime) {
		this.updateState(this, currTime);
		timer = currTime - startTime;
		if (timer > this.animationSpan/2) {
			this.stack.removeTile(tile);
			this.board.addTile(row, col, tile);
			this.update = secondUpdate;
			return;
		}
		tile.setAlphaScaling(fadeOutAnimation.getScaling(timer));
	}	
	
	this.update = firstUpdate;
}

GameSet.prototype.animatePass = function() {
	this.animating = true;
	
	this.displayAnimated = this.displayStatic;
	
	var startTime = Date.now();
	var timer = 0;
	
	this.update = function(currTime) {
		timer = currTime - startTime;
		if (timer > this.animationSpan) {
			this.finishAnimation();
		}
	}
}