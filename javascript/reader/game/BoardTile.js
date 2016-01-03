function BoardTile(scene) {
    this.scene = scene;
	this.alphaScaling = 1.0;
	this.setTransparency(false);
}

BoardTile.prototype = Object.create(CGFobject.prototype);
BoardTile.prototype.constructor = BoardTile;

BoardTile.prototype.display = function() {
	this.displayFunction();
}

BoardTile.prototype.defaultDisplay = function() {
	//do nothing
}

BoardTile.prototype.transparentDisplay = function() {
	var prevValue = this.scene.active.getUniformValue("uAlphaScaling");
	this.scene.activeShader.setUniformsValues({uAlphaScaling: this.alphaScaling});
	
	this.defaultDisplay();
	
	this.scene.activeShader.setUniformsValues({uAlphaScaling: prevValue});
}

BoardTile.prototype.setTransparency = function(bTransparent) {
	if (bTransparent) {
		this.displayFunction = this.transparentDisplay;
	}
	else {
		this.displayFunction = this.defaultDisplay;
	}
}

BoardTile.prototype.setAlphaScaling = function(alphaScaling) {
	this.alphaScaling = alphaScaling;
}