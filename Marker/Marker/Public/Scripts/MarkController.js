// MarkController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Play an animation when marker found and make sure the sound is sync through the animation, also grab the live video feed from camera and apply that as a texture to meshes

// @input Component.AnimationMixer animMixer
// @input string animLayerName = "Layer0"
// @input bool playInfinitely = true
// @input int loopsNumber {"showIf":"playInfinitely", "showIfValue":false,"label":"loopsNumber", "min":1}
// @input Asset.AudioTrackAsset audio
// @input bool captureLiveTexture = false
// @input Component.MeshVisual[] meshVisuals
// @input bool advanced = false 
// @input Component.ScriptComponent helperFunctions {"showIf": "advanced"}


var audioComponentMark;
var loopCounter = 0;

function onLensTurnOn()
{
    audioSetup();
    setupNumberOfLoops();
    setupLiveCapture();
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn); 


function onUpdateEvent(eventData)
{
    getLiveCapture();
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent); 

function audioSetup()
{
    if(script.audio && !audioComponentMark)
    {       
        audioComponentMark = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentMark.audioTrack = script.audio;        
    }
}

function setupNumberOfLoops()
{
    if(script.playInfinitely == true)
    {
        script.loopsNumber = -1;
    }
}

script.api.onMarkerFound = function()
{
    if(script.animMixer)
    {
        script.animMixer.startWithCallback(script.animLayerName,0, 1,animEndCallback);
    }
    playAudio(audioComponentMark, 1);
    
}

script.api.onMarkerLost = function()
{
    if(script.animMixer)
    {
        script.animMixer.start(script.animLayerName,0,-1);
        script.animMixer.pause(script.animLayerName);
    }
    stopAudio(audioComponentMark);
}

function animEndCallback() 
{
    loopCounter++;
    if(loopCounter < script.loopsNumber || script.playInfinitely == true)
    {
        playAudio(audioComponentMark, 1);

        if(script.animMixer)
        {
            script.animMixer.startWithCallback(script.animLayerName,0, 1,animEndCallback);
        }  
    }
}

function playAudio(audioComponent, loops)
{
    if (audioComponent)
    {
        if(audioComponent.isPlaying())
        {
            audioComponent.stop(false);
        }
        audioComponent.play( loops );
    }    
}

function stopAudio(audioComponent)
{
    if (audioComponent)
    {
        if(audioComponent.isPlaying())
        {
            audioComponent.stop(false);
        }
    }  
}

function setupLiveCapture()
{
    if(script.helperFunctions && script.helperFunctions.api.setupLiveTexture)
    {
        if(script.captureLiveTexture)
        {
            script.helperFunctions.api.setupLiveTexture(script.meshVisuals);
        }
    }
    else
    {
        print("MarkController: Please assign helper script")
    }
}

function getLiveCapture()
{
    if(script.helperFunctions && script.helperFunctions.api.getLiveTexture)
    {
        if(script.captureLiveTexture)
        {
            script.helperFunctions.api.getLiveTexture(script.meshVisuals);
        }
    }
    else
    {
        print("MarkController: Please assign helper script")
    }
}



