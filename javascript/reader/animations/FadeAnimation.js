function FadeAnimation(span, startScale, endScale) {
	this.span = span;
	this.startScale = startScale;
	this.endScale = endScale;
	this.scaleInc = (this.endScale - this.startScale) / this.span;
}

FadeAnimation.prototype = Object.create(Object.prototype);
FadeAnimation.prototype.constructor = FadeAnimation;

FadeAnimation.prototype.getScaling = function(t) {
	if (t < 0) {
		return this.startScale;
	}
	if (t > this.span) {
		return this.endScale;
	}
	
	return this.startScale + this.scaleInc * t;
}