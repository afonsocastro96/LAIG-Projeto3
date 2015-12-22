/**
 * SceneGraph node constructor.
 * @constructor
 * @param id {string} Node identification.
 */
function SceneGraphNode(id) {
    this.id = id;
    this.material = "null";
    this.texture = "clear";
    this.transformationMatrix = mat4.create();
    mat4.identity(this.transformationMatrix);
    this.descendants = [];
    this.animations = [];
}

SceneGraphNode.prototype = Object.create(Object.prototype);
SceneGraphNode.prototype.constructor = SceneGraphNode;

/**
 * Material setter.
 * @param material {string} Material to set.
 */
SceneGraphNode.prototype.setMaterial = function(material) {
    this.material = material;
}

/**
 * Texture setter.
 * @param texture {string} Texture to set.
 */
SceneGraphNode.prototype.setTexture = function(texture) {
     this.texture = texture;
}

/**
 * Adds a descendant to the descendants array.
 * @param descendant {string} Descendant to add.
 */
SceneGraphNode.prototype.addDescendant = function(descendant) {
    this.descendants.push(descendant);
}

/**
 * Adds an animation to the animations array.
 * @param descendant {string} Animation to add.
 */
SceneGraphNode.prototype.addAnimation = function(animation) {
    this.animations.push(animation);
}
/**
 * Applies a rotation to the node around the X axis.
 * @param rad {number} Rotation angle in radians.
 */
SceneGraphNode.prototype.rotateX = function(rad) {
    mat4.rotateX(this.transformationMatrix, this.transformationMatrix, rad);
}

/**
 * Applies a rotation to the node around the Y axis.
 * @param rad {number} Rotation angle in radians.
 */
SceneGraphNode.prototype.rotateY = function(rad) {
    mat4.rotateY(this.transformationMatrix, this.transformationMatrix, rad);
}

/**
 * Applies a rotation to the node around the Z axis.
 * @param rad {number} Rotation angle in radians.
 */
SceneGraphNode.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, rad);
}

/**
 * Applies scaling to the node.
 * @param sx {number} X scale factor.
 * @param sy {number} Y scale factor.
 * @param sz {number} Z scale factor.
 */
SceneGraphNode.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.transformationMatrix, this.transformationMatrix, vec3.fromValues(sx,sy,sz));
}

/**
 * Applies a translation to the node.
 * @param x {number} X translation value.
 * @param y {number} Y translation value.
 * @param z {number} Z translation value.
 */

SceneGraphNode.prototype.translate = function(x, y, z) {
    mat4.translate(this.transformationMatrix, this.transformationMatrix, vec3.fromValues(x, y, z));
}
