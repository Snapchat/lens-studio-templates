// FaceTriggerAnim.js
// Version: 0.0.2
// Event: Lens Initialized
// Description: Plays an animation layer, sound, sprite, on trigger

// @input string AnimationTrigger = MouthOpenedEvent { "widget": "combobox", "values": [ { "label": "Brows Lowered", "value": "BrowsLoweredEvent" }, { "label": "Brows Raised", "value": "BrowsRaisedEvent" }, { "label": "Brows Returned To Normal", "value": "BrowsReturnedToNormalEvent" }, { "label": "Face Found", "value": "FaceFoundEvent" }, { "label": "Face Lost", "value": "FaceLostEvent" }, { "label": "Kiss Finished", "value": "KissFinishedEvent" }, { "label": "Kiss Started", "value": "KissStartedEvent" }, { "label": "Mouth Closed", "value": "MouthClosedEvent" }, { "label": "Mouth Opened", "value": "MouthOpenedEvent" }, { "label": "Smile Finished", "value": "SmileFinishedEvent" }, { "label": "Smile Started", "value": "SmileStartedEvent" }, { "label": "Touch Start", "value": "TouchStartEvent" }, { "label": "Touch End", "value": "TouchEndEvent" }, { "label": "Tap", "value": "TapEvent" } ] }
// @input int faceIndex = 0

// @ui {"widget":"separator"}

//  @ui {"widget": "group_start", "label": "3D Anim Control"}
//  @input Component.AnimationMixer AnimationMixer
//  @input string LayerName
//  @input int animationPlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1} // How many times to play the animation, -1 for infinite
//  @ui {"widget": "group_end"}

// @ui {"widget":"group_start", "label":"2D Anim Control"}
// @input Component.Image[] play2dSprites {"label": "Play Animations"}
// @input int texturePlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1}
// @input float texturePlayOffset = 0 {"label": "Play Offset", "min":0.0, "max":99999.0, "step":1}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Sound Control"}
// @input Asset.AudioTrackAsset[] playAudios {"label": "Play Sounds"}
// @input int audioPlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

//  @input float TriggerDisableTime = 0

var triggerStartTime = getTime() - script.TriggerDisableTime;

// What happens when event is triggered
function onTriggered()
{
    print("FaceTriggerAnim: " + script.AnimationTrigger + " triggered");

    // Called when animation ends
    function animationCallback()
    {
        script.AnimationMixer.setWeight(script.LayerName, 0.0);
    }

    // Play animation layer with sound (if available)
    if (script.AnimationMixer && script.LayerName) 
    {
        script.AnimationMixer.startWithCallback(script.LayerName, 0.0, script.animationPlayCount, animationCallback);
        script.AnimationMixer.setWeight(script.LayerName, 1.0);            
    }

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

    for (var i = 0; i < script.playAudios.length; i++)
    {
        if (script.playAudios[i])
        {
            var audioComponent = getAudioComponentForTrack(script.playAudios[i]);
            audioComponent.play(script.audioPlayCount);      
        }
    }
   
}

// Trigger an action if not in cooldown period
function triggerCallback()
{ 
    if (getTime() >= triggerStartTime + script.TriggerDisableTime) {
        triggerStartTime = getTime();
        onTriggered();
    }
}

// Setup the audio component if audio track defined
function getAudioComponentForTrack ( audioTrackAsset )
{
    var trackName = audioTrackAsset.name;

    if (!global.ftAudioComponents)
    {
        global.ftAudioComponents = {};
    }

    if (!global.ftAudioComponents[trackName])
    {
        var audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponent.audioTrack = audioTrackAsset;
        
        global.ftAudioComponents[trackName] = audioComponent;  
    }

    return global.ftAudioComponents[trackName];    
}

// Allow fullscreen tapping if trigger is touch based
if (script.AnimationTrigger == "TouchStartEvent"
    || script.AnimationTrigger == "TouchStartEvent"
    || script.AnimationTrigger == "TapEvent")
{
    global.touchSystem.touchBlocking = true;
    global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", true);
    global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", true);
}

var event = script.createEvent(script.AnimationTrigger);
event.faceIndex = script.faceIndex;
event.bind(triggerCallback);