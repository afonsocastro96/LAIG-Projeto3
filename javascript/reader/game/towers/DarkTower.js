/**
 * DarkTower constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the DarkTower belongs.
 */
function DarkTower(scene) {
	BoardTower.call(this, scene);
}

DarkTower.prototype = Object.create(BoardTower.prototype);
DarkTower.prototype.constructor = LightTower;

/**
* Display function used to render this object.
*/
DarkTower.prototype.display = function() {
    this.scene.drawNode("blacktower", "null", "null");
}