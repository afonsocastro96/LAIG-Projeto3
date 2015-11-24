/**
 * MyPatch constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which this cylinder belongs.
 * @param order {Integer} The order of the patch.
 * @param partsU {Integer} Number of parts along U.
 * @param partsV {Integer} Number of parts along V.
 * @param controlPoints {Array} The patch's control points.
 */
function MyPatch(scene, order, partsU, partsV, controlPoints){

	var controlPointsSurface = [];
	var nArrays = Math.sqrt(controlPoints.length);

	for(var i = 0; i < nArrays; ++i){
		var controlPointsTemp = [];
		for(var j = 0; j < nArrays; ++j){
			controlPointsTemp.push(controlPoints[i*nArrays+j]);
		}
		controlPointsSurface.push(controlPointsTemp);
	}


	var knots = [];

	for(var i = 0; i < (order+1); ++i){
		knots.push(0);
	}

	for(var i = 0; i < (order+1); ++i){
		knots.push(1);
	}

	var nurbsSurface = new CGFnurbsSurface(order, order, knots, knots, controlPointsSurface);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, partsU, partsV);

    this.fixTexCoords();
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

/**
 * fixes the texCoords along the s axis.
 */
MyPatch.prototype.fixTexCoords = function() {
	for (var i = 0; i < this.texCoords.length; i += 2)
		this.texCoords[i] = 1 - this.texCoords[i];

	this.initGLBuffers();
}

/**
 * texCoords scaling (no effect).
 */
MyPatch.prototype.scaleTexCoords = function() {}