// SoundboardKey.js
// Version: 0.0.2
// Event: Lens Initialized
// Description: Added to a billboard with a touch component. When tapped, plays
// a sound and shows an accompanying billboard for the duration of the sound

// @input Asset.AudioTrackAsset audioTrack
// @input SceneObject triggerVisual
// @input bool useCustomHoldTime = false
// @input float customHoldTime = 0.8

var audioComponent;
var delayedEvent = script.createEvent("DelayedCallbackEvent");
var delayFrame = false;

// Turn on event
function onTurnOn( eventData )
{
    // Create the audio
    audioSetup();
}
var turnOn = script.createEvent("TurnOnEvent");
turnOn.bind(onTurnOn);

// Update event
function onUpdate( eventData )
{
    if( !delayFrame )
    {
        delayFrame = true;
        return;
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

// Tapped event
function onTapped(eventData)
{
    print("Soundboard: " + script.getSceneObject().name + " - Key hit" );

    global.tweenManager.startTween( script.getSceneObject(), "press" );

    // Play sound
    if( audioComponent ) 
    {
        audioComponent.play( 1 ); 

        // Show the visual
        showTriggerVisual();

        // Start a delayed callback to hide visual when sound ends
        delayedEvent.bind( hideTriggerVisual );

        var holdTime = audioComponent.duration;
        if(script.useCustomHoldTime)
        {
            holdTime = script.customHoldTime;
        }

        delayedEvent.reset( holdTime );
    }
    else
    {
        print( "Soundboard: " + script.getSceneObject().name + " - Audio resource not set. Please add in the Inspector")
    }
}

var tapEvent = script.createEvent("TouchStartEvent");
tapEvent.bind(onTapped);

// Shows the optional visual
function showTriggerVisual()
{
    if( script.triggerVisual ) 
    {
        global.tweenManager.startTween( script.triggerVisual, "show" );
    }
}

// Hides the optional visual
function hideTriggerVisual()
{
    if( script.triggerVisual ) 
    {
        global.tweenManager.startTween( script.triggerVisual, "hide" );
    }
}

// Setup audio component. This allows you to simply pass in an audio asset
// to the script rather than having to create the component manually
function audioSetup()
{
    if( script.audioTrack && !audioComponent )
    { 
        audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponent.audioTrack = script.audioTrack;
    }
    else
    {
        print( "Soundboard: " + script.getSceneObject().name + " - Audio resource not set. Please add in the Inspector")
    }
}