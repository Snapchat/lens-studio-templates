// FullscreenTemplateState.js
// Event: Initialized
// Version: 0.01
// Description: Enables/Disables SceneObjects, plays/stops 2D sprites and audio.

// ----- Notes -----
// Scripts on `Initialized` on SceneObject has access to api: onStart, onUpdate, onEnd as state events. 

// script.api.onStart = function () 
// {
//     ... do something when state begins ...
// }

// -----------------

// @ui {"widget":"group_start", "label":"On Start"}

// @input SceneObject[] enableObjects

// @ui {"widget":"group_start", "label":"Animation Control"}
// @input Component.Image[] play2dSprites {"label": "Play Animations"}
// @input int texturePlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1}
// @input float texturePlayOffset = 0 {"label": "Play Offset", "min":0.0, "max":99999.0, "step":1}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Sound Control"}
// @input Asset.AudioTrackAsset[] playAudios {"label": "Play Sounds"}
// @input int audioPlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"On End"}
// @input SceneObject[] disableObjects

// @ui {"widget":"group_start", "label":"Animation Control"}
// @input Component.Image[] stop2dSprites {"label": "Stop Animations"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Sound Control"}
// @input Asset.AudioTrackAsset[] stopAudios {"label": "Stop Sounds"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"End Condition"}

// @input bool endOnTap = true

// @ui {"widget":"group_start", "label":"Time Control"}
// @input bool endOnTime
// @input float endTimeLength
// @ui {"widget":"group_end"}

// @ui {"widget":"group_end"}

var endCallback = [];
var scriptComponents = [];

// API

script.api.subscribeToStateEnd = function (callback)
{
    endCallback.push(callback);
}
script.api.getSceneObject = function ()
{
    return script.getSceneObject();
}
script.api.hideAttachedObjects = function ()
{
    hideAttachedObjects();
}
script.api.update = function ()
{
    onStateUpdate();
}
script.api.lateUpdate = function ()
{
    onStateLateUpdate();
}
script.api.stateStart = function ()
{
    onStateStart();
}
// EVENTS

function setupState () 
{
    if (script.endOnTap) createTouchManager();

    scriptComponents = collectComponentsFromObjects(script.enableObjects, "Component.ScriptComponent");

    script.hasInitialized = true;
}

function onStateStart ()
{
    setObjectsEnabled (script.enableObjects, true);

    // For animated texture, we want to play it instantly so we don't see last frame.
    for (var i = 0; i < script.play2dSprites.length; i++)
    {
        if (script.play2dSprites[i] 
            && script.play2dSprites[i].mainPass.baseTex
            && script.play2dSprites[i].mainPass.baseTex.control
            && script.play2dSprites[i].mainPass.baseTex.control.play)
        {
            script.play2dSprites[i].getSceneObject().enabled = true;
            script.play2dSprites[i].mainPass.baseTex.control.play(script.texturePlayCount, script.texturePlayOffset);
        }
    }

    script.stateStarted = true;
}

function onStateLateStart () 
{
    for (var i = 0; i < scriptComponents.length; i++)
    {
        if (scriptComponents[i].api && scriptComponents[i].api.onStart)
        {
            scriptComponents[i].api.onStart();
        }
    }

    for (var i = 0; i < script.playAudios.length; i++)
    {
        if (script.playAudios[i])
        {
            var audioComponent = getAudioComponentForTrack(script.playAudios[i]);
            audioComponent.play(script.audioPlayCount);      
        }
    }

    script.stateLateStarted = true;
    script.stateStartTime = getTime();
}

function onStateUpdate () 
{
    if (!script.getSceneObject().enabled || !script.stateStarted) return;

    if (!script.stateLateStarted)
    {
        onStateLateStart();
    }

    if (script.endOnTime && getTime() > script.stateStartTime + script.endTimeLength)
    {
        onStateEnd();
    }
}

