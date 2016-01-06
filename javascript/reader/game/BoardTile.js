/**
 * BoardTile constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the DarkTower belongs.
 */
function BoardTile(scene) {
    this.scene = scene;
	this.alphaScaling = 1.0;
	this.setTransparency(false);
}

BoardTile.prototype = Object.create(CGFobject.prototype);
BoardTile.prototype.constructor = BoardTile;

/**
* Display function used to render this object.
*/
BoardTile.prototype.display = function() {
	this.displayFunction();
}

BoardTile.prototype.defaultDisplay = function() {
	//do nothing
}

/**
* Display function used when a move is possible with this tile.
*/
BoardTile.prototype.transparentDisplay = function() {
	var prevValue;
	if (!this.scene.pickMode) {
		prevValue = this.scene.activeShader.getUniformValue("uAlphaScaling");
		this.scene.activeShader.setUniformsValues({uAlphaScaling: this.alphaScaling});
	}
	this.defaultDisplay();
	
	if (!this.scene.pickMode) {
		this.scene.activeShader.setUniformsValues({uAlphaScaling: prevValue});
	}
}

/**
* Sets the transparency of the tile, according to the fact that there is a move possible with this tile or not
*/
BoardTile.prototype.setTransparency = function(bTransparent) {
	if (bTransparent) {
		this.displayFunction = this.transparentDisplay;
	}
	else {
		this.displayFunction = this.defaultDisplay;
	}
}

/**
* Sets the alpha scaling for when a move is possible for this tile
*/
BoardTile.prototype.setAlphaScaling = function(alphaScaling) {
	this.alphaScaling = alphaScaling;
}