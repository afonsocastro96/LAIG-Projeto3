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
    var group = this.gui.addFolder('Lights');
	var self = this;
	this.gui.close();

	for(key in this.scene.lightsEnabled){
	    var controller = group.add(this.scene.lightsEnabled,key);
	    controller.onChange(function(enable) {
	    	self.scene.updateLight(this.property, enable);
	    });
	}

	this.gui.add(this.scene, "resetTimer").name("Reset Timer");
}

/**
 * Scene setter.
 * @param scene {CGFscene} Scene to set.
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}