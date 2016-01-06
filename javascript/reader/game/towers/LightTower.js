/**
 * LSXSceneGraph constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the LightTower belongs.
 */
function LightTower(scene) {
	BoardTower.call(this, scene);
}

LightTower.prototype = Object.create(BoardTower.prototype);
LightTower.prototype.constructor = LightTower;

/**
* Display function used to render this object.
*/
LightTower.prototype.display = function() {
    this.scene.drawNode("whitetower", "null", "null");
}