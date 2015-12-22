function BlackSquareTile(scene) {
    this.scene = scene;
}

BlackSquareTile.prototype = Object.create(Object.prototype);
BlackSquareTile.prototype.constructor = BlackSquareTile;

BlackSquareTile.prototype.display = function() {
    this.scene.drawNode("blacksquare", "null", "null");
}