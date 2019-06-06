// ApproachAnim.js
// Version: 0.0.5
// Event: Lens Initialized
// Description: Plays a single animation on the character when the user gets close

//  @ui {"widget": "group_start", "label": "Approach Animation Settings"}

//  @input string approachStartAnimLayer   
//  @input string approachLoopAnimLayer

//  @ui {"widget": "group_end"}

//  @input Asset.AudioTrackAsset approachStartAnimAudio
//  @input Asset.AudioTrackAsset approachLoopAnimAudio
//  @input SceneObject cameraObject
//  @input float triggerRadius

// Variable setups
var audioComponentStart = null;
var audioComponentLoop = null;
var approachAnimPlaying = false;
var minManipDist = script.getSceneObject().getFirstComponent("Component.ManipulateComponent").minDistance;
var maxManipDist = script.getSceneObject().getFirstComponent("Component.ManipulateComponent").maxDistance;
script.triggerRadius = clampNumber(script.triggerRadius, minManipDist, maxManipDist); 

// Setup the audio component if audio track defined
function audioSetup()
{
    if(script.approachStartAnimAudio && !audioComponentStart)
    {       
        audioComponentStart = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentStart.audioTrack = script.approachStartAnimAudio;
    }

    if(script.approachLoopAnimAudio && !audioComponentLoop)
    {       
        audioComponentLoop = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentLoop.audioTrack = script.approachLoopAnimAudio;
    }
}
audioSetup();

// Function runs at start of lens
function onLensTurnOnEvent()
{
    // Make sure to reset var in lens Turn On Event
    approachAnimPlaying = false;    
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOnEvent); 

// Function runs at the start of every frame
function onUpdateEvent(eventData)
{
    if(script.cameraObject)
    {
        // Distance between the camera and the object is used to determine when to trigger the approach animations
        var dist =  script.cameraObject.getTransform().getWorldPosition().distance(script.getSceneObject().getTransform().getWorldPosition());

        // If the approach anim isn't already playing then it's ok to trigger it
        if(!approachAnimPlaying && dist <= script.triggerRadius)
        {
            onApproach();
        }        
    }        
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent); 

// Make sure to turn animation weights to 0 when lens is turned off
function onLensTurnOff()
{
    if(script.api.animMixer)
    {
        script.api.animMixer.setWeight(script.api.idleAnimLayerName, 0.0);
        script.api.animMixer.setWeight(script.approachLoopAnimLayer, 0.0);    
        script.api.animMixer.setWeight(script.approachStartAnimLayer, 0.0);        
    }
} 
var turnOffEvent = script.createEvent("TurnOffEvent");
turnOffEvent.bind(onLensTurnOff); 


// Function for handling approach animations
function onApproach(eventData)
{
    if(global.scene.getCameraType() == "back" && !approachAnimPlaying)
    {         
        if(script.approachStartAnimLayer && script.approachStartAnimLayer != "" && script.api.animMixer)
        {
            print("ApproachAnim: Approach Triggered");
            approachAnimPlaying = true;             

            // Set the weight of the idle anim to 0 before playing the next one
            script.api.animMixer.setWeight(script.api.idleAnimLayerName, 0.0);

            // Start the reaction to the approach anim first
            script.api.animMixer.startWithCallback(script.approachStartAnimLayer, 0, 1, approachStartAnimEndCallback);
            script.api.animMixer.setWeight(script.approachStartAnimLayer, 1.0);      

            // If any audio has been defined for the anim we can play it now
            if(script.api.idleAnimAudio && script.api.idleAnimAudio.isPlaying())
            {
                script.api.idleAnimAudio.stop(false);
            }

            playApproachAnimAudio(audioComponentStart, 1);                   
        }  
             
    }     
}

// Function for handling the approach anim loop that comes after the reaction
function approachStartAnimEndCallback()
{
    script.canReset = false;
    if(script.approachLoopAnimLayer && script.approachLoopAnimLayer != "")
    {
        print("ApproachAnim: Approach Loop Start");        

        // Set the weight of the approach start anim to 0 before our next anim
        script.api.animMixer.setWeight(script.approachStartAnimLayer, 0.0);

        // this animation loops so we don't use the start with callback function
        script.api.animMixer.start(script.approachLoopAnimLayer, 0, -1);
        script.api.animMixer.setWeight(script.approachLoopAnimLayer, 1.0);      

        // Just as above we only play audio if one has been defined
        stopApproachAnimAudio(audioComponentStart);
        playApproachAnimAudio(audioComponentLoop, -1);        
    }       
}

function playApproachAnimAudio(audioComponent, loops)
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

function stopApproachAnimAudio(audioComponent)
{
    if (audioComponent)
    {
        if(audioComponent.isPlaying())
        {
            audioComponent.stop(false);
        }
    }  
}

// Clamping number utility function
function clampNumber(val, min, max)
{
    return Math.min(Math.max(val, min), max);
}
