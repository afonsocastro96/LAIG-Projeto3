function BoardTile(scene) {
    this.scene = scene;
	this.displayFunction = this.transparentDisplay;
	this.alphaScaling = 1.0;
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
	var prevValue = this.scene.transparencyShader.getUniformValue("uAlphaScaling");
	this.scene.transparencyShader.setUniformsValues({uAlphaScaling: this.alphaScaling});
	
	this.defaultDisplay();
	
	this.scene.transparencyShader.setUniformsValues({uAlphaScaling: prevValue});
}

BoardTile.prototype.transparentTile = function(bTransparent) {
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