function GameSet(scene) {
	CGFobject.call(this, scene);
}

GameSet.prototype = Object.create(CGFobject.prototype);
GameSet.prototype.constructor = GameSet;

GameSet.prototype.init = function() {
	this.minTurnDuration = 15
	this.turnDuration = 30;
	this.maxTurnDuration = 60;
	this.animating = false;
	
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

GameSet.prototype.update = function(currenTime) {
	this.state.update(this, currenTime);
}

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