/**
 * MyLSXScene constructor.
 * @constructor
 */
function MyLSXScene() {
    CGFscene.call(this);
}

MyLSXScene.prototype = Object.create(CGFscene.prototype);
MyLSXScene.prototype.constructor = MyLSXScene;

/**
 * Initializes the scene.
 * @param application {CGFapplication} Application this scene belongs to.
 */
MyLSXScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.updatables = [];
	
    this.myinterface = null;
    this.theme = null;

    this.initCameras();
    this.initLights();
    this.initThemes();

	this.transparencyShader = new CGFshader(this.gl, this.defaultShader.vertexURL, "shaders/alphaScaling.frag");
	this.transparencyShader.setUniformsValues({uAlphaScaling: 1.0} );

	this.setActiveShader(this.transparencyShader);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.enableTextures(true);
	
    this.setUpdatePeriod(100/6);
	
	this.nextPickId = 1;
	this.setPickEnabled(true);
	
	this.initUserOptions();
	
	this.gameSet = new GameSet(this);
	this.gameSet.init();
};

/**
 * Interface setter.
 * @param myinterface {CGFinterface} Interface to set.
 */
MyLSXScene.prototype.setInterface = function(myinterface) {
	this.myinterface = myinterface;
	this.myinterface.onSceneLoaded();
}

/**
 * Initializes scene lights.
 */
MyLSXScene.prototype.initLights = function () {
	this.lightsEnabled = [];
};

/**
 * Initializes scene themes.
 */
MyLSXScene.prototype.initThemes = function () {
	this.themes = [];
};

/**
 * Initializes scene cameras.
 */
MyLSXScene.prototype.initCameras = function () {
	
	this.cameraPositions = [];
	
	this.cameraPositions["Oblique View"] = vec3.fromValues(15, 15,15);
	this.cameraPositions["Upward View"] = vec3.fromValues(0.1, 25, 0);
	
	this.camera = new CGFcamera(0.4, 0.1, 500, this.cameraPositions["Oblique View"], vec3.fromValues(0, 0, 0))
};

/**
 * Applies the default appearance to the scene.
 */
MyLSXScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.2, 0.2, 1.0);
    this.setDiffuse(0.4, 0.4, 0.4, 1.0);
    this.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.setShininess(10.0);	
};


MyLSXScene.prototype.addTheme = function(theme) {
	this.themes[theme.id] = theme;
}

MyLSXScene.prototype.setCamera = function(cameraId) {
	var scene = this;
	if (this.updatingCamera)
		return;
	
	this.updatingCamera = true;
	
	this.addUpdatable({
		startTime: Date.now(),
		startPosition: vec3.clone(scene.camera.position),
		endPosition: vec3.clone(scene.cameraPositions[cameraId]),
		span : 3000,
		update : function(currTime) {
			var delta = currTime - this.startTime;
			if (delta >= this.span) {
				console.log("Camera changed");
				scene.camera.setPosition(this.endPosition);
				scene.removeUpdatable(this);
				scene.updatingCamera = false;
				if (scene.camera.position[0] != scene.cameraPositions[scene.currentCamera][0] ||
					scene.camera.position[1] != scene.cameraPositions[scene.currentCamera][1] ||
					scene.camera.position[2] != scene.cameraPositions[scene.currentCamera][2]) {
					console.log("another camera");
					scene.setCamera(scene.currentCamera);
				}
				return;
			}
			
			var position = [];
			position.push(this.startPosition[0] + (this.endPosition[0] - this.startPosition[0]) * delta / this.span);
			position.push(this.startPosition[1] + (this.endPosition[1] - this.startPosition[1]) * delta / this.span);
			position.push(this.startPosition[2] + (this.endPosition[2] - this.startPosition[2]) * delta / this.span);
			scene.camera.setPosition(vec3.fromValues(position[0], position[1], position[2]));
		}
	});
}

MyLSXScene.prototype.setTheme = function(themeId) {
	if (this.theme != null && this.theme.id == themeId) {
		return;
	}
	var theme = this.themes[themeId];
	this.theme = theme;
	this.currentTheme = theme.id;
	this.camera.near = theme.graph.initials.frustum.near;
	this.camera.far = theme.graph.initials.frustum.far;
	this.updateCameraPositions();
	
	if (theme.graph.initials.referenceLength > 0)
		this.axis = new CGFaxis(this, theme.graph.initials.referenceLength);
	else
		this.axis = null;
   
	this.gl.clearColor(theme.graph.illumination.background[0],theme.graph.illumination.background[1],theme.graph.illumination.background[2],theme.graph.illumination.background[3]);
	this.setGlobalAmbientLight(theme.graph.illumination.ambient[0],theme.graph.illumination.ambient[1],theme.graph.illumination.ambient[2],theme.graph.illumination.ambient[3]);

	this.lights = [];

	for (var i = 0; i < theme.graph.lights.length; ++i) {
		this.lights.push(theme.graph.lights[i]);
		this.lights[i].setVisible(false);
		this.lightsEnabled[this.lights[i]._id] = this.lights[i].enabled;
	}
	
    this.timer = 0;
}

MyLSXScene.prototype.updateCameraPositions = function() {
    this.loadIdentity();
	this.multMatrix(this.theme.graph.initials.transformationMatrix);
	this.updateCameraPositionsLoop(this.theme.graph.root);
}

