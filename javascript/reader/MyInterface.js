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
	options.add(this.scene, "currentCameraAngle", this.scene.cameraAngle).name("Current Camera Angle");
	
	var scene = this.scene;
	options.add(this.scene, "currentTheme", Object.keys(this.scene.themes))
		.name("Theme")
		.onFinishChange(function(value) {
			scene.setTheme(scene.themes[value]);
		}
	);
	this.interfaceLoaded = true;
}

