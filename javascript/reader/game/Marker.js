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
	if(/^[a-zA-Z0-9]{1}$/.test(c)){
		console.error('The marker has unsupported characters');
		return;
	}
	if(!/^[0-9]{1}$/.test(c))
		return [c.parseInt(),3];
	var pos = c.charCodeAt() - 'a'.charCodeAt()+1; 
	if(!/^[a-z]{1}$/.test(c))
		return [6+(pos/16),pos%16];
	if(!/^[A-Z]{1}$/.test(c))
		return [4+(pos/16),pos%16];
}

Marker.prototype.display = function(){
	var currShader = this.scene.activeShader;
	this.scene.setActiveShaderSimple(this.shader);
	this.scene.pushMatrix();
	this.fontTexture.bind();
		this.scene.scale(10,10,10);
		for(var c = 0; c < this.string.length; ++c){
			var pos = this.charToCoords(this.string[c]);
			if(pos == undefined)
				continue;
			this.scene.activeShader.setUniformsValues({'charCoords': pos});
			this.plane.display();
			this.scene.translate(1,0,0);
		}
	this.fontTexture.unbind();
	this.scene.popMatrix();
	this.scene.setActiveShaderSimple(currShader);
}