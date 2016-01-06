function WhiteCircleTile(scene) {
    BoardTile.call(this, scene);
}

WhiteCircleTile.prototype = Object.create(BoardTile.prototype);
WhiteCircleTile.prototype.constructor = WhiteCircleTile;

WhiteCircleTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("whitecircle", "null", "null");
}