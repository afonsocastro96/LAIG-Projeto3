function Marker(scene, string) {
	CGFobject.call(this, scene);
	this.string = string;
	this.shader = new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");
	this.shader.setUniformsValues({'dims': [16, 16]});
	this.fontTexture = new CGFtexture(this.scene, "fonts/oolite-font.png");
	this.plane = new MyPlane(this.scene, 100);
}

Marker.prototype = Object.create(CGFobject.prototype);
Marker.prototype.constructor = Marker;

Marker.prototype.charToCoords = function(c){
	var pos = c.charCodeAt();
	return [pos%16,Math.trunc(pos/16)];
}

Marker.prototype.display = function(){
	var currShader = this.scene.activeShader;
	this.scene.setActiveShaderSimple(this.shader);
	
	this.scene.pushMatrix();
		this.fontTexture.bind();
		this.scene.translate(-this.string.length/2, 0,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		for(var c = 0; c < this.string.length; ++c){
			var pos = this.charToCoords(this.string[c]);
			this.scene.activeShader.setUniformsValues({'charCoords': pos});
			this.plane.display();
			this.scene.translate(1,0,0);
		}
		this.fontTexture.unbind();
	this.scene.popMatrix();
	this.scene.setActiveShaderSimple(currShader);
}