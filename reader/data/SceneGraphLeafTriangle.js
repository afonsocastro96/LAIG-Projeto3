/**
 * SceneGraph triangle leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param v1x {number} First point x coordinate
 * @param v1y {number} First point y coordinate
 * @param v1z {number} First point z coordinate
 * @param v2x {number} Second point x coordinate
 * @param v2y {number} Second point y coordinate
 * @param v2z {number} Second point z coordinate
 * @param v3x {number} Third point x coordinate
 * @param v3y {number} Third point y coordinate
 * @param v3z {number} Third point z coordinate
 */
function SceneGraphLeafTriangle(id, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
    SceneGraphLeaf.call(this, id, "triangle");
    this.v1 = vec3.fromValues(v1x, v1y, v1z);
    this.v2 = vec3.fromValues(v2x, v2y, v2z);
    this.v3 = vec3.fromValues(v3x, v3y, v3z);
}

SceneGraphLeafTriangle.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafTriangle.prototype.constructor = SceneGraphLeafTriangle;