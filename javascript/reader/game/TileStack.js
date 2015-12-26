function TileStack(scene) {
    this.scene = scene;

    this.blackCirclesStack = [];
    this.blackSquaresStack = [];
    this.whiteCirclesStack = [];
    this.whiteSquaresStack = [];
}

TileStack.prototype = Object.create(Object.prototype);
TileStack.prototype.constructor = TileStack;

TileStack.prototype.addTile = function(tile) {
	if (tile instanceof BlackCircleTile)
		this.blackCirclesStack.push(tile);
	else if (tile instanceof BlackSquareTile)
		this.blackSquaresStack.push(tile);
	else if (tile instanceof WhiteCircleTile)
		this.whiteCirclesStack.push(tile);
	else if (tile instanceof WhiteSquareTile)
		this.whiteSquaresStack.push(tile);
}

TileStack.prototype.removeTile = function(tile) {
	if (tile instanceof BlackCircleTile)
		this.blackCirclesStack.pop();
	else if (tile instanceof BlackSquareTile)
		this.blackSquaresStack.pop();
	else if (tile instanceof WhiteCircleTile)
		this.whiteCirclesStack.pop();
	else if (tile instanceof WhiteSquareTile)
		this.whiteSquaresStack.pop();
}

TileStack.prototype.display = function() {
    this.scene.pushMatrix();
		this.scene.translate(-1.5,0.1,0);

		this.scene.pushMatrix();
			for (var i = 0; i < this.blackCirclesStack.length; ++i) {
				this.blackCirclesStack[i].display();
				this.scene.translate(0,0.2,0);
			}
		this.scene.popMatrix();
		
		this.scene.pushMatrix();
			this.scene.translate(1,0,0);
			for (var i = 0; i < this.blackSquaresStack.length; ++i) {
				this.blackSquaresStack[i].display();
				this.scene.translate(0,0.2,0);
			}
		this.scene.popMatrix();
		
		this.scene.pushMatrix();
			this.scene.translate(2,0,0);
			for (var i = 0; i < this.whiteCirclesStack.length; ++i) {
				this.whiteCirclesStack[i].display();
				this.scene.translate(0,0.2,0);
			}
		this.scene.popMatrix();
	
		this.scene.pushMatrix();
			this.scene.translate(3,0,0);
			for (var i = 0; i < this.whiteSquaresStack.length; ++i) {
				this.whiteSquaresStack[i].display();
				this.scene.translate(0,0.2,0);
			}
		this.scene.popMatrix();
    
	this.scene.popMatrix();
}