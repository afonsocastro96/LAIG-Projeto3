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
    this.graph = null;
    this.themeLoaded = "Wave";

    this.initCameras();

    this.initLights();

    this.initObjects();

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
	
	this.nextPickId = 1;
	this.setPickEnabled(true);
};

/**
 * Interface setter.
 * @param myinterface {CGFinterface} Interface to set.
 */
MyLSXScene.prototype.setInterface = function(myinterface) {
	this.myinterface = myinterface;
	this.initUserOptions();
}

/**
 * Initializes scene objects.
 */
MyLSXScene.prototype.initObjects = function() {
	this.primitives = [];
	this.startGame();
}

/**
 * Initializes scene lights.
 */
MyLSXScene.prototype.initLights = function () {
	this.lightsEnabled = [];
};

/**
 * Initializes scene cameras.
 */
MyLSXScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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

/**
 * Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
MyLSXScene.prototype.onGraphLoaded = function () 
{
	this.camera.near = this.graph.initials.frustum.near;
	this.camera.far = this.graph.initials.frustum.far;

    if (this.graph.initials.referenceLength > 0)
	   this.axis = new CGFaxis(this, this.graph.initials.referenceLength);
	   
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.lights = [];

    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights.push(this.graph.lights[i]);
    	this.lights[i].setVisible(false);
    	this.lightsEnabled[this.lights[i]._id] = this.lights[i].enabled;
    }

    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this, leaf.v1x, leaf.v1y, leaf.v2x, leaf.v2y);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyCylinder(this, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.slices, leaf.stacks);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this, leaf.radius, leaf.slices, leaf.stacks);
				break;
			case "plane":
				this.primitives[key] = new MyPlane(this, leaf.parts);
				break;
			case "patch":
				this.primitives[key] = new MyPatch(this, leaf.order, leaf.partsU, leaf.partsV, leaf.controlPoints);
				break;
			case "vehicle":
				this.primitives[key] = new MyVehicle(this);
				break;
			case "terrain":
				this.primitives[key] = new MyTerrain(this, leaf.textureUrl, leaf.heightmapUrl);
				break;
			default:
				console.warn("Unknown primitive: " + leaf.type);
				break;
    	}
    }

    this.timer = 0;
    this.setUpdatePeriod(100/6);

	if (this.myinterface != null && !this.myinterface.interfaceLoaded){
	    this.myinterface.onGraphLoaded();
	}
};

/**
 * Display the scene elements.
 */
MyLSXScene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	this.clearPickRegistration();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	this.setDefaultAppearance();
	
	this.pushMatrix();
	if (this.graph != null && this.graph.loadedOk) {
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
	if (this.graph != null && this.graph.loadedOk)
	{	
		this.multMatrix(this.graph.initials.transformationMatrix);
	
		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();

		this.setDefaultAppearance();
		// Draw axis
		if (this.axis)
	   		this.axis.display();

	   	// Draw objects
		this.setDefaultAppearance();
		
		this.drawSceneGraph();
		
		if(this.gameSet != undefined)
			this.gameSet.display();
		
	}	
};

MyLSXScene.prototype.initUserOptions = function() {
	this.currentDifficulty = "Easy";
	this.currentGameType = "Human vs Bot";
	this.currentCameraAngle = "Oblique View";
	this.currentBoardType = "Syrtis Minor";
	this.currentTheme = "Wave";

	this.botDifficulty = ["Easy", "Hard"];
	this.gameType = ["Human vs Bot", "Human vs Human", "Bot vs Bot"];
	this.cameraAngle = ["Oblique View", "Upward View"];
	this.boardType = ["Syrtis Minor", "Syrtis Major"];
	this.themes = ["Wave", "Sandbar"];
}

MyLSXScene.prototype.startGame = function() {
	if(this.myinterface == null)
		return;

	var currentBoardType;

	if(this.currentBoardType == "Syrtis Minor")
		currentBoardType = 0;
	else currentBoardType = 1;

	var requestString = "[startgame," + currentBoardType + "]";
	makeRequest(this, requestString,this.startGameHandler);
}


