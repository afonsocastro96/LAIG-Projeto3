/**
 * MyVehicle constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which this sphere belongs.
 */
function MyVehicle(scene){
    CGFobject.call(this,scene);

    this.frontBody = new MyPatch(this.scene, 2, 20, 20, [[0,3,0,1],[0,3,0,1],[0,3,0,1],
                                                         [-0.5,2,0,1],[0,2,1,1],[0.5,2,0,1],
                                                         [-0.5,0,0,1],[0,0,1,1],[0.5,0,0,1]]);
                                                        
    this.backBody = new MyPatch(this.scene, 2, 20, 20, [[-0.5,0,0,1],[0,0,-1,1],[0.5,0,0,1],
                                                        [-0.5,2,0,1],[0,2,-1,1],[0.5,2,0,1],
                                                        [0,3,0,1],[0,3,0,1],[0,3,0,1]]);

    this.frontLeg = new MyPatch(this.scene, 2, 20, 20, [[0.5,0,0,1],[0.5,1,0,1],[0,1,0,1],
                                                        [0.75,0,0.5,1],[0.75,1.5,0.5,1],[0,1.5,0.5,1],
                                                        [1,0,0,1],[1,2,0,1],[0,2,0,1]]);

    this.backLeg = new MyPatch(this.scene, 2, 20, 20, [[1,0,0,1],[1,2,0,1],[0,2,0,1],
                                                       [0.75,0,-0.5,1],[0.75,1.5,-0.5,1],[0,1.5,-0.5,1],
                                                       [0.5,0,0,1],[0.5,1,0,1],[0,1,0,1]]);
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

/** 
 * Display function of the scene to render this object.
 */
MyVehicle.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(2,2.5,2);
    this.scene.translate(0,0.5,0);
    this.frontBody.display();
    this.backBody.display();
    this.scene.popMatrix();
    
    for (var i = 0; i < 4; ++i) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2 * i, 0,1,0);
        this.scene.translate(0.5,0,0);
        this.frontLeg.display();
        this.backLeg.display();    
        this.scene.popMatrix();
    }
}

/**
 * texCoords scaling (no effect).
 */
MyVehicle.prototype.scaleTexCoords = function() {}