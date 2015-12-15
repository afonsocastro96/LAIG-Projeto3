function BlackCircleTile(scene) {
    this.scene = scene;
}

BlackCircleTile.prototype = Object.create(Object.prototype);
BlackCircleTile.prototype.constructor = BlackCircleTile;

BlackCircleTile.prototype.display = function() {
    this.scene.drawNode("blackcircle", "null", "null");
}