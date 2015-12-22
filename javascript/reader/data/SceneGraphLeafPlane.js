/**
 * SceneGraph plane leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param partsV {number} Divisions across the U and V axis
 */
function SceneGraphLeafPlane(id, parts) {
    SceneGraphLeaf.call(this, id, "plane");
    this.parts = parts;
}

SceneGraphLeafPlane.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafPlane.prototype.constructor = SceneGraphLeafPlane;