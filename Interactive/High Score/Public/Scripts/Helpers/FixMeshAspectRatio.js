//@input Component.MeshVisual meshVisual

var texture = script.meshVisual.mainPass.baseTex;

if (!global.isNull(texture)) {
    var aspectRatio = texture.control.getAspect();
    var meshScale = script.meshVisual.getTransform().getLocalScale();
    meshScale.x = (meshScale.x < 0 ? -1 : 1) * meshScale.y * aspectRatio;
    script.meshVisual.getTransform().setLocalScale(meshScale);
}
