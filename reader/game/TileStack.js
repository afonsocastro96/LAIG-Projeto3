function TileStack(scene) {
    this.scene = scene;

    this.blackCircles = 0;
    this.blackSquares = 0;
    this.whiteCircles = 0;
    this.whiteSquares = 0;

    this.blackCircle = new BlackCircleTile(scene);
    this.blackSquare = new BlackSquareTile(scene);
    this.whiteCircle = new WhiteCircleTile(scene);
    this.whiteSquare = new WhiteSquareTile(scene);
}

TileStack.prototype = Object.create(Object.prototype);
TileStack.prototype.constructor = TileStack;

TileStack.prototype.incBlackCircles = function() {
    ++this.blackCircles;
}
TileStack.prototype.decBlackCircles = function() {
    --this.blackCircles;
}

TileStack.prototype.incBlackSquares = function() {
    ++this.blackSquares;
}
TileStack.prototype.decBlackSquares = function() {
    --this.blackSquares;
}

TileStack.prototype.incWhiteCircles = function() {
    ++this.whiteCircles;
}
TileStack.prototype.decWhiteCircles = function() {
    --this.whiteCircles;
}

TileStack.prototype.incWhiteSquares = function() {
    ++this.whiteSquares;
}
TileStack.prototype.decWhiteSquares = function() {
    --this.whiteSquares;
}

TileStack.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(-1.5,0.1,0);
    this.scene.pushMatrix();

    for (var tile = 0; tile < this.blackCircles; ++tile) {
        this.blackCircle.display();
        this.scene.translate(0,0.2,0);
    }

    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(1,0,0);
    for (var tile = 0; tile < this.blackSquares; ++tile) {
        this.blackSquare.display();
        this.scene.translate(0,0.2,0);
    }

    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(2,0,0);
    for (var tile = 0; tile < this.whiteCircles; ++tile) {
        this.whiteCircle.display();
        this.scene.translate(0,0.2,0);
    }

    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(3,0,0);
    for (var tile = 0; tile < this.whiteSquares; ++tile) {
        this.whiteSquare.display();
        this.scene.translate(0,0.2,0);
    }

    this.scene.popMatrix();
    this.scene.popMatrix();
}