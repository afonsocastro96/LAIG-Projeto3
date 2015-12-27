function GameSet(scene) {
	CGFobject.call(this, scene);
	this.displayFunction = this.displayPicking;
	this.selectableTiles = [];
	this.changeable = true;
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


GameSet.prototype.displayNoPicking = function() {
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
	if (this.changeable) {
		
	}
}

/*
 * Slide tower and tile
 */
GameSet.prototype.slide = function(startRow, startCol, endRow, endCol) {
	if (this.changeable) {
		this.animateSlide(startRow, startCol, endRow, endCol, 4000);
	}
}
 
 /*
  * Sink tile
  */
GameSet.prototype.sink = function(row, col) {
	if (this.changeable) {
		this.animateSink(row, col, 4000);
	}
}

GameSet.prototype.animateSink = function(row, col, span) {
	this.changeable = false;
	
	var tile = this.board.getTile(row, col);
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
			this.displayFunction = this.displayPicking;
			this.changeable = true;
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
}


// TODO: Include tower animation
GameSet.prototype.animateSlide = function(startRow, startCol, endRow, endCol, span) {
	this.changeable = false;

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
			this.displayFunction = this.displayPicking;
			this.changeable = true;
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
}



/*
 * Rise tile
 */
GameSet.prototype.rise = function(row, col, tile) {
	if (this.changeable) {
		this.animateRise(row, col, tile, 4000);
	}
}

GameSet.prototype.animateRise = function(row, col, tile, span) {
	this.changeable = false;	
	
	var fadeOutAnimation = new FadeAnimation(tile, span/2, 1.0, 0.0);
	var fadeInAnimation = new FadeAnimation(tile, span/2, 0.0, 1.0);
	fadeOutAnimation.start();
	this.scene.addUpdatable(fadeOutAnimation);
	tile.setTransparency(true);
	
	this.stack.removeTile(tile);
	this.stack.addTile(tile);
	
	var fadeIn = function() {
		this.displayNoPicking();
	
		if (fadeInAnimation.finished) {
			this.scene.removeUpdatable(fadeInAnimation);
			tile.setTransparency(false);
			this.displayFunction = this.displayPicking;
			this.changeable = true;
		}
	}
	
	var fadeOut = function () {
		this.displayNoPicking();
		
		if (fadeOutAnimation.finished) {
			this.stack.removeTile(tile);
			this.board.addTile(row, col, tile);
			this.scene.removeUpdatable(fadeOutAnimation);
			fadeInAnimation.start();
			this.scene.addUpdatable(fadeInAnimation);
			this.displayFunction = fadeIn;
		}
	}
	
	this.displayFunction = fadeOut;
}