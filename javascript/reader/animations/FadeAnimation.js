function FadeAnimation(object, span, startScale, endScale) {
	this.object = object;
	this.span = span;
	this.updateFunction = this.finishedFunction;
	this.startScale = startScale;
	this.endScale = endScale;
	this.scaleInc = (this.endScale - this.startScale) / this.span;
}

FadeAnimation.prototype = Object.create(Object.prototype);
FadeAnimation.prototype.constructor = FadeAnimation;

FadeAnimation.prototype.start = function() {
	this.startTime = Date.now();
	this.finished = false;
	this.updateFunction = this.updateObject;
}

FadeAnimation.prototype.update = function(currentTime) {
	this.updateFunction(currentTime);
}

FadeAnimation.prototype.updateObject = function(currentTime) {
	var delta = this.startTime - currentTime;
	if (delta > this.span) {
		this.object.setAlphaScaling(this.endScale);
		this.finished = true;
		this.updateFunction = this.finishedFunction;
		return;
	}
	
	this.object.setAlphaScaling(this.startScale + this.scaleInc * delta);
}

FadeAnimation.prototype.finishedFunction = function() {
	// do nothing
}
