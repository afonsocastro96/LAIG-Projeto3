function DarkTower(scene) {
	BoardTower.call(this, scene);
}

DarkTower.prototype = Object.create(BoardTower.prototype);
DarkTower.prototype.constructor = LightTower;

DarkTower.prototype.display = function() {
    this.scene.drawNode("blacktower", "null", "null");
}