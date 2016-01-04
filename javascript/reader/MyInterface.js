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
MyInterface.prototype.onGraphLoaded = function(){
	/* These options may be changed on the fly during the game */
	var options = this.gui.addFolder("Change Options");
	options.add(this.scene, "currentCameraAngle", this.scene.cameraAngle).name("Current Camera Angle");
	options.add(this.scene, "currentDifficulty", this.scene.botDifficulty).name("Current Difficulty");
	options.add(this.scene, "currentTheme", this.scene.gameThemes).name("Theme");
	options.add(this.scene, "requestBotMove").name("Request Bot Move"); // Para efeitos de mostrar o que ja esta feito, vai ser apagado

	/* A new game is started with the following options after clicking Start Game. Only the board type is sent to prolog. */
	this.gui.add(this.scene, "undoLastMove").name("Undo Last Move");
	this.gui.add(this.scene, "getSinkStreak").name("Get Sink Streak");

	this.interfaceLoaded = true;
}

