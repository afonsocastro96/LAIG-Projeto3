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

	// Para efeitos de mostrar o que ja esta feito, vai ser tudo apagado
	var play = this.gui.addFolder('Make play');
	/* PLAYS */
		var sink = play.addFolder('Sink Tile');
		this.sinkXCoord = 1;
		this.sinkYCoord = 1;
		sink.add(this, 'sinkXCoord', 1, 7).step(1).name('X Coord');
		sink.add(this, 'sinkYCoord', 1, 7).step(1).name('Y Coord');
		this.sinkConfirm = function() { makeRequest('sink'); };
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
		this.slideConfirm = function() { makeRequest('slide'); };
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
		this.moveConfirm = function() { makeRequest('move'); };
		movetower.add(this, 'moveConfirm').name('Make play');


		var pass = play.addFolder('Pass');
		this.passConfirm = function() { makeRequest('pass'); };
		pass.add(this, 'passConfirm').name('Make play');
	/* END OF PLAYS */

	/* These options may be changed on the fly during the game */
	var options = this.gui.addFolder("Change Options");
	options.add(this.scene, "currentCameraAngle", this.scene.cameraAngle).name("Current Camera Angle");
	options.add(this.scene, "currentDifficulty", this.scene.botDifficulty).name("Current Difficulty");
	options.add(this.scene, "requestBotMove").name("Request Bot Move"); // Para efeitos de mostrar o que ja esta feito, vai ser apagado

	/* A new game is started with the following options after clicking Start Game. Only the board type is sent to prolog. */
	var newGame = this.gui.addFolder("Start New Game");
	newGame.add(this.scene, "currentGameType", this.scene.gameType).name("Current Game Type"); //Eu nao sou mandado para o prolog.
																							   //apenas determino qunado e que um requestBotMove e feito,
																							   //mas isso e decidido pelo JavaScript
	newGame.add(this.scene, "currentBoardType", this.scene.boardType).name("Board Type");
	newGame.add(this.scene, "startGame").name("Start Game");
	this.gui.add(this.scene, "undoLastMove").name("Undo Last Move");
	this.gui.add(this.scene, "getSinkStreak").name("Get Sink Streak");
}

/**
 * Scene setter.
 * @param scene {CGFscene} Scene to set.
 */
MyInterface.prototype.setScene = function(scene) {
    this.scene = scene;
}

