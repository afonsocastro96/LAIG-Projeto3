/**
 * SceneGraph cylinder leaf constructor
 * @constructor
 * @param id {string} Node identification
 * @param height {number} Cylinder height
 * @param bottomRadius {number} Cylinder bottom radius
 * @param topRadius {number} Cylinder top radius
 * @param slices {number} Number of divisions of each circle
 * @param stacks {number} Number of divisions of the cylinder
 */

function SceneGraphLeafCylinder(id, height, bottomRadius, topRadius, slices, stacks) {
    SceneGraphLeaf.call(this, id, "cylinder");
    this.height = height;
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.slices = slices;
    this.stacks = stacks;
}

SceneGraphLeafCylinder.prototype = Object.create(SceneGraphLeaf.prototype);
SceneGraphLeafCylinder.prototype.constructor = SceneGraphLeafCylinder;