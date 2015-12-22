/**
 * MyRectangle constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which this rectangle belongs.
 * @param x1 {Float} X Coordinate of top-left point
 * @param y1 {Float} Y Coordinate of top-left point
 * @param x2 {Float} X Coordinate of bottom-right point
 * @param y2 {Float} Y Coordinate of bottom-right point
 */
function MyRectangle(scene,x1,y1,x2,y2){
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    
    this.x2 = x2;
    this.y2 = y2;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

/**
 * Method in which the geometry of the cylinder is defined.
 */
MyRectangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.x1, this.y2, 0,
    	this.x2, this.y2, 0,
    	this.x2, this.y1, 0,
    	this.x1, this.y1, 0
    ];

    this.indices = [
    	0, 1, 2,
    	0, 2, 3
    ];

	this.normals = [
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1
    ];

    this.nonScaledTexCoords = [
    	0, this.y1-this.y2,
    	this.x2-this.x1, this.y1-this.y2,
    	this.x2-this.x1, 0,
    	0, 0
    ];

	this.texCoords = this.nonScaledTexCoords.slice(0);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

/**
 * texCoords scaling.
 * @param ampS {Float} Scaling along the S axis.
 * @param ampT {Float} Scaling along the T axis.
 */
MyRectangle.prototype.scaleTexCoords = function(ampS, ampT) {
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
		this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
	}

	this.updateTexCoordsGLBuffers();
}