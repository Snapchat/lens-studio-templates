// HelperFunctions.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Get screen capture and place it on the marker meshes.

// @input bool advanced = false
// @input Component.Camera camera {"showIf": "advanced"}
// @input Component.Camera captureCamera {"showIf": "advanced"}
// @input Asset.Material captureUnlitMaterial {"showIf": "advanced"}
// @input Asset.Texture captureCameraOutput {"showIf": "advanced"}
// @input Asset.Texture mainCameraOutput {"showIf": "advanced"}
// @input Asset.Material occluderMaterial {"showIf": "advanced"}

script.api.getScreenCapture = function(captureMeshes)
{
    script.captureCamera.enabled = false;
    script.captureUnlitMaterial.mainPass.baseTex = script.captureCameraOutput;
    for(var i = 0; i < captureMeshes.length; i++)
    {
        captureMeshes[i].snap(script.camera); 
        captureMeshes[i].mainMaterial = script.captureUnlitMaterial;
    }
}

script.api.hideScreenCaptureMeshes = function(captureMeshes)
{
    script.captureCamera.enabled = true;
    for( var i = 0; i < captureMeshes.length; i++)
    {
        captureMeshes[i].mainMaterial = script.occluderMaterial;
    }
}

script.api.setupLiveTexture = function(captureMeshes)
{
    for(var i = 0; i < captureMeshes.length; i++)
    {
        captureMeshes[i].mainPass.baseTex = script.mainCameraOutput;
    }
}

script.api.getLiveTexture = function(captureMeshes)
{
    for(var i = 0; i < captureMeshes.length; i++)
    {
        captureMeshes[i].snap(script.camera);
    }
}

script.api.getDistanceFromCamera = function(objectDistanceToCamera)
{ 
    if(objectDistanceToCamera && script.camera)
    {
        var pointA = objectDistanceToCamera.getTransform().getWorldPosition();
        var pointB = script.camera.getTransform().getWorldPosition();
        return pointA.distance(pointB);
    }
    else
    {
        print("HelperFunctions: Please assign camera and the Object to the script");
    }
    
}
