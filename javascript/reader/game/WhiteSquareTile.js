function WhiteSquareTile(scene) {
    BoardTile.call(this, scene);
    this.setDisplayFunction(this.defaulDisplay);
}

WhiteSquareTile.prototype = Object.create(BoardTile.prototype);
WhiteSquareTile.prototype.constructor = WhiteSquareTile;

WhiteSquareTile.prototype.defaulDisplay = function() {
    this.scene.drawNode("whitesquare", "null", "null");
}