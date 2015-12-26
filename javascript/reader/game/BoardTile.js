function BoardTile(scene) {
    this.scene = scene;
	this.displayFunction = function(){};
}

BoardTile.prototype = Object.create(CGFobject.prototype);
BoardTile.prototype.constructor = BoardTile;

BoardTile.prototype.display = function() {
	this.displayFunction();
}

BoardTile.prototype.setDisplayFunction = function(displayFunction) {
    this.displayFunction = displayFunction;
}