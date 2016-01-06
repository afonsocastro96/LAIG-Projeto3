/**
 * Marker constructor.
 * @constructor
 * @param scene {CGFscene} scene this marker belongs to.
 */
function Marker(scene) {
	CGFobject.call(this, scene);
	if (!Marker.shaderInitialized) {
		Marker.initializeShader(scene);
	}
	this.plane = new MyPlane(this.scene, 100);
	this.setText("");
}

Marker.prototype = Object.create(CGFobject.prototype);
Marker.prototype.constructor = Marker;

Marker.shaderInitialized = false;

/**
 * Initialize marker shader.
 * @param scene {CGFscene} scene linked to marker shader.
 */
Marker.initializeShader = function(scene) {
	Marker.shader = new CGFshader(scene.gl, "shaders/font.vert", "shaders/font.frag");
	Marker.shader.setUniformsValues({'dims': [16, 16]});
	Marker.fontTexture = new CGFtexture(scene, "fonts/oolite-font.png");
	Marker.shaderInitialized = true;
}

/**
 * Set marker text.
 * @param string {String} marker text.
 */
Marker.prototype.setText = function(string) {
	this.string = string;
}

/**
 * Map character to font coordinates.
 * @param c {Character} character to map
 * @return {Array(2)} font coordinates.
 */
Marker.prototype.charToCoords = function(c){
	var pos = c.charCodeAt();
	return [pos%16,Math.trunc(pos/16)];
}

/**
 * Display marker.
 */
Marker.prototype.display = function(){
	var currShader = this.scene.activeShader;
	this.scene.setActiveShaderSimple(Marker.shader);
	
	this.scene.pushMatrix();
		Marker.fontTexture.bind();
		this.scene.translate(-(this.string.length - 1)/2, 0,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		for(var c = 0; c < this.string.length; ++c){
			var pos = this.charToCoords(this.string[c]);
			this.scene.activeShader.setUniformsValues({'charCoords': pos});
			this.plane.display();
			this.scene.translate(1,0,0);
		}
		Marker.fontTexture.unbind();
	this.scene.popMatrix();
	this.scene.setActiveShaderSimple(currShader);
}