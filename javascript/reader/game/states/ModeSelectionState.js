/**
 * ModeSelectionState constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the ModeSelectionState belongs.
 */
function ModeSelectionState() {
	GameState.call(this);
}

ModeSelectionState.prototype = Object.create(GameState.prototype);
ModeSelectionState.prototype.constructor = BoardSelectionState;

/**
* ModeSelectionState initializer.
*/
ModeSelectionState.prototype.init = function(gameSet) {
	var gameState = this;
	
	this.displayHUD = this.displayGameModesHUD;
	
	this.humanVsHumanButton = new Marker(gameSet.scene);
	this.humanVsHumanButton.setText("Human VS Human");
	this.humanVsHumanPick = {
		onPick : function() {
			gameState.onPickMode(gameSet, Connection.humanVsHumanMode);
		}
	};
	
	this.humanVsMachineButton = new Marker(gameSet.scene);
	this.humanVsMachineButton.setText("Human VS Machine");
	this.humanVsMachinePick = {
		onPick : function() {
			gameState.onPickMode(gameSet, Connection.humanVsMachineMode);
		}
	};
	
	this.machineVsMachineButton = new Marker(gameSet.scene);
	this.machineVsMachineButton.setText("Machine VS Machine");
	this.machineVsMachinePick = {
		onPick : function() {
			gameState.onPickMode(gameSet, Connection.machineVsMachineMode);
		}
	};
	
	this.easyDifficultyButton = new Marker(gameSet.scene);
	this.easyDifficultyButton.setText("Easy");
	this.easyDifficultyPick = {
		onPick : function() {
			gameState.onPickDifficulty(gameSet, Connection.easyDifficulty);
		}
	}
	
	this.hardDifficultyButton = new Marker(gameSet.scene);
	this.hardDifficultyButton.setText("Hard");
	this.hardDifficultyPick = {
		onPick : function() {
			gameState.onPickDifficulty(gameSet, Connection.hardDifficulty);
		}
	}
}

/**
* Display function used to render this object.
*/
ModeSelectionState.prototype.display = function(gameSet) {
	gameSet.displayStatic();
}

/**
* Displays the state's HUD.
*/
ModeSelectionState.prototype.displayGameModesHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,3,-20);
		gameSet.scene.scale(0.5, 0.5, 0.5);

		gameSet.scene.registerNextPick(this.humanVsHumanPick);
		this.humanVsHumanButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, 0, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		
		gameSet.scene.registerNextPick(this.humanVsMachinePick);
		this.humanVsMachineButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,-3,-20);
		gameSet.scene.scale(0.5, 0.5, 0.5);

		gameSet.scene.registerNextPick(this.machineVsMachinePick);
		this.machineVsMachineButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

/**
* Displays the difficulties HUD.
*/
ModeSelectionState.prototype.displayDifficultiesHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);

		gameSet.scene.registerNextPick(this.easyDifficultyPick);
		this.easyDifficultyButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,-1,-20);
		gameSet.scene.scale(0.75, 0.75, 0.75);
		
		gameSet.scene.registerNextPick(this.hardDifficultyPick);
		this.hardDifficultyButton.display();
	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

/**
* Function called when a game mode is picked.
*/
ModeSelectionState.prototype.onPickMode = function(gameSet, gameMode) {
	var gameState = this;
	
	Connection.gamemode(gameSet,
	function (gameSet, request) {
		gameState.modeSelected(gameSet, request, gameMode);
	},
	gameMode);
}

/**
* Function called when a difficulty is picked.
*/
ModeSelectionState.prototype.onPickDifficulty = function(gameSet, difficulty) {
	Connection.setDifficulty(gameSet, this.difficultySelected, difficulty);
}

/**
* Function called to change the state when a mode is selected.
*/
ModeSelectionState.prototype.modeSelected = function(gameSet, request, gameMode) {	
	if (gameMode == Connection.humanVsHumanMode) {
		gameSet.setState(new TowerSelectionState());
		return;
	}
	
	this.displayHUD = this.displayDifficultiesHUD;
}

/**
* Function called to change the state when a difficulty is selected.
*/
ModeSelectionState.prototype.difficultySelected = function(gameSet, request) {
	gameSet.setState(new TowerSelectionState());
}