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

	var play = this.gui.addFolder('Make play');

	var sink = play.addFolder('Sink Tile');
	this.sinkXCoord = 1;
	this.sinkYCoord = 1;
	sink.add(this, 'sinkXCoord', 1, 7).step(1).name('X Coord');
	sink.add(this, 'sinkYCoord', 1, 7).step(1).name('Y Coord');
	this.sinkConfirm = function() { this.makeRequest('sink'); };
	sink.add(this, 'sinkConfirm').name('Make play');

	var slide = play.addFolder('Slide Tile');
	this.slideStartXCoord = 1;
	this.slideStartYCoord = 1;
	this.slideEndXCoord = 1;
	this.slideEndYCoord = 1;
	slide.add(this, 'slideStartXCoord', 1, 7).step(1).name('Start X Coord');
	slide.add(this, 'slideStartYCoord', 1, 7).step(1).name('Start Y Coord');
	slide.add(this, 'slideEndXCoord', 1, 7).step(1).name('End X Coord');
	slide.add(this, 'slideEndYCoord', 1, 7).step(1).name('End Y Coord');
	this.slideConfirm = function() { this.makeRequest('slide'); };
	slide.add(this, 'slideConfirm').name('Make play');

	var movetower = play.addFolder('Move Tower');
	this.moveStartXCoord = 1;
	this.moveStartYCoord = 1;
	this.moveEndXCoord = 1;
	this.moveEndYCoord = 1;
	movetower.add(this, 'moveStartXCoord', 1, 7).step(1).name('Start X Coord');
	movetower.add(this, 'moveStartYCoord', 1, 7).step(1).name('Start Y Coord');
	movetower.add(this, 'moveEndXCoord', 1, 7).step(1).name('End X Coord');
	movetower.add(this, 'moveEndYCoord', 1, 7).step(1).name('End Y Coord');
	this.moveConfirm = function() { this.makeRequest('move'); };
	movetower.add(this, 'moveConfirm').name('Make play');


	var pass = play.addFolder('Pass');
	this.passConfirm = function() { this.makeRequest('pass'); };
	pass.add(this, 'passConfirm').name('Make play');
}

/**
 * Scene setter.
 * @param scene {CGFscene} Scene to set.
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}

/* Handle the prolog connection */
MyInterface.prototype.handleReply = function(data){
	response=JSON.parse(data.target.response);
	console.log(response.answer);		// Access message and show
}

MyInterface.prototype.makeRequest = function(play){
	switch(play){
		case 'sink':
			var requestString = "[sink," + this.sinkXCoord + "," + this.sinkYCoord + "]";
			break;
		case 'slide':
			var requestString = "[slide," + this.slideStartXCoord + "," + this.slideStartYCoord + "," + this.slideEndXCoord + "," + this.slideEndYCoord + "]";
			break;
		case 'move':
			var requestString = "[move," + this.moveStartXCoord + "," + this.moveStartYCoord + "," + this.moveEndXCoord + "," + this.moveEndYCoord + "]";
			break;
		case 'pass':
			var requestString = "[pass]";
	}
	this.postGameRequest(requestString, this.handleReply);
}

MyInterface.prototype.postGameRequest = function(requestString, onSuccess, onError)
{
	var request = new XMLHttpRequest();
	request.open('POST', '../../game', true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('requestString='+encodeURIComponent(requestString));			
}