function ModeSelectionState() {
	GameState.call(this);
}

ModeSelectionState.prototype = Object.create(GameState.prototype);
ModeSelectionState.prototype.constructor = BoardSelectionState;

ModeSelectionState.prototype.init = function(gameSet) {
	var gameState = this;
	
	this.humanVsHumanButton = new Marker(gameSet.scene);
	this.humanVsHumanButton.setText("Human VS Human");
	this.humanVsHumanPick = {
		onPick : function() {
			gameState.onPick(gameSet, Connection.humanVsHumanMode);
		}
	};
	
	this.humanVsMachineButton = new Marker(gameSet.scene);
	this.humanVsMachineButton.setText("Human VS Machine");
	this.humanVsMachinePick = {
		onPick : function() {
			gameState.onPick(gameSet, Connection.humanVsMachineMode);
		}
	};
	
	this.machineVsMachineButton = new Marker(gameSet.scene);
	this.machineVsMachineButton.setText("Machine VS Machine");
	this.machineVsMachinePick = {
		onPick : function() {
			gameState.onPick(gameSet, Connection.machineVsMachineMode);
		}
	};
}

ModeSelectionState.prototype.display = function(gameSet) {
	gameSet.board.display();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,0,-5);
		gameSet.stack.display();
	gameSet.scene.popMatrix();
}

ModeSelectionState.prototype.displayHUD = function(gameSet) {
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

ModeSelectionState.prototype.onPick = function(gameset, gameMode) {
	Connection.gamemode(gameset, this.modeSelected, gameMode);
}

ModeSelectionState.prototype.modeSelected = function(gameSet, target, request) {
	gameSet.setState(new DifficultySelectionState());
}