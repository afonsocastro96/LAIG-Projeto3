/**
 * EmptyTile constructor. This class follows the Null Object Design Pattern
 * @constructor
 */
function EmptyTile() {
}

EmptyTile.prototype = Object.create(Object.prototype);
EmptyTile.prototype.constructor = EmptyTile;

/**
* No reason to display an empty tile.
*/
EmptyTile.prototype.display = function() {
    // do nothing
}