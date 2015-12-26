function BlackCircleTile(scene) {
    BoardTile.call(this, scene);
    this.setDisplayFunction(this.defaulDisplay);
}

BlackCircleTile.prototype = Object.create(BoardTile.prototype);
BlackCircleTile.prototype.constructor = BlackCircleTile;

BlackCircleTile.prototype.defaulDisplay = function() {
    this.scene.drawNode("blackcircle", "null", "null");
}