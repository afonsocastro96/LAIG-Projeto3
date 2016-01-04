function Theme(scene, path, id) {
	this.scene = scene;
	this.path = path;
	this.graph = new LSXSceneGraph(path, scene);
	this.primitives = [];
	this.id = id;
}

Theme.prototype = Object.create(Object.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.onGraphLoaded = function() 
{
	this.camera.near = this.graph.initials.frustum.near;
	this.camera.far = this.graph.initials.frustum.far;

    if (this.graph.initials.referenceLength > 0)
	   this.axis = new CGFaxis(this, this.graph.initials.referenceLength);
	   
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.lights = [];

    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights.push(this.graph.lights[i]);
    	this.lights[i].setVisible(false);
    	this.lightsEnabled[this.lights[i]._id] = this.lights[i].enabled;
    }

    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this, leaf.v1x, leaf.v1y, leaf.v2x, leaf.v2y);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyCylinder(this, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.slices, leaf.stacks);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this, leaf.radius, leaf.slices, leaf.stacks);
				break;
			case "plane":
				this.primitives[key] = new MyPlane(this, leaf.parts);
				break;
			case "patch":
				this.primitives[key] = new MyPatch(this, leaf.order, leaf.partsU, leaf.partsV, leaf.controlPoints);
				break;
			case "vehicle":
				this.primitives[key] = new MyVehicle(this);
				break;
			case "terrain":
				this.primitives[key] = new MyTerrain(this, leaf.textureUrl, leaf.heightmapUrl);
				break;
			default:
				console.warn("Unknown primitive: " + leaf.type);
				break;
    	}
    }

    this.timer = 0;
    this.setUpdatePeriod(100/6);

	if (this.myinterface != null && !this.myinterface.interfaceLoaded){
	    this.myinterface.onGraphLoaded();
	}
};