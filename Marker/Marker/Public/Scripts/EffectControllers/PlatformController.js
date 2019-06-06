// PlatformController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Platform marker effects controller. 

// @input string triggerAnimation = "onMarkerFound" {"widget":"combobox", "values":[{"label":"On Marker Found", "value":"onMarkerFound"}, {"label":"On Tap", "value":"onTap"}, {"label":"Distance", "value":"distance"}]}
// @input float distanceToTriggerAnimation = 30 {"showIf":"triggerAnimation", "showIfValue":"distance"}
// @input float platformLength = 10
// @ui {"widget":"separator"}
// @input bool captureTexture = false
// @ui {"widget":"separator"}
// @input bool advanced = false
// @input Component.MarkerTrackingComponent marker {"showIf": "advanced"}
// @input Component.AnimationMixer animationMixer {"showIf": "advanced"}
// @input SceneObject cubeMeshVisualParent {"showIf": "advanced"}
// @input string animationLayerName = "Layer0" {"showIf": "advanced"}
// @input SceneObject occluder {"showIf": "advanced"}
// @input Component.ScriptComponent helperFunctions {"showIf": "advanced"}

var magicAnimPlaying = false;
var surfaceMeshVisual = [];

for(var i = 0; i < script.cubeMeshVisualParent.getChildrenCount(); i++)
{
    surfaceMeshVisual[i] = script.cubeMeshVisualParent.getChild(i).getComponentByIndex("Component.MeshVisual",1);
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
        if(magicAnimPlaying == false)
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

        if(dist < script.distanceToTriggerAnimation && magicAnimPlaying == false)
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
        magicAnimPlaying = true;
    }
    else
    {
        print("MarkerPlatformController: Please assign animation mixer component")
    }
}

function resetAnimation()
{
    script.animationMixer.start(script.animationLayerName, 0, 1);
    script.animationMixer.pause(script.animationLayerName);
    magicAnimPlaying = false; 
    
    if(script.helperFunctions.api.getScreenCapture)
    {
        if(script.captureTexture)
        {
            script.helperFunctions.api.hideScreenCaptureMeshes(surfaceMeshVisual);
        }
    }
    else
    {
        print("MarkerPlatformController: Please assign helper script")
    }
}


function calculateMarkerSize()
{
    var cubeTransform = script.cubeMeshVisualParent.getTransform();
    var occluderTransform = script.occluder.getTransform();

    var resultCubeScale = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * cubeTransform.getLocalScale().x,
        cubeTransform.getLocalScale().y * script.platformLength,
        (script.marker.marker.height / 2) * cubeTransform.getLocalScale().z);

    var resultOccluderTransform = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * occluderTransform.getLocalScale().x,
        occluderTransform.getLocalScale().y * script.platformLength,
        (script.marker.marker.height / 2) * occluderTransform.getLocalScale().z);

    script.cubeMeshVisualParent.getTransform().setLocalPosition(vec3.zero());
    script.cubeMeshVisualParent.getTransform().setLocalScale(resultCubeScale);

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
        print("MarkerPlatformController: Please assign helper script")
    }
}