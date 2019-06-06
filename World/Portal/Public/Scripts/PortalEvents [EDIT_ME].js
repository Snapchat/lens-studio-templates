// PortalEvents.js
// This script binds callbacks to two portal events:
//		- onPortalEnter
//		- onPortalExit

// Edit it to add your custom portal lens logic

// @ui {"widget": "group_start", "label": "Custom Variables"}
	// @input SceneObject rocketButtonCollider
	//  @input Asset.AudioTrackAsset enterPortalAudio
// @ui {"widget": "group_end"}

// @ui {"widget": "group_start", "label": "Portal API [Do Not Edit]"}
	// @input Component.Script portalControllerScript
// @ui {"widget": "group_end"}

// Portal Enter Event:
// Triggered every time the camera enters the portal

var audioComponentPortal;

onLensTurnOn();


function onPortalEnter()
{
	print("Entered Portal");

	// Enable the rocket button
	if(script.rocketButtonCollider)
	{
		script.rocketButtonCollider.enabled = true;
		playPortalAudio(audioComponentPortal, -1);   
	}	
}

// Portal Exit Event:
// Triggered every time the camera leaves the portal

function onPortalExit()
{
	print("Exited Portal");

	// Disable the rocket button
	if(script.rocketButtonCollider)
	{
		script.rocketButtonCollider.enabled = false;
		stopPortalAudio(audioComponentPortal);
	}

}

// Frame Update Event:
// Triggered every frame

function onUpdate(eventData)
{	
	// Check whether camera is in portal every frame
	if(script.portalControllerScript && script.portalControllerScript.api.isCameraInPortal())
	{

	}
}

// Lens Turned On Event:
// Triggered when Lens Turns On (after 'Initialized')

function onLensTurnOn()
{
	if(script.rocketButtonCollider)
	{
		script.rocketButtonCollider.enabled = false;
	}

	audioSetup();


	// Check whether camera is in portal on Lens Turned On
	if(script.portalControllerScript && script.portalControllerScript.api.isCameraInPortal() && global.scene.getCameraType() == "back")
	{
		onPortalEnter();
	}	
}

// Custom Functions

function audioSetup()
{
    if(script.enterPortalAudio && !audioComponentPortal)
    {       
        audioComponentPortal = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentPortal.audioTrack = script.enterPortalAudio;        
    }
}

function playPortalAudio(audioComponent, loops)
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

function stopPortalAudio(audioComponent)
{
    if (audioComponent)
    {
        if(audioComponent.isPlaying())
        {
            audioComponent.stop(false);
        }
    }  
}


// Portal event callback bindings
// Do not edit below this line
// ------------------------------

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

if(script.portalControllerScript)
{
	script.portalControllerScript.api.setPortalEnterCallback(onPortalEnter);

	script.portalControllerScript.api.setPortalExitCallback(onPortalExit);	
}