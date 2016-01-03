function ParabolicAnimation(start, end, elevation, peak, span) {
	this.start = start;
	this.end = end;
	this.elevation = elevation;
	this.peak = peak;
	this.span = span;
	this.init();
}

ParabolicAnimation.prototype = Object.create(Object.prototype);
ParabolicAnimation.prototype.constructor = ParabolicAnimation;

ParabolicAnimation.prototype.init = function() {
	var vector = [this.end[0] - this.start[0], this.end[1] - this.start[1], this.end[2] - this.start[2]];
	
	this.radius = this.vectorMagnitude(vector) / 2;
	
	this.angle = Math.acos(vector[0]/(this.radius * 2));
	if (vector[2] > 0) {
		this.angle = -this.angle;
	}
	
	var parabolaDistance = (Math.pow(this.radius,3)*Math.asinh(2*this.peak/this.radius) +
		2*this.peak*Math.sqrt(4*Math.pow(this.radius,2)*Math.pow(this.peak,2) + Math.pow(this.radius,4)))/
		(2*this.radius*this.peak);
	
	var totalDistance = parabolaDistance + 2 * this.elevation;
	
	var velocity = totalDistance / this.span;
	
	this.controlPointsTime = [0, this.elevation / velocity, (this.elevation + parabolaDistance) / velocity, this.span];
	this.controlPointsSpan = [];
	for (var i = 0; i < this.controlPointsTime.length - 1; ++i) {
		this.controlPointsSpan.push(this.controlPointsTime[i+1] - this.controlPointsTime[i]);
	}
	
	this.controlPoints = [];
	this.controlPoints.push(this.start);
	this.controlPoints.push([this.start[0], this.start[1] + this.elevation, this.start[2]]);
	this.controlPoints.push([this.end[0], this.end[1] + this.elevation, this.end[2]]);
	this.controlPoints.push(this.end);
	
	this.center = [];
	for (var i = 0; i < 3; ++i) {
		this.center.push((this.controlPoints[1][i] + this.controlPoints[2][i]) / 2);
	}
	
	var animation = this;
	
	this.pointFunction = [];
	this.pointFunction.push(function (t) {
		return animation.linearFunction(t, animation.controlPointsSpan[0], animation.controlPoints[0], animation.controlPoints[1]);
	});
	this.pointFunction.push(function (t) {
		return animation.parabolicFunction(t, animation.controlPointsSpan[1], animation.center,animation.radius,animation.peak, animation.angle);
	});
	this.pointFunction.push(function(t) {
		return animation.linearFunction(t, animation.controlPointsSpan[2], animation.controlPoints[2], animation.controlPoints[3]);
	});
}

ParabolicAnimation.prototype.getPoint = function(t) {
	if (t <= 0) {
        return this.start;
	}
	
	if (t >= this.span) {
		return this.end;
	}
	
	var index;
    for (index = this.controlPointsTime.length - 1; index > 0; --index)
        if (this.controlPointsTime[index] < t)
            break;

	return this.pointFunction[index](t - this.controlPointsTime[index]);
}

ParabolicAnimation.prototype.vectorMagnitude = function(vector) {
	return Math.sqrt(
		Math.pow(vector[0], 2) +
		Math.pow(vector[1], 2) +
		Math.pow(vector[2], 2));
}

ParabolicAnimation.prototype.linearFunction = function(t, span, start, end) {
	var point = [];
	
	for (var i = 0; i < start.length; ++i) {
		point.push(start[i] + (end[i] - start[i]) * t / span);
	}
	
	return point;
}

ParabolicAnimation.prototype.parabolicFunction = function(t, span, center, radius, peak, angle) {
	var x = -radius + 2 * radius * t / span;
	
	var y = -peak * (x - radius) * (x + radius) / Math.pow(radius, 2);
	
	var transformation = mat4.create();
	
	mat4.translate(transformation, transformation, vec3.fromValues(center[0], center[1], center[2]));
	mat4.rotateY(transformation, transformation, angle);
	mat4.translate(transformation, transformation, vec3.fromValues(x, y, 0));
	
	var point = vec3.fromValues(0, 0, 0);
	vec3.transformMat4(point, point, transformation);
	
	return point;
}