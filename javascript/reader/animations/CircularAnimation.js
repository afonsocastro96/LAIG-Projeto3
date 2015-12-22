/**
 * CircularAnimation constructor.
 * @constructor
 * @param id {String} The animation's id.
 * @param span {Float} The animation's span.
 * @param center {vec3} The animation's center of rotation.
 * @param startAngle {Float} The animation's start angle.
 * @param rotAngle {Float} The animation's rotation.
 * @param radius {Float} The animation's radius.
 */
function CircularAnimation(id, span, center, startAngle, rotAngle, radius) {
    Animation.call(this, id, span, "circular");
    this.id = id;
    this.span = span;
    this.center = center;
    this.startAngle = startAngle;
    this.rotAngle = rotAngle;
    this.radius = radius;
    this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Initiates the animation.
 */
CircularAnimation.prototype.init = function() {
	this.initialTransformation = mat4.create();
	mat4.identity(this.initialTransformation);
	mat4.rotateY(this.initialTransformation, this.initialTransformation, this.startAngle);
	mat4.translate(this.initialTransformation, this.initialTransformation,
				   vec3.fromValues(this.radius, 0, 0));
	
	mat4.rotateY(this.initialTransformation, this.initialTransformation,
				this.rotAngle > 0 ? Math.PI / 2 : - Math.PI / 2);
}

/** 
 * Calculates the matrix while the animation is running.
 * @param t {Float} The current time.
 * @return {mat4} Animation matrix.
 */
CircularAnimation.prototype.calculateMatrix = function(t) {

	t = Math.min(t, this.span);

	var matrix = mat4.create();
	mat4.identity(matrix);
	
	if (t < 0)
		return matrix;

	mat4.translate(matrix, matrix, this.center);

	var rot = this.rotAngle * (t / this.span);
	mat4.rotateY(matrix, matrix, rot);
	mat4.multiply(matrix, matrix, this.initialTransformation);

	return matrix;
}