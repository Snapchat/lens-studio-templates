// lookAtAnim.js
// Version: 0.0.4
// Event: Lens Initialized
// Description: Plays a single animation on the character when the user looks at the character

//  @ui {"widget": "group_start", "label": "Look At Animation Settings"}

//  @input string lookAtAnimLayer
//  @input float triggerAngle
//  @input SceneObject cameraObject

//  @ui {"widget": "group_end"}

//  @input SceneObject lookAtTarget
//  @input Asset.AudioTrackAsset lookAtAnimAudio

// Variable setups
var lookAtAudioComponent = null;
var lookAtAnimPlaying = false;
var lookAtPoint = script.getSceneObject();

// If a custom lookAt target has been defined then we'll use that instead
if(script.lookAtTarget)
{
    lookAtPoint = script.lookAtTarget;
}

// Setup the audio component if audio track defined
function audioSetup()
{
    if(script.lookAtAnimAudio && !lookAtAudioComponent)
    {       
        lookAtAudioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
        lookAtAudioComponent.audioTrack = script.lookAtAnimAudio;
    }
}
audioSetup();

// Function runs at start of lens
function onLensTurnOnEvent()
{
    // Make sure to reset var in lens Turn On Event
    lookAtAnimPlaying = false;  
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOnEvent);  

// Function runs every frame
function onUpdateEvent(eventData)
{
    if(script.cameraObject)
    {  
        var angleVal = calclookAtAngle();  
        
        // Executes lookAt anim if calculated angle is less than the user defined trigger angle
        if(!lookAtAnimPlaying && angleVal <= script.triggerAngle * distScaleFactor())
        {
            onlookAt();
            lookAtAnimPlaying = true;           
        }
        
        // Makes sure the lookAt trigger anim doesn't play when finished if still looking at object and resets when you look away and anim is complete
        if(lookAtAnimPlaying)
        {
            if(angleVal >= (script.triggerAngle * 1.1) * distScaleFactor()) 
            {
                print("LookAtAnim: Look At Reset");  
                lookAtAnimEndCallback();              
            }
        }        
    }     
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);  

// Function sets animation mixer values to 0 when lens is turned off
function lensTurnOff()
{
    if(script.api.animMixer)
    {        
        script.api.animMixer.setWeight(script.lookAtAnimLayer, 1.0); 
        script.api.animMixer.stop(script.lookAtAnimLayer);
    }    
}
var turnOffEvent = script.createEvent("TurnOffEvent");
turnOffEvent.bind(lensTurnOff);  

// Function handles logic when the lookAt is triggered
function onlookAt(eventData)
{
    if(global.scene.getCameraType() == "back" && !lookAtAnimPlaying)
    {         
        if(script.lookAtAnimLayer && script.lookAtAnimLayer != "" && script.api.animMixer)
        {
            print("LookAtAnim: Look At Triggered");
            lookAtAnimPlaying = true; 
            
            script.api.animMixer.setWeight(script.api.idleAnimLayerName, 0.0);

            script.api.animMixer.start(script.lookAtAnimLayer, 0, -1);
            script.api.animMixer.setWeight(script.lookAtAnimLayer, 1.0);  
            
            if(script.api.idleAnimAudio && script.api.idleAnimAudio.isPlaying())
            {
                script.api.idleAnimAudio.stop(false);
            }

            playLookAtAnimAudio(lookAtAudioComponent, -1);                 
        }               
    }     
}

// Function handles logic when the lookAt ends
function lookAtAnimEndCallback()
{
    lookAtAnimPlaying = false;
    script.api.animMixer.setWeight(script.lookAtAnimLayer, 0.0);
    stopLookAtAnimAudio(lookAtAudioComponent);
    script.api.idleAnimInitFunc();
}

// Utility functions
function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}

function clamp(num, min, max) 
{
    return Math.min(Math.max(num, min), max);
}

function distScaleFactor()
{
    var distance = script.cameraObject.getTransform().getWorldPosition().distance(lookAtPoint.getTransform().getWorldPosition());
    var lerpVal = lerp(1.0, 0.2, distance * 0.00085);
    lerpVal = clamp(0.65, 1.0, lerpVal);    

    return lerpVal;
}

// Function used to calculate the viewing angle of the camera to the lookAt target
function calclookAtAngle()
{
    // This var calculates a vector from the object to the camera and then normalizes it
    var vecToCam =  script.cameraObject.getTransform().getWorldPosition().sub(lookAtPoint.getTransform().getWorldPosition()).normalize();
    var camFwd = script.cameraObject.getTransform().forward;
    // The number 57.2958 is the conversion from radian to degree
    var angleValue = vecToCam.angleTo(camFwd) * 57.2958;   

    return angleValue;
}

function playLookAtAnimAudio(audioComponent, loops)
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

function stopLookAtAnimAudio(audioComponent)
{
    if (audioComponent)
    {
        if(audioComponent.isPlaying())
        {
            audioComponent.stop(false);
        }
    }  
}
