/**
 * Theme constructor.
 * @constructor
 * @param scene {CGFScene} The scene to which the Theme belongs.
 * @param path {string} The path to the LSX file from this theme.
 * @param id {string} Identification of the theme
 */
function Theme(scene, path, id) {
	this.scene = scene;
	this.path = path;
	this.loaded = false;
	var theme = this;
	this.graph = new LSXSceneGraph(path, scene, function() {theme.onGraphLoaded();});
	this.primitives = [];
	this.id = id;
}

Theme.prototype = Object.create(Object.prototype);
Theme.prototype.constructor = Theme;

/**
 * Function to be called when the theme's SceneGraph is done loading
 */
Theme.prototype.onGraphLoaded = function() 
{
    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this.scene, leaf.v1x, leaf.v1y, leaf.v2x, leaf.v2y);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this.scene, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyCylinder(this.scene, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.slices, leaf.stacks);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this.scene, leaf.radius, leaf.slices, leaf.stacks);
				break;
			case "plane":
				this.primitives[key] = new MyPlane(this.scene, leaf.parts);
				break;
			case "patch":
				this.primitives[key] = new MyPatch(this.scene, leaf.order, leaf.partsU, leaf.partsV, leaf.controlPoints);
				break;
			case "vehicle":
				this.primitives[key] = new MyVehicle(this.scene);
				break;
			case "terrain":
				this.primitives[key] = new MyTerrain(this.scene, leaf.textureUrl, leaf.heightmapUrl);
				break;
			case "gameset":
				this.primitives[key] = this.scene.gameSet;
				break;
			default:
				console.warn("Unknown primitive: " + leaf.type);
				break;
    	}
    }

	this.loaded = true;
};