/**
 * LinearAnimation constructor.
 * @constructor
 * @param id {String} The animation's id.
 * @param span {Float} The animation's span.
 * @param controlPoints {Array} The animation's control points.
 */
function LinearAnimation(id, span, controlPoints) {
    Animation.call(this, id, span, "linear");

    this.controlPoints = controlPoints;

    this.init();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/**
 * Initiates the animation.
 */
LinearAnimation.prototype.init = function() {
    if (this.controlPoints.length == 1)
        return;
    var distance = 0;
    this.translations = new Array(this.controlPoints.length - 1);
    this.rotations = new Array(this.controlPoints.length - 1);

    for (var i = 0; i < this.controlPoints.length - 1; ++i) {
        var vector = vec3.create();
        vec3.sub(vector, this.controlPoints[i + 1], this.controlPoints[i]);
        this.translations[i] = vector;

        var projectionXZ = vec3.fromValues(vector[0], 0, vector[2]);

        if (vec3.length(projectionXZ) > 0) {
            var sign = projectionXZ[2] < 0 ? 1 : -1;
            this.rotations[i] = sign * Math.acos(vec3.dot(projectionXZ, vec3.fromValues(1, 0, 0))/ vec3.length(projectionXZ));
        } else {
            this.rotations[i] = (i == 0 ? 0 : this.rotations[i - 1]);  
        }
    
        distance += vec3.length(vector);
    }

    var velocity = distance / this.span;

    this.controlPointsTime = new Array(this.controlPoints.length);
    this.controlPointsTime[0] = 0;

    this.controlPointsSpan = new Array(this.controlPoints.length - 1);

    for (var i = 1; i < this.controlPoints.length; ++i) {    
        this.controlPointsTime[i] = this.controlPointsTime[i - 1] +
                               vec3.length(this.translations[i-1]) / velocity;
        this.controlPointsSpan[i-1] = this.controlPointsTime[i] - this.controlPointsTime[i-1]; 
    }
}

/** 
 * Calculates the matrix while the animation is running.
 * @param t {Float} The current time.
 * @return {mat4} Animation matrix.
 */
LinearAnimation.prototype.calculateMatrix = function(t) {
    var matrix = mat4.create();
    mat4.identity(matrix);
    
    if (t < 0)
        return matrix;

    t = Math.min(t, this.span);

    if (this.controlPoints.length == 1) {
        mat4.translate(matrix, matrix, this.controlPoints[0]);
        return matrix;
    }
   
    var index;
    for (index = this.controlPointsTime.length - 1; index > 0; --index)
        if (this.controlPointsTime[index] < t)
            break;

    var tScale = (t - this.controlPointsTime[index]) / this.controlPointsSpan[index];
    var position = vec3.clone(this.controlPoints[index]);
    var translation_amount = vec3.create();
    vec3.scale(translation_amount, this.translations[index], tScale);
    vec3.add(position, position, translation_amount); 

    mat4.translate(matrix, matrix, position);
    mat4.rotateY(matrix,matrix,this.rotations[index]);
    
    return matrix;
}