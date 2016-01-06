function BlackSquareTile(scene) {
    BoardTile.call(this, scene);
}

BlackSquareTile.prototype = Object.create(BoardTile.prototype);
BlackSquareTile.prototype.constructor = BlackSquareTile;

BlackSquareTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("blacksquare", "null", "null");
}