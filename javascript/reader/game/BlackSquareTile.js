function BlackSquareTile(scene) {
    BoardTile.call(this, scene);
    this.setDisplayFunction(this.defaulDisplay);
}

BlackSquareTile.prototype = Object.create(BoardTile.prototype);
BlackSquareTile.prototype.constructor = BlackSquareTile;

BlackSquareTile.prototype.defaulDisplay = function() {
    this.scene.drawNode("blacksquare", "null", "null");
}