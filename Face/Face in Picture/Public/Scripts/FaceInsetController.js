// FaceInsetController.js
// Version: 0.0.2
// Event: Lens Initialized
// Description: Handles which face the supplied face insets are set to. Also adjusts the face inset positions based on the billboard and device resolutions

// @input Component.FaceInsetVisual[] faceInsets
// @input int face {"widget":"combobox", "values":[{"label":"First Face", "value":0}, {"label":"Second Face", "value":1}]}
// @input bool fallbackToFirst {"showIf":"face", "showIfValue":1}

// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"Fill Settings"}
// @input Component.Image billboard
// @input Asset.Texture defaultCamTex {}
// @ui {"widget":"group_end"}

// Initialize face insets
for( var i = 0; i < script.faceInsets.length; i++ )
{
    if (!script.faceInsets[i]) return;

    script.faceInsets[i].faceIndex = script.face;

    if( script.fallbackToFirst )
    {
        script.faceInsets[i].faceIndex = 0;
    }

    // If your background uses fill mode
    // we need to recalculate the sprite's position
    // to account for how the image is displayed
    // because it changes based on the screen ratio.
    if (script.billboard.stretchMode == StretchMode.Fill) {
        var t = script.faceInsets[i].getSceneObject().getTransform();

        var newPos = getFillScaledVec3(t.getLocalPosition());
        t.setLocalPosition(newPos);

        var newScale = getFillScaledVec3(t.getLocalScale());
        t.setLocalScale(newScale);
    }
}     

// Set index when the face is found
function faceFound(eventData)
{
    for( var i = 0; i < script.faceInsets.length; i++ )
    {
        if (!script.faceInsets[i]) return;
        
        script.faceInsets[i].faceIndex = script.face;
    }      
}
var faceFoundEvent = script.createEvent("FaceFoundEvent");
faceFoundEvent.faceIndex = script.face;
faceFoundEvent.bind(faceFound);

// If fallback is enabled, fallback to the first face
function faceLost(eventData)
{
    if( script.fallbackToFirst )
    {
        for( var i = 0; i < script.faceInsets.length; i++ )
        {
            if (!script.faceInsets[i]) return;

            script.faceInsets[i].faceIndex = 0;
        }    
    }          
}
var faceLostEvent = script.createEvent("FaceLostEvent");
faceLostEvent.faceIndex = script.face;
faceLostEvent.bind(faceLost);

function getFillScaledVec3 (originalVec3) {

    if (!script.defaultCamTex) {
        print("[FaceInsetController] Please set Default Cam Tex to Default Camera Texture. \
Skipping getFillModePosition().");
        return originalVec3;
    }

    if (!script.billboard) {
        print("[FaceInsetController] Please set Billboard to your scene's Billboard. \
Skipping getFillModePosition().");
        return originalVec3;
    }

    var billboardTexture = script.billboard.mainMaterial.mainPass.baseTex;
    var imageRatioX = billboardTexture.getWidth();
    var imageRatioY = billboardTexture.getHeight();
    var imageRatio = imageRatioX / imageRatioY;

    var screenRatioX = script.defaultCamTex.getWidth();
    var screenRatioY = script.defaultCamTex.getHeight();
    var screenRatio = screenRatioX / screenRatioY;

    // By default position of sprite aligns
    // with the defaultRatio
    var finalVec3 = originalVec3;
    var multiplier = 1;

    if (screenRatio > imageRatio) {
        multiplier = screenRatio / imageRatio 
    } 

    finalVec3 = new vec3(
        originalVec3.x * multiplier, 
        originalVec3.y * multiplier, 
        originalVec3.z
    );

    return finalVec3;
}
