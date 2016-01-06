/**
 * BoardSelectionState constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the BoardSelectionState belongs.
 */
function BoardSelectionState(scene) {
	GameState.call(this);
}

BoardSelectionState.prototype = Object.create(GameState.prototype);
BoardSelectionState.prototype.constructor = BoardSelectionState;

/**
* BoardSelectionState initializer.
*/
BoardSelectionState.prototype.init = function(gameSet) {
	GameState.prototype.init.call(this, gameSet);
	gameSet.setTowers([]);
	
	this.minorButton = new Marker(gameSet.scene);
	this.minorButton.setText("Syrtis Minor");
	this.majorButton = new Marker(gameSet.scene);
	this.majorButton.setText("Syrtis Major");
	
	var gameState = this;
	
	this.minorPick = {
		onPick: function() {
			gameState.onPick(gameSet,Connection.minorBoard);
		}
	}
	
	this.majorPick = {
		onPick: function() {
			gameState.onPick(gameSet, Connection.majorBoard);
		}
	}
}

/**
* Displays the state's HUD.
*/
BoardSelectionState.prototype.displayHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);

		gameSet.scene.registerNextPick(this.minorPick);
		this.minorButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,-1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		
		gameSet.scene.registerNextPick(this.majorPick);
		this.majorButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

/**
* Function called when a board is picked.
*/
BoardSelectionState.prototype.onPick = function(gameSet, boardType) {
	Connection.startgame(gameSet, this.gameStarted, boardType);
}

/**
* Starts the mode selection state when the board is selected.
*/
BoardSelectionState.prototype.gameStarted = function(gameSet, requestData) {
	var boardSchema = JSON.parse(requestData);
	var board = new GameBoard(gameSet.scene);
	board.init(boardSchema);
	
	gameSet.setBoard(board);
	gameSet.setState(new ModeSelectionState());
}