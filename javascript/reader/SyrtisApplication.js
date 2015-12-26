/**
 * SyrtisApplication constructor.
 * @constructor
 * @param element : HTMLElement A reference to the HTML element in which the WebGL canvas will be included.
 */
function SyrtisApplication(element) {
	CGFapplication.call(this, element);
}

SyrtisApplication.prototype = Object.create(CGFapplication.prototype);
SyrtisApplication.prototype.constructor = SyrtisApplication();

SyrtisApplication.prototype.setState = function(state) {
	this.setScene(state.scene);
	this.setInterface(state.interface);
}