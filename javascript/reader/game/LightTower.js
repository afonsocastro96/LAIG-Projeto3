function LightTower(scene) {
	BoardTower.call(this, scene);
}

LightTower.prototype = Object.create(BoardTower.prototype);
LightTower.prototype.constructor = LightTower;

LightTower.prototype.display = function() {
    this.scene.drawNode("whitetower", "null", "null");
}