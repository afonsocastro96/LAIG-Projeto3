/**
 * SceneGraph rectangle leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param v1x {number} X Coordinate of top-left point
 * @param v1y {number} Y Coordinate of top-left point
 * @param v2x {number} X Coordinate of bottom-right point
 * @param v2y {number} Y Coordinate of bottom-right point
 */
function SceneGraphLeafRectangle(id, v1x, v1y, v2x, v2y) {
    SceneGraphLeaf.call(this, id, "rectangle");
    this.v1x = v1x;
    this.v1y = v1y;
    this.v2x = v2x;
    this.v2y = v2y;
}

SceneGraphLeaf.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeaf.prototype.constructor = SceneGraphLeaf;