// MagnifyingHintController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls a preview of a marker that appears when a marker is not visible.

// @input Asset.Texture previewTexture

//@ui {"widget":"separator"}
// @input float delay = 0.3
// @input string mainTextHint
// @input string secondaryTextHint

//@ui {"widget":"separator"}
// @input bool advanced = false
// @input Asset.Texture deviceCameraOutput {"showIf":"advanced"}
// @input SceneObject background  {"showIf":"advanced"}
// @input SceneObject foreground  {"showIf":"advanced"}
// @input SceneObject magnifyingGlassPivot  {"showIf":"advanced"}
// @input SceneObject magnifying  {"showIf":"advanced"}
// @input SceneObject label  {"showIf":"advanced"}

var totalHeightSnapchatUI = 400;
var smallPreviewMinMaxScale = [15, 45];
var largePreviewMinMaxScale = [45, 60];
var hidden = false;
var openedState = false;
var label = script.label.getFirstComponent("Component.Label");
var currentTextIndex = 0;
var currentAngle = 0;
var rotationSpeed = .025;
var frameDelay = 1;

if (!script.previewTexture) {
	print("MagnifyingHintController: Please add reference to the `Preview Texture` field to the texture you want to show in the hint.");
}

function initializeSizing() {
	var aspect = 1;

	if(script.previewTexture) {
		setTexture(script.foreground, script.previewTexture);
		aspect = getPreviewTextureAspectRatio();
		var originalScale = new vec3(1, 1 * aspect, 0);
	}

	var originalScale = new vec3(1, 1 * aspect, 0);

	var foregroundScale = clampScale(originalScale, smallPreviewMinMaxScale[0], smallPreviewMinMaxScale[1]);
	var largeForegroundScale = clampScale(foregroundScale.uniformScale(3), largePreviewMinMaxScale[0], largePreviewMinMaxScale[1]);
	script.foreground.getTransform().setLocalScale(foregroundScale)
	global.tweenManager.setStartValue(script.foreground, "open", foregroundScale);
	global.tweenManager.setEndValue(script.foreground, "open", largeForegroundScale);
	global.tweenManager.setStartValue(script.foreground, "close", largeForegroundScale);
	global.tweenManager.setEndValue(script.foreground, "close", foregroundScale);

	var backgroundScale = foregroundScale.add(new vec3(2,2,2));
	var largeBackgroundScale = largeForegroundScale.add(new vec3(1,1,1));
	script.background.getTransform().setLocalScale(backgroundScale);
	global.tweenManager.setStartValue(script.background, "open", backgroundScale);
	global.tweenManager.setEndValue(script.background, "open", largeBackgroundScale);
	global.tweenManager.setStartValue(script.background, "close", largeBackgroundScale);
	global.tweenManager.setEndValue(script.background, "close", backgroundScale);
}

function initialize() {
	label.text = script.mainTextHint;

	global.tweenManager.startTween(script.background, "transitionin");
	global.tweenManager.startTween(script.foreground, "transitionin");
	global.tweenManager.startTween(script.magnifying, "transitionin");
	global.tweenManager.startTween(script.label, "transitionin");

	script.api.show = show;
	script.api.hide = hide;
}

function onUpdate() {

	if(global.scene.isRecording()) {
		hide();
		return;
	}

	// We have to wait a frame before we get accurate camera aspect ratio. 
	if (frameDelay > 0) {
		frameDelay--;
		return;
	} else if (frameDelay == 0) {
		initializeSizing();
		frameDelay = -1;
	}

	// Rotate the magnifying glass
	var newRotation = quat.angleAxis(currentAngle, vec3.forward());
	script.magnifyingGlassPivot.getTransform().setLocalRotation(newRotation);
	currentAngle += rotationSpeed;
}

function closeHint() {
	global.tweenManager.startTween(script.background, "close");
	global.tweenManager.startTween(script.foreground, "close", function () {
		global.tweenManager.pauseTween(script.magnifying, "transitionout");
		global.tweenManager.startTween(script.magnifying, "transitionin");
		script.label.enabled = true;
	});

	label.text = script.mainTextHint;

	openedState = false;
}

function openHint() {
	global.tweenManager.startTween(script.background, "open");
	global.tweenManager.startTween(script.foreground, "open");

	global.tweenManager.pauseTween(script.magnifying, "transitionin");
	global.tweenManager.startTween(script.magnifying, "transitionout");

	label.text = script.secondaryTextHint;

	openedState = true;
}

function show() {
	if (!hidden) {
		return;
	}

	hidden = false;

	script.getSceneObject().getChild(0).enabled = true;

	if (openedState) {
		closeHint();
	}

	global.tweenManager.startTween(script.background, "transitionin");
	global.tweenManager.startTween(script.foreground, "transitionin");
	global.tweenManager.startTween(script.magnifying, "transitionin");
	global.tweenManager.startTween(script.label, "transitionin");
}

function hide() {
	if (hidden) {
		return;
	}

	hidden = true;

	global.tweenManager.stopTween(script.background, "transitionin");
	global.tweenManager.stopTween(script.foreground, "transitionin");
	global.tweenManager.stopTween(script.magnifying, "transitionin");
	global.tweenManager.stopTween(script.label, "transitionin");

	global.tweenManager.resetObject(script.background, "transitionin");
	global.tweenManager.resetObject(script.foreground, "transitionin");
	global.tweenManager.resetObject(script.magnifying, "transitionin");
	global.tweenManager.resetObject(script.label, "transitionin");

	script.getSceneObject().getChild(0).enabled = false;
}

function onTouchStart() {
	if(openedState) {
		closeHint();
	} else {
		openHint();
	}
}

// Texture helpers
function getPreviewTextureAspectRatio() {
	return script.previewTexture.getHeight() / script.previewTexture.getWidth();
}

function setTexture (spriteObject, previewTexture) {
	var mainPass = spriteObject.getFirstComponent("Component.SpriteVisual").mainPass;
	mainPass.baseTex = previewTexture;
}

function clampScale(scale, minScale, maxScale) {
	var safeAreaAspect = script.deviceCameraOutput.getWidth() / (script.deviceCameraOutput.getHeight() - totalHeightSnapchatUI);
	var newScale = vec3.one()
		.uniformScale(100)
		.scale(scale);

	var largestComponent = newScale.x >= newScale.y ? "x" : "y";
	var smallestComponent = largestComponent == "x" ? "y" : "x";

	// If image is wide or square, we need to account for screen aspect ratio
	if (largestComponent == "x") {
		maxScale *= safeAreaAspect;
	}

	// Make sure preview is of min scale
	newScale = newScale.uniformScale( minScale / newScale[smallestComponent] );

	// Make sure preview doesn't go beyond the screen
	if (newScale[largestComponent] > maxScale) {
		newScale = newScale.uniformScale( maxScale / newScale[largestComponent] );
	}

	return newScale;
}

// Bind events
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(onTouchStart);

initialize();