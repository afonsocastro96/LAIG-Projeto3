/**
 * SceneGraph leaf constructor
 * @constructor
 * @param id {string} Node identification
 */
function SceneGraphLeafGameSet(id) {
    SceneGraphLeaf.call(this, id, "gameset");
}

SceneGraphLeafGameSet.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafGameSet.prototype.constructor = SceneGraphLeafGameSet;