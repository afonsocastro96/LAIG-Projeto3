function GameBoard(scene) {
    this.scene = scene;
    this.emptyTile = new EmptyTile();
}

GameBoard.prototype = Object.create(Object.prototype);
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.init = function(boardSchema) {
	this.board = [];
	for(var row = 0; row < boardSchema.length; ++row){
		var currentRow = [];
		for(var col = 0; col < boardSchema[row].length; ++col){
			switch(boardSchema[row][col][0]){
				case 0:
					currentRow.push(new EmptyTile());
					break;
				case 1:
					if(boardSchema[row][col][1] == 3)
						currentRow.push(new WhiteCircleTile(this.scene));
					else
						currentRow.push(new WhiteSquareTile(this.scene));
					break;
				case 2:
					if(boardSchema[row][col][1] == 3)
						currentRow.push(new BlackCircleTile(this.scene));
					else
						currentRow.push(new BlackSquareTile(this.scene));
					break;
				default:
					break;
			}
		}
		this.board.push(currentRow);
	}
	
    this.numRows = this.board.length;
    this.numCols = this.board[0].length;
}

GameBoard.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(-this.numCols/2 + 0.5, 0.1, -this.numRows/2 + 0.5);

    for (var row = 0; row < this.numRows; ++row) {
        for (var col = 0; col < this.numCols; ++col) {
            this.board[row][col].display();
            this.scene.translate(1,0,0);
        }
        this.scene.translate(-this.numCols, 0, 1);
    }

    this.scene.popMatrix();
}

GameBoard.prototype.moveTile = function(startRow, startCol, endRow, endCol) {
    this.board[endRow][endCol] = this.board[startRow][startCol];
    this.board[startRow][startCol] = this.emptyTile;
}

GameBoard.prototype.removeTile = function(row, col) {
	this.board[row][col] = this.emptyTile;
}

GameBoard.prototype.getTile = function(row, col) {
	return this.board[row][col];
}

GameBoard.prototype.addTile = function(row, col, tile) {
    this.board[row][col] = tile;
}

GameBoard.prototype.placeObject = function(object, row, col) {
	this.scene.pushMatrix();
    this.scene.translate(-this.numCols/2 + 0.5, 0.1, -this.numRows/2 + 0.5);
	this.scene.translate(col, 0, row);
	this.object.display();
	this.scene.popMatrix();
}