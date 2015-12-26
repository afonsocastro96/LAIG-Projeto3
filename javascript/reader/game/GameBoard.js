function GameBoard(scene, board) {
    this.scene = scene;
    this.board = board;
    this.numRows = board.length;
    this.numCols = board[0].length;
    this.emptyTile = new EmptyTile();
}

GameBoard.prototype = Object.create(Object.prototype);
GameBoard.prototype.constructor = GameBoard;

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