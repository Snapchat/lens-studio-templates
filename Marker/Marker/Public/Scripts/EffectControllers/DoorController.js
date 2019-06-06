// DoorController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Opening doors marker effects controller. 

// @input string triggerAnimation = "onMarkerFound" {"widget":"combobox", "values":[{"label":"On Marker Found", "value":"onMarkerFound"}, {"label":"On Tap", "value":"onTap"}, {"label":"Distance", "value":"distance"}]}
// @input float distanceToTriggerAnimation = 30 {"showIf":"triggerAnimation", "showIfValue":"distance"}
// @input float insideDepth = 1
// @input float doorsOpenSpeed = 1 {"widget":"slider", "min":0.1, "max":4.0, "step":0.01}
// @ui {"widget":"separator"}
// @input bool captureTexture = false
// @ui {"widget":"separator"}
// @input bool advanced = false
// @input Component.MarkerTrackingComponent marker {"showIf": "advanced"}
// @input Component.AnimationMixer animationMixer {"showIf": "advanced"}
// @input string animationLayerName = "Layer0" {"showIf": "advanced"}
// @input SceneObject doorLeft {"showIf": "advanced"}
// @input SceneObject doorRight {"showIf": "advanced"}
// @input SceneObject inside {"showIf": "advanced"}
// @input SceneObject occluder {"showIf": "advanced"}
// @input Component.ScriptComponent helperFunctions {"showIf": "advanced"}

var doorOpenAnimPlaying = false;
var doorMeshes = [];

function onLensTurnOn()
{
    script.animationMixer.speedRatio = script.doorsOpenSpeed;

    doorMeshes[0] = script.doorLeft.getFirstComponent("Component.MeshVisual");
    doorMeshes[1] = script.doorRight.getFirstComponent("Component.MeshVisual");

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
        if(doorOpenAnimPlaying == false)
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

        if(dist < script.distanceToTriggerAnimation && doorOpenAnimPlaying == false)
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
        doorOpenAnimPlaying = true;
    }
    else
    {
        print("MarkerDoorController: Please assign animation mixer component")
    } 
}

function resetAnimation()
{
    script.animationMixer.start(script.animationLayerName, 0, 1);
    script.animationMixer.pause(script.animationLayerName);
    doorOpenAnimPlaying = false;
    
    if(script.helperFunctions.api.getScreenCapture)
    {
        if(script.captureTexture)
        {
            script.helperFunctions.api.hideScreenCaptureMeshes(doorMeshes);
        }
    }
    else
    {
        print("MarkerDoorController: Please assign helper script")
    }
    
}


function calculateMarkerSize()
{
    var doorTransform = script.doorLeft.getTransform();
    var insideTransform = script.inside.getTransform();
    var occluderTransform = script.occluder.getTransform();

    var resultDoorScale = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 4 )  * doorTransform.getLocalScale().x,
        doorTransform.getLocalScale().y,
        (script.marker.marker.height / 2) * doorTransform.getLocalScale().z);

    var resultInsideScale = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * insideTransform.getLocalScale().x,
        insideTransform.getLocalScale().y * script.insideDepth,
        (script.marker.marker.height / 2) * insideTransform.getLocalScale().z);

    var resultOccluderTransform = new vec3(
        ((script.marker.marker.height * script.marker.marker.getAspectRatio()) / 2 )  * occluderTransform.getLocalScale().x,
        occluderTransform.getLocalScale().y * (script.insideDepth * 2),
        (script.marker.marker.height / 2) * occluderTransform.getLocalScale().z);

    script.doorLeft.getTransform().setLocalPosition(new vec3(
        (-script.marker.marker.height * script.marker.marker.getAspectRatio() / 2),
        doorTransform.getLocalPosition().y,
        doorTransform.getLocalPosition().z));

    script.doorLeft.getTransform().setLocalScale(resultDoorScale);

    script.doorRight.getTransform().setLocalPosition(new vec3(
        (script.marker.marker.height * script.marker.marker.getAspectRatio() / 2),
        doorTransform.getLocalPosition().y,
        doorTransform.getLocalPosition().z));

    script.doorRight.getTransform().setLocalScale(resultDoorScale);

    script.inside.getTransform().setLocalPosition(vec3.zero());
    script.inside.getTransform().setLocalScale(resultInsideScale);

    script.occluder.getTransform().setLocalPosition(vec3.zero());
    script.occluder.getTransform().setLocalScale(resultOccluderTransform);
}

function getScreenCapture()
{
    if(script.helperFunctions.api.getScreenCapture)
    {
        script.helperFunctions.api.getScreenCapture(doorMeshes);
    }
    else
    {
        print("MarkerDoorController: Please assign helper script")
    }
}