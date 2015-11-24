/**
 * SceneGraph leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param type {string} Type of primitive
 */

function SceneGraphLeaf(id, type) {
    this.id = id;
    this.type = type;
}

SceneGraphLeaf.prototype = Object.create(Object.prototype);
SceneGraphLeaf.prototype.constructor = SceneGraphLeaf;