MyLSXScene.prototype.updateCameraPositionsLoop = function(node) {
	if (node in this.theme.primitives) {
		if (this.theme.primitives[node] == this.gameSet) {
			var target = vec3.fromValues(0, 0, 0);
			var transformationMatrix = this.getMatrix();
			vec3.transformMat4(target, target, transformationMatrix);
			
			this.cameraPositions["Oblique View"] = vec3.fromValues(15, 15,15);
			vec3.transformMat4(this.cameraPositions["Oblique View"], this.cameraPositions["Oblique View"], transformationMatrix);
			this.cameraPositions["Upward View"] = vec3.fromValues(0.1, 25, 0);
			vec3.transformMat4(this.cameraPositions["Upward View"], this.cameraPositions["Upward View"], transformationMatrix);
			
			this.camera.setTarget(target);
			this.camera.setPosition(this.cameraPositions[this.currentCamera]);
		}
		return;
	}
	this.pushMatrix();
	this.multMatrix(this.theme.graph.nodes[node].transformationMatrix);
	var descendants = this.theme.graph.nodes[node].descendants;
	for (var i = 0; i < descendants.length; ++i) {
		this.updateCameraPositionsLoop(descendants[i]);
	}
	this.popMatrix();
}

MyLSXScene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					obj.onPick();
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

/**
 * Display the scene elements.
 */
MyLSXScene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	this.logPicking();
	this.resetPickRegistration();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	this.setDefaultAppearance();
	
	this.pushMatrix();
	if (this.theme != null && this.theme.loaded) {
		if(this.gameSet != undefined)
			this.gameSet.displayHUD();
	}
	this.popMatrix();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.theme != null && this.theme.loaded)
	{	
		this.multMatrix(this.theme.graph.initials.transformationMatrix);
	
		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();

		this.setDefaultAppearance();
		// Draw axis
		if (this.axis)
	   		this.axis.display();

	   	// Draw objects
		this.setDefaultAppearance();
		
		this.drawSceneGraph();
	}	
};

MyLSXScene.prototype.initUserOptions = function() {
	this.currentCamera = "Oblique View";
	this.currentTheme = "Wave";
}

/**
 * Draws the scene elements represented in the SceneGraph.
 */
MyLSXScene.prototype.drawSceneGraph = function() {
	this.drawNode(this.theme.graph.root, "null", "clear");
	this.setDefaultAppearance();
}

/**
 * Draws the nodes represented in the SceneGraph.
 * @param node {String} Node to draw.
 * @param parentMaterial {String} Parent node's material.
 * @param parentTexture {String} Parent node's texture.
 */
MyLSXScene.prototype.drawNode = function(node, parentMaterial, parentTexture) {
	if (node in this.theme.primitives) {
		if (parentMaterial != "null")
			this.theme.graph.materials[parentMaterial].apply();
		else
			this.setDefaultAppearance();
	
		var texture;

		if (parentTexture != "clear")
		{
			texture = this.theme.graph.textures[parentTexture];
			this.theme.primitives[node].scaleTexCoords(texture.amplifyFactor.s, texture.amplifyFactor.t);
			texture.bind();
		}
					
		this.theme.primitives[node].display();

		if (texture)
			texture.unbind();
		return;
	}

	this.pushMatrix();
	
	this.applyAnimation(this.theme.graph.nodes[node]);
	this.multMatrix(this.theme.graph.nodes[node].transformationMatrix);

	var material = this.theme.graph.nodes[node].material;
	if (material == "null")
		material = parentMaterial;

	var texture = this.theme.graph.nodes[node].texture;
	if (texture == "null")
		texture = parentTexture;

	var descendants = this.theme.graph.nodes[node].descendants;
	for (var i = 0; i < descendants.length; ++i) {
		this.drawNode(descendants[i], material, texture);
	}

	this.popMatrix();
}

/**
 * Updates the scene's lights.
 * @param lightId {String} Identification of the light to update.
 * @param enable {Boolean} Whether the light is enabled or not.
 */
MyLSXScene.prototype.updateLight = function(lightId, enable) {
	for (var i = 0; i < this.lights.length; ++i) {
		if (this.lights[i]._id == lightId) {
			var light = this.lights[i];
			enable ? light.enable() : light.disable();
			return;
		}
	}
}

/**
 * Resets the timer.
 */
MyLSXScene.prototype.resetTimer = function() {
	this.timer = 0;
}

/**
 *	Updates the scene's time.
 *	@param currTime {Float} The current time in milliseconds.
 */
MyLSXScene.prototype.update = function(currTime) {
	if (this.lastUpdate != 0) {
		this.timer += (currTime - this.lastUpdate) / 1000;
	
		this.gameSet.update(currTime);
	
		for (var i = 0; i < this.updatables.length; ++i)
			this.updatables[i].update(currTime);
	}
}

MyLSXScene.prototype.addUpdatable = function(updatable) {
	this.updatables.push(updatable);
}

MyLSXScene.prototype.removeUpdatable = function(updatable) {
	var index = this.updatables.indexOf(updatable);
	if(index != -1) {
		this.updatables.splice(index, 1);
	}
}

/**
 *	Applies an animation to a node.
 *	@param node {SceneGraphNode} Node to apply the animation to.
 */
MyLSXScene.prototype.applyAnimation = function(node) {
	if (node.animations.length == 0)
		return;

	var t = this.timer;
	var animationIndex;
	for (animationIndex = 0; animationIndex < node.animations.length - 1; ++animationIndex) {
		if (t < this.theme.graph.animations[node.animations[animationIndex]].span)
			break;
		t -= this.theme.graph.animations[node.animations[animationIndex]].span;
	}
	var animation = this.theme.graph.animations[node.animations[animationIndex]];

	var animationMatrix = animation.calculateMatrix(t);

	this.multMatrix(animationMatrix);
}

MyLSXScene.prototype.resetPickRegistration = function() {
	CGFscene.prototype.clearPickRegistration.call(this);
	this.nextPickId = 1;
}

MyLSXScene.prototype.registerNextPick = function(object) {
	CGFscene.prototype.registerForPick.call(this,this.nextPickId, object);
	++this.nextPickId;
}