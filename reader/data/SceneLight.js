/**
 * SceneGraph light constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which this light belongs.
 * @param an {number} Shader light array index.
 * @param id {string} Light identification.
 */
function SceneLight(scene, an, id) {
    CGFlight.call(this, scene, an);
    this._id = id;
}

SceneLight.prototype = Object.create(CGFlight.prototype);
SceneLight.prototype.constructor = SceneLight;