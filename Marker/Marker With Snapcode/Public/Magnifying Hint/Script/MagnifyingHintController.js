// MagnifyingHintController.js
// Version: 0.0.2
// Event: Lens Initialized
// Description: Controls a preview of a marker that appears when a marker is not visible.

// @input Asset.Texture previewTexture

//@ui {"widget":"separator"}
// @input string mainTextHint
// @input string secondaryTextHint

//@ui {"widget":"separator"}
// @input bool advanced = false
// @input Asset.Texture deviceCameraOutput {"showIf":"advanced"}
// @input SceneObject background  {"showIf":"advanced"}
// @input SceneObject foreground  {"showIf":"advanced"}
// @input SceneObject magnifying  {"showIf":"advanced"}
// @input SceneObject label  {"showIf":"advanced"}

var totalHeightSnapchatUI = 400;
var smallPreviewMinMaxScale = [0.4, 0.7];
var largePreviewScale = 0.85
var frameWidth = 0.2;
var hidden = false;
var openedState = false;

var label = script.label.getFirstComponent("Component.Text");
var textTransform = script.label.getFirstComponent("ScreenTransform");
var fgTransform = script.foreground.getFirstComponent("ScreenTransform");
var bgTransform = script.background.getFirstComponent("ScreenTransform");
var mgTransform = script.magnifying.getFirstComponent("ScreenTransform");
var srTransform = script.getSceneObject().getFirstComponent("ScreenTransform");

var currentTextIndex = 0;
var currentAngle = 0;
var rotationSpeed = .025;
var radius = 0.25;
var frameDelay = 1;
var textOffset = 0.1;

var hintObjects = script.getSceneObject().getChild(0);

if (!script.previewTexture) {
	print("MagnifyingHintController: Please add reference to the `Preview Texture` field to the texture you want to show in the hint.");
}

function initializeSizing() {
	setTexture(script.foreground, script.previewTexture);

	var aspect = getAspectRatio(script.previewTexture);
	var screenAspect = getAspectRatio(script.deviceCameraOutput);

	var parentSize = srTransform.anchors.getSize();
	var parentAspect = parentSize.y / parentSize.x;
	var coeff = aspect / screenAspect / parentAspect;
	var halfSize = coeff > 1 ? new vec2(1.0 / coeff, 1.0) : new vec2(1.0, 1.0 * coeff);

	var minScale = getOptimalScale(aspect, smallPreviewMinMaxScale[0], smallPreviewMinMaxScale[1]);
	var maxScale = largePreviewScale;

	var anchors = new vec4(-halfSize.x, -halfSize.y, halfSize.x, halfSize.y);

	var minAnchors = anchors.uniformScale(minScale);
	var maxAnchors = anchors.uniformScale(maxScale);

	setRect(fgTransform.anchors, minAnchors);
	setRect(bgTransform.anchors, minAnchors);

	var offsets = new vec4(-1.0, -1.0, 1.0, 1.0).uniformScale(frameWidth);

	setRect(bgTransform.offsets, offsets)

	global.tweenManager.setStartValue(script.foreground, "open", minAnchors);
	global.tweenManager.setEndValue(script.foreground, "open", maxAnchors);
	global.tweenManager.setStartValue(script.foreground, "close", maxAnchors);
	global.tweenManager.setEndValue(script.foreground, "close", minAnchors);

	global.tweenManager.setStartValue(script.background, "open", minAnchors);
	global.tweenManager.setEndValue(script.background, "open", maxAnchors);
	global.tweenManager.setStartValue(script.background, "close", maxAnchors);
	global.tweenManager.setEndValue(script.background, "close", minAnchors);
}

function getOptimalScale(aspect, minBound, maxBound) {
	var t = aspect < 1.0 ? aspect : 1.0 / aspect;
	scale = lerp(minBound, maxBound, 1.0 - t);
	return scale;
}

function setRect(rect, vec) {
	rect.left = vec.x;
	rect.bottom = vec.y;
	rect.right = vec.z;
	rect.top = vec.w;
}

function lerp(a, b, t) {
	return a + t * (b - a);
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

	if (global.scene.isRecording()) {
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

	var offset = new vec2(Math.cos(currentAngle), Math.sin(currentAngle)).uniformScale(radius);
	mgTransform.anchors.setCenter(offset);
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

	hintObjects.enabled = true;

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

	hintObjects.enabled = false;
}

function onTouchStart() {
	if (openedState) {
		closeHint();
	} else {
		openHint();
	}
}

// Texture helpers
function getAspectRatio(texture) {
	return texture.getHeight() / texture.getWidth();
}

function setTexture(spriteObject, previewTexture) {
	var mainPass = spriteObject.getFirstComponent("Component.Image").mainPass;
	mainPass.baseTex = previewTexture;
}

// Bind events
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(onTouchStart);

initialize();