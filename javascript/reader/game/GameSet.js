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
	this.animateSink(row, col);
}

GameSet.prototype.animateSink = function(row, col) {
	var tile = this.board.getTile(row, col);
	var fadeOutAnimation = new FadeAnimation(tile, 2000, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(tile, 2000, 0.0, 1.0);
	fadeOutAnimation.start();
	this.scene.addUpdatable(fadeOutAnimation);
	tile.setTransparency(true);
	
	var fadeIn = function() {
		this.displayPicking();
	
		if (fadeInAnimation.finished) {
			this.scene.removeUpdatable(fadeInAnimation);
			tile.setTransparency(false);
			this.displayFunction = this.displayPicking;
		}
	}
	
	var fadeOut = function () {
		this.displayPicking();
		
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
}


GameSet.prototype.animateSlideFadeOut = function(row, col) {
	var tile = this.board.getTile(row, col);
	var animation = new FadeAnimation(tile, 2000, 1.0, 0.0);
	animation.start();
	this.scene.addUpdatable(animation);
	tile.setTransparency(true);
	
	this.displayFunction = function () {
		this.displayPicking();
		
		if (animation.finished) {
			this.board.removeTile(row, col);
			this.animateSinkFadeIn(tile);
			this.scene.removeUpdatable(animation);
		}
	}
}

GameSet.prototype.animateSlideFadeIn = function(tile) {
	this.stack.addTile(tile);
	var animation = new FadeAnimation(tile, 2000, 0.0, 1.0);
	animation.start();
	this.scene.addUpdatable(animation);
	tile.setTransparency(true);
	
	this.displayFunction = function () {
		this.displayPicking();
		
		if (animation.finished) {
			this.scene.removeUpdatable(animation);
			this.displayFunction = this.displayPicking;
			tile.setTransparency(false);
		}
	}
}



/*
 * Rise tile
 */
GameSet.prototype.rise = function(row, col, tile) {
	this.stack.removeTile(tile);
	this.board.addTile(row, col, tile);
}