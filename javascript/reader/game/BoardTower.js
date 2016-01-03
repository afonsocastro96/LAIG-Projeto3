function BoardTower(scene) {
	CGFobject.call(this, scene);
}

BoardTower.prototype = Object.create(CGFobject.prototype);
BoardTower.prototype.constructor = BoardTower;

BoardTower.prototype.display = function() {
	
}

BoardTower.prototype.setPosition = function(row, col) {
	this.row = row;
	this.col = col;
}