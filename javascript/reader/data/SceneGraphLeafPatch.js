/**
 * SceneGraph patch leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param order {number} Patch curves degree
 * @param partsU {number} Divisions across the U axis
 * @param partsV {number} Divisions across the V axis
 * @param controlPoints {array} Array of 3D coordinates for the NURBS controlPoints
 */
function SceneGraphLeafPatch(id, order, partsU, partsV, controlPoints) {
    SceneGraphLeaf.call(this, id, "patch");
    this.order = order;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlPoints = controlPoints;
}

SceneGraphLeafPatch.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafPatch.prototype.constructor = SceneGraphLeafPatch;