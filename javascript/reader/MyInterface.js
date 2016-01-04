/**
 * MyInterface constructor.
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param application {CGFapllication} Application this interface belongs to.
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
};

/**
 * Function to call when the SceneGraph is fully loaded.
 */
MyInterface.prototype.onSceneLoaded = function(){
	/* These options may be changed on the fly during the game */
	var options = this.gui.addFolder("Change Options");
	var scene = this.scene;
	var myInterface = this;
	options.add(this.scene, "currentCamera", Object.keys(this.scene.cameras))
		.name("Current Camera")
		.onFinishChange(function(value) {
			scene.setCamera(value);
			//myInterface.setActiveCamera(scene.camera);
		}
	);
	
	options.add(this.scene, "currentTheme", Object.keys(this.scene.themes))
		.name("Theme")
		.onFinishChange(function(value) {
			scene.setTheme(value);
		}
	);
	
	options.add(this.scene.gameSet, "turnDuration", this.scene.gameSet.minTurnDuration, this.scene.gameSet.maxTurnDuration)
		.name("Turn Duration");
	this.interfaceLoaded = true;
}

