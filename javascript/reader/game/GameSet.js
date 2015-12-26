function GameSet(scene) {
	CGFobject.call(this, scene);
	this.displayFunction = this.displayPicking;
	this.selectableTiles = [];
}

GameSet.prototype = Object.create(CGFobject.prototype);
GameSet.prototype.constructor = GameSet;

GameSet.prototype.init = function(board) {
	this.board = board;
	this.stack = new TileStack(this.scene);
}

GameSet.prototype.display = function() {
	this.displayFunction();
}

GameSet.prototype.displayPicking = function() {
	this.board.display();
	
	this.scene.pushMatrix();
		this.scene.translate(0,0,-5);
		this.stack.display();
	this.scene.popMatrix();
}

/*
 * Move tower
 */
GameSet.prototype.move = function(startRow, startCol, endRow, endCol) {
	
}

/*
 * Slide tower and tile
 */
GameSet.prototype.slide = function(startRow, startCol, endRow, endCol) {
	 
 }
 
 /*
  * Sink tile
  */
GameSet.prototype.sink = function(row, col) {
	var tile = this.board.getTile(row, col);
	this.board.removeTile(row, col);
	this.stack.addTile(tile);
}

/*
 * Rise tile
 */
GameSet.prototype.rise = function(row, col, tile) {
	this.stack.removeTile(tile);
	this.board.addTile(row, col, tile);
}