MyLSXScene.prototype.startGameHandler = function(target, request) {
	var board = JSON.parse(request);
	var gameBoard = [];
	for(var row = 0; row < board.length; ++row){
		var currentRow = [];
		for(var col = 0; col < board[row].length; ++col){
			switch(board[row][col][0]){
				case 0:
					currentRow.push(new EmptyTile());
					break;
				case 1:
					if(board[row][col][1] == 3)
						currentRow.push(new WhiteCircleTile(target));
					else
						currentRow.push(new WhiteSquareTile(target));
					break;
				case 2:
					if(board[row][col][1] == 3)
						currentRow.push(new BlackCircleTile(target));
					else
						currentRow.push(new BlackSquareTile(target));
					break;
				default:
					break;
			}
		}
		gameBoard.push(currentRow);
	}
	target.gameSet = new GameSet(target);
	target.gameSet.init(new GameBoard(target, gameBoard));
	var tile = target.gameSet.board.getTile(1,1);
	target.gameSet.slide(1,1,0,1);
	target.gameSet.sink(0, 1);
	target.gameSet.rise(0, 1, tile);
}

MyLSXScene.prototype.requestBotMove = function() {
	if(this.myinterface == null)
		return;

	var requestString = "[botmove," + this.currentDifficulty + "]";

	makeRequest(this, requestString);
}

MyLSXScene.prototype.undoLastMove = function() {
	if(this.myinterface == null)
		return;

	var requestString = "[undo]";
	
	makeRequest(this, requestString);
}

MyLSXScene.prototype.getSinkStreak = function(){
	if(this.myinterface == null)
		return;

	var requestString = "[sinkstreak]";
	makeRequest(this, requestString);
}

/**
 * Draws the scene elements represented in the SceneGraph.
 */
MyLSXScene.prototype.drawSceneGraph = function() {
	if(this.currentTheme != this.themeLoaded){
		this.themeLoaded = this.currentTheme;
		switch(this.themeLoaded){
			case 'Wave':
				graph = new LSXSceneGraph("wave.lsx", this);
				break;
			case 'Sandbar':
				graph = new LSXSceneGraph("sandbar.lsx", this);
				break;
		}
	}

	this.drawNode(this.graph.root, "null", "clear");
	this.setDefaultAppearance();
}

/**
 * Draws the nodes represented in the SceneGraph.
 * @param node {String} Node to draw.
 * @param parentMaterial {String} Parent node's material.
 * @param parentTexture {String} Parent node's texture.
 */
MyLSXScene.prototype.drawNode = function(node, parentMaterial, parentTexture) {
	if (node in this.primitives) {
		if (parentMaterial != "null")
			this.graph.materials[parentMaterial].apply();
		else
			this.setDefaultAppearance();
	
		var texture;

		if (parentTexture != "clear")
		{
			texture = this.graph.textures[parentTexture];
			this.primitives[node].scaleTexCoords(texture.amplifyFactor.s, texture.amplifyFactor.t);
			texture.bind();
		}
					
		this.primitives[node].display();

		if (texture)
			texture.unbind();
		return;
	}

	this.pushMatrix();
	
	this.applyAnimation(this.graph.nodes[node]);
	this.multMatrix(this.graph.nodes[node].transformationMatrix);

	var material = this.graph.nodes[node].material;
	if (material == "null")
		material = parentMaterial;

	var texture = this.graph.nodes[node].texture;
	if (texture == "null")
		texture = parentTexture;

	var descendants = this.graph.nodes[node].descendants;
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
	if (this.lastUpdate != 0)
		this.timer += (currTime - this.lastUpdate) / 1000;
	
	for (var i = 0; i < this.updatables.length; ++i)
		this.updatables[i].update(currTime);
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
		if (t < this.graph.animations[node.animations[animationIndex]].span)
			break;
		t -= this.graph.animations[node.animations[animationIndex]].span;
	}
	var animation = this.graph.animations[node.animations[animationIndex]];

	var animationMatrix = animation.calculateMatrix(t);

	this.multMatrix(animationMatrix);
}

MyLSXScene.clearPickRegistration = function() {
	CGFscene.prototype.clearPickRegistration.call(this);
	this.nextPickId = 1;
}

MyLSXScene.registerNextPick = function(object) {
	CGFscene.prototype.registerForPick(this.nextPickId, object);
	++this.nextPickId;
}