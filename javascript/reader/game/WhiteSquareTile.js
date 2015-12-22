function WhiteSquareTile(scene) {
    this.scene = scene;
}

WhiteSquareTile.prototype = Object.create(Object.prototype);
WhiteSquareTile.prototype.constructor = WhiteSquareTile;

WhiteSquareTile.prototype.display = function() {
    this.scene.drawNode("whitesquare", "null", "null");
}