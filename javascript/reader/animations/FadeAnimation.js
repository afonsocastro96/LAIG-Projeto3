/**
 * FadeAnimation constructor.
 * @constructor
 * @param span {Integer} Animation duration in miliseconds.
 * @param startScale {Float} Initial value of alpha scaling.
 * @param endScale {Float} Final value of alpha scaling.
 */
function FadeAnimation(span, startScale, endScale) {
	this.span = span;
	this.startScale = startScale;
	this.endScale = endScale;
	this.scaleInc = (this.endScale - this.startScale) / this.span;
}

FadeAnimation.prototype = Object.create(Object.prototype);
FadeAnimation.prototype.constructor = FadeAnimation;


/**
 * Calculate the alpha scaling.
 * @param t {Integer} Time (in miliseconds) occurred since the beginning of the animation.
 */
FadeAnimation.prototype.getScaling = function(t) {
	if (t < 0) {
		return this.startScale;
	}
	if (t > this.span) {
		return this.endScale;
	}
	
	return this.startScale + this.scaleInc * t;
}