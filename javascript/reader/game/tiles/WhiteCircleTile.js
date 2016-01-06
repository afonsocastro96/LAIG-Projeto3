/**
 * WhiteCircleTile constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the WhiteCircleTile belongs.
 */
function WhiteCircleTile(scene) {
    BoardTile.call(this, scene);
}

WhiteCircleTile.prototype = Object.create(BoardTile.prototype);
WhiteCircleTile.prototype.constructor = WhiteCircleTile;

/**
* Display function used to render this object when there is no reason to highlight this tile.
*/
WhiteCircleTile.prototype.defaultDisplay = function() {
    this.scene.drawNode("whitecircle", "null", "null");
}