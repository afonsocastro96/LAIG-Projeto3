/**
 * Animation constructor.
 * @constructor 
 * @param id {String} The animation id.
 * @param span {Float} The animation's span
 * @param type {String} The animation's type
 */
function Animation(id, span, type) {
    this.id = id;
    this.span = span;
    this.type = type;
}

Animation.prototype.constructor = Animation;

/**
 * Returns an identity matrix. Template function.
 * @return {mat4} Identity matrix.
 */
Animation.prototype.calculateMatrix = function() {
    var matrix = mat4.create();
    mat4.identity(matrix);

    return matrix;
}