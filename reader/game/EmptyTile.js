function EmptyTile() {
}

EmptyTile.prototype = Object.create(Object.prototype);
EmptyTile.prototype.constructor = EmptyTile;

EmptyTile.prototype.display = function() {
    // do nothing
}