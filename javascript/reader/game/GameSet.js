function GameSet(scene) {
	CGFobject.call(this, scene);
}

GameSet.prototype = Object.create(CGFobject.prototype);
GameSet.prototype.constructor = GameSet;