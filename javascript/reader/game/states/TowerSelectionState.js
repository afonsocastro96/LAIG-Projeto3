function TowerSelectionState() {
	GameState.call(this);
}

TowerSelectionState.prototype = Object.create(GameState.prototype);
TowerSelectionState.prototype.constructor = BoardSelectionState;

TowerSelectionState.prototype.init = function(gameSet) {
	gameSet.towers = [];
	var gameState = this;
	Connection.setupTowers(gameSet, function (target, request) { gameState.towerSet(target, request); });
	
	this.selectionPanel = new MyPlane(gameSet.scene, 100);
	this.selectionPanelAppearance = new CGFappearance(gameSet.scene);
	this.selectionPanelAppearance.setAmbient(0.0, 0.0, 0.3, 0.1);
	this.selectionPanelAppearance.setDiffuse(0.0, 0.0, 0.8, 0.1);
	this.selectionPanelAppearance.setSpecular(0.0, 0.0, 0.8, 0.1);
	
	this.marker = new Marker(gameSet.scene);
	this.positions = [];
}

TowerSelectionState.prototype.displayHUD = function(gameSet) {
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0, -3.5, -20);
		gameSet.scene.scale(0.5, 0.5, 0.5);
		
		this.marker.display();
	gameSet.scene.popMatrix();
}

TowerSelectionState.prototype.display = function(gameSet) {
	gameSet.board.display();
	
	gameSet.scene.pushMatrix();
		gameSet.scene.translate(0,0,-5);
		gameSet.stack.display();
	gameSet.scene.popMatrix();
	
	for (var i = 0; i < gameSet.towers.length; ++i) {
		var tower = gameSet.towers[i];
		var boardPosition = gameSet.board.getBoardCoordinates(tower.row, tower.col);
		
		gameSet.scene.pushMatrix();
			gameSet.scene.translate(boardPosition[0],boardPosition[1],boardPosition[2]);
			tower.display();
		gameSet.scene.popMatrix();
	}
	
	
	var prevValue;
	if (!gameSet.scene.pickMode) {
		prevValue = gameSet.scene.activeShader.getUniformValue("uAlphaScaling");
		gameSet.scene.activeShader.setUniformsValues({uAlphaScaling: 0.5});
		this.selectionPanelAppearance.apply();
	}
	var gameState = this;
	for (var i = 0; i < this.positions.length; ++i) {
		var position = this.positions[i];
		var boardPosition = gameSet.board.getBoardCoordinates(position[0], position[1]);
		
		gameSet.scene.pushMatrix();
			gameSet.scene.translate(boardPosition[0], boardPosition[1] + 0.01, boardPosition[2]);
			gameSet.scene.registerNextPick({
				row: position[0],
				col: position[1],
				onPick: function() {
					gameState.onPickTower(gameSet, this.row, this.col);
				}
			});
			this.selectionPanel.display();
		gameSet.scene.popMatrix();
	}
	
	if (!gameSet.scene.pickMode) {
		gameSet.scene.activeShader.setUniformsValues({uAlphaScaling: prevValue});
	}
	gameSet.scene.clearPickRegistration();
}

TowerSelectionState.prototype.towerSet = function(gameSet, request) {
	Connection.getTowers(gameSet, TowerSelectionState.prototype.updateTowers);
	if (request == "Towers ready") {
		gameSet.setState(new PlayGameState());
		return;
	}
	
	var requestData = JSON.parse(request);
	var tower = requestData[0];
	
	switch(tower) {
		case Connection.lightTower:
			this.marker.setText("Select Light Tower");
			this.pickingTower = Connection.light;
			break;
		case Connection.darkTower:
			this.marker.setText("Select Dark Tower");
			this.pickingTower = Connection.dark;
			break;
	}
	
	this.positions = requestData[1];
}

TowerSelectionState.prototype.updateTowers = function(gameSet, request) {
	var towerSchema = JSON.parse(request);
	var towers = [];
	for (var i = 0; i < towerSchema.length; ++i) {
		switch (towerSchema[i][0]) {
			case Connection.lightTower:
				towers.push(new LightTower(gameSet.scene));
				towers[towers.length - 1].setPosition(towerSchema[i][1], towerSchema[i][2]);
				break;
			case Connection.darkTower:
				towers.push(new DarkTower(gameSet.scene));
				towers[towers.length - 1].setPosition(towerSchema[i][1], towerSchema[i][2]);
				break;
		}
	}
	
	gameSet.setTowers(towers);
}

TowerSelectionState.prototype.onPickTower = function(gameSet, row, col) {
	var gameState = this;
	Connection.addTower(this.pickingTower, row, col, gameSet, function(gameSet, request) { gameState.towerAdded(gameSet, request);});
}

TowerSelectionState.prototype.towerAdded = function(gameSet, request) {
	var gameState = this;
	Connection.setupTowers(gameSet, function (target, request) { gameState.towerSet(target, request); });
}