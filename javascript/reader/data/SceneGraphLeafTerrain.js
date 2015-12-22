/**
 * SceneGraph terrain leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param textureUrl {string} Url for the terrain texture
 * @param heightmapUrl {string} Url for the terrain heightmap
 */
function SceneGraphLeafTerrain(id, textureUrl, heightmapUrl) {
    SceneGraphLeaf.call(this, id, "terrain");
    this.textureUrl = textureUrl;
    this.heightmapUrl = heightmapUrl;
}

SceneGraphLeafTerrain.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafTerrain.prototype.constructor = SceneGraphLeafTerrain;