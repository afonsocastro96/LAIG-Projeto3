function WhiteSquareTile(scene) {
    BoardTile.call(this, scene);
}

WhiteSquareTile.prototype = Object.create(BoardTile.prototype);
WhiteSquareTile.prototype.constructor = WhiteSquareTile;

WhiteSquareTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("whitesquare", "null", "null");
}