/**
 * SceneGraph material constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which this material belongs.
 * @param id {string} Material identification.
 */
function SceneMaterial(scene, id) {
    CGFappearance.call(this, scene);
    this.id = id;
}

SceneMaterial.prototype = Object.create(CGFappearance.prototype);
SceneMaterial.prototype.constructor = SceneMaterial;