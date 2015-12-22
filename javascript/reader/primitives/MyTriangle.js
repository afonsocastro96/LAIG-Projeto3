/**
 * MyTriangle constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which this triangle belongs.
 * @param x1 {Float} First point x coordinate
 * @param y1 {Float} First point y coordinate
 * @param z1 {Float} First point z coordinate
 * @param x2 {Float} Second point x coordinate
 * @param y2 {Float} Second point y coordinate
 * @param z2 {Float} Second point z coordinate
 * @param x3 {Float} Third point x coordinate
 * @param y3 {Float} Third point y coordinate
 * @param z3 {Float} Third point z coordinate
 */
function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3){
    CGFobject.call(this,scene);

	this.v1 = vec3.fromValues(x1, y1, z1);
	this.v2 = vec3.fromValues(x2, y2, z2);
	this.v3 = vec3.fromValues(x3, y3, z3);
  
    this.initBuffers();
}

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

/**
 * Method in which the geometry of the cylinder is defined.
 */
MyTriangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.v1[0], this.v1[1], this.v1[2],
    	this.v2[0], this.v2[1], this.v2[2],
    	this.v3[0], this.v3[1], this.v3[2]
    ];

    this.indices = [0,1,2];

	var AB = vec3.create();
	vec3.sub(AB, this.v2, this.v1);
	var AC = vec3.create();
	vec3.sub(AC, this.v3, this.v1);
	var BC = vec3.create();
	vec3.sub(BC, this.v3, this.v2);

	var N = vec3.create();
	vec3.cross(N, AB, BC);
	vec3.normalize(N, N);

	this.normals = [
		N[0], N[1], N[2],
		N[0], N[1], N[2],
		N[0], N[1], N[2],
    ];

    var tC = (vec3.sqrLen(AB) + vec3.sqrLen(AC) - vec3.sqrLen(BC))/ (2 * vec3.length(AB));
	var sC = Math.sqrt(vec3.sqrLen(AC) - tC * tC);
	this.nonScaledTexCoords = [
		0,0,
		vec3.length(AB),0,
		sC, tC
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
MyTriangle.prototype.scaleTexCoords = function(ampS, ampT) {
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
		this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
	}
	this.updateTexCoordsGLBuffers();
}