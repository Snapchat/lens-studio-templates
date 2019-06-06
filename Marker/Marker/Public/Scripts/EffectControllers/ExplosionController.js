// ExplosionController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Explosion marker effects controller. 

// @input string triggerAnimation = "onMarkerFound" {"widget":"combobox", "values":[{"label":"On Marker Found", "value":"onMarkerFound"}, {"label":"On Tap", "value":"onTap"}, {"label":"Distance", "value":"distance"}]}
// @input float distanceToTriggerAnimation = 30 {"showIf":"triggerAnimation", "showIfValue":"distance"}
// @input float insideDepth = 1
// @input Asset.Material thicknessMaterial
// @ui {"widget":"separator"}
// @input bool captureTexture = false
// @ui {"widget":"separator"}
// @input bool advanced = false
// @input Component.MarkerTrackingComponent marker {"showIf": "advanced"}
// @input Component.AnimationMixer animationMixer {"showIf": "advanced"}
// @input SceneObject meshVisualParent {"showIf": "advanced"}
// @input string animationLayerName = "Layer0" {"showIf": "advanced"}
// @input SceneObject inside {"showIf": "advanced"}
// @input SceneObject occluder {"showIf": "advanced"}
// @input Component.ScriptComponent helperFunctions {"showIf": "advanced"}



var explosionAnimPlaying = false;
var surfaceMeshVisual = [];

for(var i = 0; i < script.meshVisualParent.getChildrenCount(); i++)
{
    surfaceMeshVisual[i] = script.meshVisualParent.getChild(i).getComponentByIndex("Component.MeshVisual",0);
}

function onLensTurnOn()
{
    if(script.captureTexture)
    {
        resetAnimation();
    }

    calculateMarkerSize();
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn); 


if(script.triggerAnimation == "onTap")
{
    function onTap(eventData)
    {
        if(explosionAnimPlaying == false)
        {
            playAnimation();
        }   
    }
    var tapEvent = script.createEvent("TapEvent");
    tapEvent.bind(onTap);
}

function onUpdateEvent(eventData)
{
    if(script.triggerAnimation == "distance")
    {
        var dist = script.helperFunctions.api.getDistanceFromCamera(script.marker);

        if(dist < script.distanceToTriggerAnimation && explosionAnimPlaying == false)
        {
            playAnimation();
        }
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent); 

script.api.onMarkerFound = function()
{
    if(script.triggerAnimation == "onMarkerFound")
    {
        playAnimation();
    }
}
script.api.onMarkerLost = function()
{
    resetAnimation();
}

function playAnimation()
{
    if(script.captureTexture)
    {
        getScreenCapture();
    }
    if(script.animationMixer)
    {
        script.animationMixer.start(script.animationLayerName, 0, 1);
        explosionAnimPlaying = true;
    }
    else
    {
        print("MarkerExplosionController: Please assign animation mixer component")
    }
    
    
}

function resetAnimation()
{
    script.animationMixer.start(script.animationLayerName, 0, 1);
    script.animationMixer.pause(script.animationLayerName);
    explosionAnimPlaying = false; 

    if(script.helperFunctions.api.getScreenCapture)
    {
        if(script.captureTexture)
        {
            script.helperFunctions.api.hideScreenCaptureMeshes(surfaceMeshVisual);
        }
    }
    else
    {
        print("MarkerExplosionController: Please assign helper script")
    }
    
}


function calculateMarkerSize()
{
    var explodeTransform = script.meshVisualParent.getTransform();
    var insideTransform = script.inside.getTransform();
    var occluderTransform = script.occluder.getTransform();

    var resultInsideScale = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * insideTransform.getLocalScale().x,
        insideTransform.getLocalScale().y * script.insideDepth,
        (script.marker.marker.height / 2) * insideTransform.getLocalScale().z);

    var resultOccluderTransform = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * occluderTransform.getLocalScale().x,
        occluderTransform.getLocalScale().y * script.insideDepth,
        (script.marker.marker.height / 2) * occluderTransform.getLocalScale().z);

    var resultExplodeTransform = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * explodeTransform.getLocalScale().x,
        explodeTransform.getLocalScale().y * script.insideDepth,
        (script.marker.marker.height / 2) * explodeTransform.getLocalScale().z);

    script.meshVisualParent.getTransform().setLocalPosition(vec3.zero());
    script.meshVisualParent.getTransform().setLocalScale(resultExplodeTransform);

    script.inside.getTransform().setLocalPosition(vec3.zero());
    script.inside.getTransform().setLocalScale(resultInsideScale);

    script.occluder.getTransform().setLocalPosition(vec3.zero());
    script.occluder.getTransform().setLocalScale(resultOccluderTransform);
}

function getScreenCapture()
{
    if(script.helperFunctions.api.getScreenCapture)
    {
        script.helperFunctions.api.getScreenCapture(surfaceMeshVisual);
    }
    else
    {
        print("MarkerExplosionController: Please assign helper script")
    }
}