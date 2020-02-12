// -----JS CODE-----
// Play2DAnimation.js
// Version: 0.0.1
// Event: Initialized
// Description:Plays animated texture when object is spawned or collides with depth.  Creates a copy of animated material, requires AnimatedTextureMaterialDuplicationHelper script if cloneMaterial is enabled 
//@input string eventType = "onSpawned" {"label" : "Event", "widget" : "combobox", "values" : [{"label" : "On Spawn", "value" : "onSpawned"}, {"label" : "On Collided", "value" : "onCollided"}]}

//@input Component.MeshVisual meshVisual
//@input bool cloneMaterial 
//@input Component.ScriptComponent materialDuplicationHelper {"showIf" : "cloneMaterial", "showIfValue" : "true"}

var initialized = checkInitialized();

function checkInitialized() {
    if (!script.meshVisual) {
        print("[Play2DAnimation], Error, Please set up mesh visual or an image");
        return false;
    }

    if (script.cloneMaterial && !script.materialDuplicationHelper) {
        print("[Play2DAnimation] Error, Please set material duplication helper script");
        script.cloneMaterial = false;
    }
    return true;
}

if (initialized) {
    if (script.cloneMaterial) {
        var mat = script.materialDuplicationHelper.api.get();
        if (mat != null) {
            script.meshVisual.mainMaterial = mat;
        }
    }

    script.api[script.eventType] = function () {
        script.meshVisual.mainMaterial.mainPass.baseTex.control.play(1, 0);
    }
}