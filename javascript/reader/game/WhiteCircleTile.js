function WhiteCircleTile(scene) {
    this.scene = scene;
}

WhiteCircleTile.prototype = Object.create(Object.prototype);
WhiteCircleTile.prototype.constructor = WhiteCircleTile;

WhiteCircleTile.prototype.display = function() {
    this.scene.drawNode("whitecircle", "null", "null");
}