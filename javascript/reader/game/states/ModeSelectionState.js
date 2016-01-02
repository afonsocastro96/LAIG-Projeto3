function ModeSelectionState() {
	GameState.call(this);
}

ModeSelectionState.prototype = Object.create(GameState.prototype);
ModeSelectionState.prototype.constructor = BoardSelectionState;

ModeSelectionState.prototype.init = function(gameSet) {
	
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
	gameSet.scene.translate(0,1,-20);
	gameSet.scene.scale(0.75, 0.75, 0.75);
	gameSet.scene.popMatrix();
	gameSet.scene.pushMatrix();
	gameSet.scene.translate(0,-1,-20);
	gameSet.scene.scale(0.75, 0.75, 0.75);

	gameSet.scene.popMatrix();
	
	gameSet.scene.clearPickRegistration();
}

ModeSelectionState.prototype.update = function(gameSet, currentTime) {
	// nothing to update
}

ModeSelectionState.prototype.onPick = function(gameset, boardType) {
	
}

ModeSelectionState.prototype.modeSelected = function(gameset, target, request) {
	
}