/**
 * SceneGraph illumination constructor.
 * @constructor
 */
function SceneIllumination() {
    this.ambient = [0, 0, 0, 0];
    this.background = [0, 0, 0, 0];
}

SceneIllumination.prototype = Object.create(Object.prototype);
SceneIllumination.prototype.constructor = SceneIllumination;