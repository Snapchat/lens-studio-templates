//  UniformScale.js
//  Version: 0.0.3
//  Event: Lens Turned On
//  Description: Uniformly scales meshes to prevent odd shapes when non-uniform scale is applied to parent object

var localScaleFactor = 25;
var scale = script.getSceneObject().getTransform().getWorldScale();
var localScale = script.getSceneObject().getTransform().getLocalScale().x;
var min = Math.max(localScaleFactor * localScale, Math.min(scale.x, scale.y, scale.z));
script.getSceneObject().getTransform().setWorldScale(new vec3(min, min, min));   