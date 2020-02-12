// -----JS CODE-----
// AnimatedTextureMaterialDuplicationHelper.js
// Version: 0.0.1
// Event: Initialized
// Description: Creates a copy of animated texture material and uses one of textures from array. Array should be filled with copies of animated texture. This allows you to play animated textures with different offsets. 
//@input Asset.Texture[] textures
//@input Asset.Material material

var idx = 0;
var availableTextures;
initialize();

function initialize() {
    if (!script.material) {
        print("[AnimatedTextureMaterialDuplicationHelper], Error, Please specify material you want to duplicate ");
    }

    availableTextures = []
    if (script.textures) {
        for (var i = 0; i < script.textures.length; i++) {
            if (script.textures[i]) {
                availableTextures.push(script.textures[i]);
            }
        }
    }

    if (!script.textures || availableTextures.length == 0) {
        print("[AnimatedTextureMaterialDuplicationHelper], Error, Please specify animated texture copies");
        return false;
    }
}

script.api.get = function () {
    if (availableTextures.length > 0 && script.material) {
        return duplicateMaterial();
    }
    else {
        return null;
    }
}

function duplicateMaterial() {
    if (idx >= availableTextures.length) {
        print("[WARNING] there is not enough animated texture copies. Consider decreasing spawn count or add more animated texture copies");
    }
    idx = idx % availableTextures.length;
    var material = script.material.clone();
    material.mainPass.baseTex = availableTextures[idx];
    idx++;
    return material;
}
