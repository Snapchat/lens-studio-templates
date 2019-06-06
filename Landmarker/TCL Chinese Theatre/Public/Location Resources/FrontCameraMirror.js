// FrontCameraMirror.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Mirrors objects it is attached to in the X axis when camera is changed between front and rear facing 

function flip() {
    var skipFlip = !script.doneFirstFlip && global.scene.getCameraType() == "back";
    script.doneFirstFlip = true;
    if (skipFlip) {
        return;
    }
    
    var sceneObject = script.getSceneObject();
    var transform = sceneObject.getTransform();
    var scale = transform.getLocalScale();
    scale.x = -scale.x;
    transform.setLocalScale(scale);
    var visitedMaterials = [];
    flipMaterials(sceneObject, visitedMaterials);
}

function containsMaterial(materials, material) {
    for (var i=0; i<materials.length; i++) {
        if (materials[i].isSame(material)) {
            return true;
        }
    }
    return false;
}

// This script negates the X scale on front camera. 
// A consequence of negative scale is that geometry is turned inside out.
// A single-sided material (default) will disappear when turned inside out.
// To counter this, the script will also swap the Cull Mode (e.g. Front to Back)
// of any Material in its hierarchy. 
function flipMaterials(sceneObject, visitedMaterials) {
    var components= sceneObject.getAllComponents();
    for (var i=0; i<components.length; i++) {
        if (components[i].getMaterialsCount !== undefined) {
            var materialCount = components[i].getMaterialsCount();
            for (var j=0; j<materialCount; j++) {
                var material = components[i].getMaterial(j);
                if (containsMaterial(visitedMaterials, material)) {
                    continue;
                }
                var passCount = material.getPassCount();
                for (var k=0; k<passCount; k++) {
                    var pass = material.getPass(k);
                    if (pass.twoSided) {
                        continue;
                    }
                    if (pass.cullMode == CullMode.Front) {
                        pass.cullMode = CullMode.Back;
                    } else if (pass.cullMode == CullMode.Back) {
                        pass.cullMode = CullMode.Front;
                    }
                }
                visitedMaterials.push(material);
            }
        }
    }

    var childrenCount = sceneObject.getChildrenCount();
    for (var i=0; i<childrenCount; i++) {
        flipMaterials(sceneObject.getChild(i), visitedMaterials);
    }
}

var cameraFrontEvent = script.createEvent("CameraFrontEvent");
cameraFrontEvent.bind(flip);

var cameraBackEvent = script.createEvent("CameraBackEvent");
cameraBackEvent.bind(flip);