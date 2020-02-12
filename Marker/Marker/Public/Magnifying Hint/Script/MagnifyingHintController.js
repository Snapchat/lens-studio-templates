// MagnifyingHintController.js
// Version: 0.1.0
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

var label;
var fgTransform;
var bgTransform;
var mgTransform;
var srTransform;
var hintObjects;

var currentTextIndex = 0;
var currentAngle = 0;
var rotationSpeed = .025;
var radius = 0.25;
var frameDelay = 1;

function checkInputValues() {
	if (!script.previewTexture) {
		print("WARNING: MagnifyingHintController: PreviewTexture is not set under the advanced tab");
	}

	if (!script.deviceCameraOutput) {
		print("ERROR: MagnifyingHintController: DeviceCameraOutput is not set under the advanced tab");
	}

	if (!script.foreground) {
		print("WARNING: MagnifyingHintController: Foreground is not set under the advanced tab");
	}

	if (!script.background) {
		print("WARNING: MagnifyingHintController: Background is not set under the advanced tab");
	}

	if (!script.magnifying) {
		print("WARNING: MagnifyingHintController: Magnifying is not set under the advanced tab");
	}

	if (!script.label) {
		print("WARNING: MagnifyingHintController: Label Text Component is not set under the advanced tab");
	}
}


function initialize() {
	if (script.foreground) {
		fgTransform = script.foreground.getFirstComponent("ScreenTransform");
		global.tweenManager.startTween(script.foreground, "transitionin");
	}
	if (script.background) {
		bgTransform = script.background.getFirstComponent("ScreenTransform");
		global.tweenManager.startTween(script.background, "transitionin");
	}

	if (script.magnifying) {
		mgTransform = script.magnifying.getFirstComponent("ScreenTransform");
		global.tweenManager.startTween(script.magnifying, "transitionin");
	}

	if (script.label) {
		label = script.label.getFirstComponent("Component.Text");
		label.text = script.mainTextHint;
		global.tweenManager.startTween(script.label, "transitionin");
	}

	srTransform = script.getSceneObject().getFirstComponent("ScreenTransform");
	hintObjects = script.getSceneObject().getChild(0);

	script.api.show = show;
	script.api.hide = hide;
}


function initializeSizing() {
	if (script.foreground && script.previewTexture) {
		setTexture(script.foreground, script.previewTexture);
	}
	if (!script.deviceCameraOutput) {
		return;
	}
	var aspect = script.previewTexture ? getAspectRatio(script.previewTexture) : 1.0;
	var screenAspect = getAspectRatio(script.deviceCameraOutput);

	var parentSize = srTransform.anchors.getSize();
	var parentAspect = parentSize.y / parentSize.x;
	var coeff = aspect / screenAspect / parentAspect;
	var halfSize = coeff > 1 ? new vec2(1.0 / coeff, 1.0) : new vec2(1.0, 1.0 * coeff);

	var minScale = getOptimalScale(aspect, smallPreviewMinMaxScale[0], smallPreviewMinMaxScale[1]);
	var maxScale = largePreviewScale;

	var anchors = new vec4(-halfSize.x, -halfSize.y, halfSize.x, halfSize.y);
	var offsets = new vec4(-1.0, -1.0, 1.0, 1.0).uniformScale(frameWidth);

	var minAnchors = anchors.uniformScale(minScale);
	var maxAnchors = anchors.uniformScale(maxScale);


	if (fgTransform) {
		setRect(fgTransform.anchors, minAnchors);
		global.tweenManager.setStartValue(script.foreground, "open", minAnchors);
		global.tweenManager.setEndValue(script.foreground, "open", maxAnchors);
		global.tweenManager.setStartValue(script.foreground, "close", maxAnchors);
		global.tweenManager.setEndValue(script.foreground, "close", minAnchors);
	}

	if (bgTransform) {
		setRect(bgTransform.anchors, minAnchors);
		setRect(bgTransform.offsets, offsets)
		global.tweenManager.setStartValue(script.background, "open", minAnchors);
		global.tweenManager.setEndValue(script.background, "open", maxAnchors);
		global.tweenManager.setStartValue(script.background, "close", maxAnchors);
		global.tweenManager.setEndValue(script.background, "close", minAnchors);
	}
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
	if (script.magnifying) {
		updateMagnifying();
	}
}

function updateMagnifying() {
	var offset = new vec2(Math.cos(currentAngle), Math.sin(currentAngle)).uniformScale(radius);
	mgTransform.anchors.setCenter(offset);
	currentAngle += rotationSpeed;
}

function closeHint() {
	if (script.background) {
		global.tweenManager.startTween(script.background, "close");
	}
	if (script.foreground) {
		global.tweenManager.startTween(script.foreground, "close", showMagnifying);
	} else {
		showMagnifying();
	}

	if (label) {
		label.text = script.mainTextHint;
	}

	openedState = false;
}

function showMagnifying() {
	if (script.magnifying) {
		global.tweenManager.pauseTween(script.magnifying, "transitionout");
		global.tweenManager.startTween(script.magnifying, "transitionin");
	}
}

function openHint() {
	if (script.background) {
		global.tweenManager.startTween(script.background, "open");
	}
	if (script.foreground) {
		global.tweenManager.startTween(script.foreground, "open");
	}
	if (script.magnifying) {
		global.tweenManager.pauseTween(script.magnifying, "transitionin");
		global.tweenManager.startTween(script.magnifying, "transitionout");
	}
	if (label) {
		label.text = script.secondaryTextHint;
	}

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
	if (script.background) {
		global.tweenManager.startTween(script.background, "transitionin");
	}
	if (script.foreground) {
		global.tweenManager.startTween(script.foreground, "transitionin");
	}
	if (script.magnifying) {
		global.tweenManager.startTween(script.magnifying, "transitionin");
	}
	if (label) {
		global.tweenManager.startTween(script.label, "transitionin");
	}
}

function hide() {
	if (hidden) {
		return;
	}

	hidden = true;

	if (script.background) {
		global.tweenManager.stopTween(script.background, "transitionin");
		global.tweenManager.resetObject(script.background, "transitionin");
	}
	if (script.foreground) {
		global.tweenManager.stopTween(script.foreground, "transitionin");
		global.tweenManager.resetObject(script.foreground, "transitionin");
	}
	if (script.magnifying) {
		global.tweenManager.stopTween(script.magnifying, "transitionin");
		global.tweenManager.resetObject(script.magnifying, "transitionin");
	}
	if (label) {
		global.tweenManager.stopTween(script.label, "transitionin");
		global.tweenManager.resetObject(script.label, "transitionin");
	}
	
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

function setTexture(sceneObject, previewTexture) {
	var mainPass = sceneObject.getFirstComponent("Component.Image").mainPass;
	mainPass.baseTex = previewTexture;
}

// Bind events
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(onTouchStart);

checkInputValues();

initialize();