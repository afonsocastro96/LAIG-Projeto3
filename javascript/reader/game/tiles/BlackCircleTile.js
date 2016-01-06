/**
 * BlackCircleTile constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the BlackCircleTile belongs.
 */
function BlackCircleTile(scene) {
    BoardTile.call(this, scene);
}

BlackCircleTile.prototype = Object.create(BoardTile.prototype);
BlackCircleTile.prototype.constructor = BlackCircleTile;

/**
* Display function used to render this object when there is no reason to highlight this tile.
*/
BlackCircleTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("blackcircle", "null", "null");
}