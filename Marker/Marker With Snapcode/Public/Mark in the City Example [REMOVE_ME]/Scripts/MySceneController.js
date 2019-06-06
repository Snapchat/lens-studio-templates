// MySceneController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Plays Mark in the City scene animation.

// @input Component.AnimationMixer markScene
// @input Asset.Texture roadAnimation
// @input Asset.AudioTrackAsset audio

if (!script.markScene) {
	print("MySceneController: Please add reference to Mark to markScene.");
}

if (!script.roadAnimation) {
	print("MySceneController: Please add reference to roadAnimation texture to roadAnimation.");
}

var audioComponent;
var animationPlayed = false;
var texturePlayed = false;

function audioSetup()
{
    if(script.audio && !audioComponent)
    {       
        audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponent.audioTrack = script.audio;        
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

function playAnimationAndSound() {
	if (script.markScene) {
		script.markScene.startWithCallback("Anim", 0, 1, playAnimationAndSound);
	}
	
	playAudio(audioComponent, 1);
}

global.onSceneEnabled = function() {
	animationPlayed = true;
	texturePlayed = false;
	
	if (script.roadAnimation) {
		script.roadAnimation.control.pauseAtFrame(0);
	}

	playAnimationAndSound();
}

global.onSceneWillDisable = function() {
	animationPlayed = false;
	texturePlayed = false;

	if (script.roadAnimation) {
		script.roadAnimation.control.pauseAtFrame(0);
	}

	if (script.markScene) {
		script.markScene.start("Anim", 0, 1);
	}
}

global.onSceneDisabled = function() {
	if (script.markScene) {
		script.markScene.stop("Anim");
	}

	stopAudio(audioComponent);
}

function onUpdate() {
	if (
		animationPlayed 
		&& !texturePlayed
		&& script.markScene
		&& script.markScene.getLayerTime("Anim") > 2.6
	) {

		if (script.roadAnimation) {
			script.roadAnimation.control.play(1, 0);
		}

		texturePlayed = true;
	}
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate)

audioSetup();