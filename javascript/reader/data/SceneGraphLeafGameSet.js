function SceneGraphLeafGameSet(id) {
    SceneGraphLeaf.call(this, id, "gameset");
}

SceneGraphLeafGameSet.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafGameSet.prototype.constructor = SceneGraphLeafGameSet;