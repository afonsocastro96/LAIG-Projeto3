function BlackCircleTile(scene) {
    BoardTile.call(this, scene);
}

BlackCircleTile.prototype = Object.create(BoardTile.prototype);
BlackCircleTile.prototype.constructor = BlackCircleTile;

BlackCircleTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("blackcircle", "null", "null");
}