function onStateLateUpdate () 
{
    if (!script.getSceneObject().enabled) return;
    
    for (var i = 0; i < scriptComponents.length; i++)
    {
        if (scriptComponents[i].api && scriptComponents[i].api.onUpdate)
        {
            scriptComponents[i].api.onUpdate();
        }
    }
    
    if (script.stateEnded)
    {
        onStateLateEnd();
    }
}

function onStateEnd () {

    for (var i = 0; i < scriptComponents.length; i++)
    {
        if (scriptComponents[i].api && scriptComponents[i].api.onEnd)
        {
            scriptComponents[i].api.onEnd();
        }
    }

    for (var i = 0; i < script.stop2dSprites.length; i++)
    {
        if (script.stop2dSprites[i] 
            && script.stop2dSprites[i].mainPass.baseTex
            && script.stop2dSprites[i].mainPass.baseTex.control
            && script.stop2dSprites[i].mainPass.baseTex.control.stop)
        {
            script.stop2dSprites[i].mainPass.baseTex.control.stop();
        }
    }

    for (var i = 0; i < script.stopAudios.length; i++)
    {
        if (script.stopAudios[i])
        {
            var audioComponent = getAudioComponentForTrack(script.stopAudios[i]);
            audioComponent.stop(false);       
        }
    }

    script.stateEnded = true;
}

function onStateLateEnd () 
{
    setObjectsEnabled (script.disableObjects, false, stopAllAudiosOnObject);

    resetVariables();

    for (var i = 0; i < endCallback.length; i++)
    {
        endCallback[i]();
    }
}

// HELPERS

function hideAttachedObjects ()
{
    setObjectsEnabled (script.enableObjects, false);

    setObjectsEnabled (script.disableObjects, false);

    resetVariables();
}

function resetVariables ()
{
    script.stateStarted = false;
    script.stateLateStarted = false;
    script.stateStartTime = Infinity;
    script.stateEnded =  false;
}

function createTouchManager () {
    var touchTapEvent = script.createEvent("TouchStartEvent");
    touchTapEvent.bind(function(eventData)
    {
        if (getTime() > script.stateStartTime)
        {
            onStateEnd();
        }

    });

    global.touchSystem.touchBlocking = true;
    global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", true);
    global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", true);
}

function collectComponentsFromObjects ( sceneObjects, componentName ) 
{
    var components = [];

    for (var i = 0; i < sceneObjects.length; i++)
    {
        var sceneObject = sceneObjects[i];

        if (sceneObject) 
        {
            for( var j = 0; j < sceneObject.getComponentCount(componentName); j++ )
            {
                var scriptComponent = sceneObject.getComponentByIndex(componentName, j);
                components.push(scriptComponent);
            }          
        }
    }

    return components;
}

function setObjectsEnabled ( sceneObjects, status, onModifyObject )
{
    for (var i = 0; i < sceneObjects.length; i++)
    {
        if ( sceneObjects[i] )
        {
            sceneObjects[i].enabled = status; 

            if (onModifyObject) onModifyObject(sceneObjects[i]);
        }
    }
}

function stopAllAudiosOnObject (sceneObject)
{
    for (var i = 0; i < sceneObject.getComponentCount("Component.AudioComponent"); i++) 
    {
        var audioComponent = sceneObject.getComponentByIndex("Component.AudioComponent", i);
        audioComponent.stop(false);
    }
}

function getAudioComponentForTrack ( audioTrackAsset )
{
    var trackName = audioTrackAsset.name;

    if (!global.fstStateAudioComponents)
    {
        global.fstStateAudioComponents = {};
    }

    if (!global.fstStateAudioComponents[trackName])
    {
        if (!global.audioHolder) {
            global.audioHolder = global.scene.createSceneObject("audioObjects");
        }

        var audioComponent = global.audioHolder.createComponent("Component.AudioComponent");
        audioComponent.audioTrack = audioTrackAsset;
        
        global.fstStateAudioComponents[trackName] = audioComponent;  
    }

    return global.fstStateAudioComponents[trackName];    
}

// INITIALIZE

if (!script.hasInitialized)
{
    setupState();
}
