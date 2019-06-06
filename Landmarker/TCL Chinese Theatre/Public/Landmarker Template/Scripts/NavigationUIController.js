// MoveController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls the debug control UI

//@input int maxTravelDistance
//@input int moveSpeed 

//@ui {"widget":"separator"}

//@input bool Advanced

    //@ui {"widget":"group_start","label":"References", "showIf": "Advanced"}
		//@input SceneObject distanceTarget
		// @input Component.ScreenTransform distanceSymbol
		// @input Component.Text distanceText
    
    //@ui {"widget":"separator"}
		//@input Component.ScreenTransform controlPlate
		//@input Component.ScreenTransform controlDot

    //@ui {"widget":"separator"}
		//@input Component.Camera orthoCamera 
		//@input Component.Camera sceneCamera 

    //@ui {"widget":"separator"}
		//@input SceneObject debugViewAnchor

//@ui {"widget":"group_end"}

// Options
var moveSpeed = script.moveSpeed;
var radius = 2.7; 
var maxDistanceFromCenter = script.maxTravelDistance*100; 

// Constants
var halfOrthographicSizeWithAspectRatio = (new vec2(script.orthoCamera.size * script.orthoCamera.aspect, script.orthoCamera.size)).uniformScale(.5);
var cameraTransform = script.sceneCamera.getSceneObject().getTransform();
var controlPlateCenter = new vec2(script.controlPlate.anchors.left, script.controlPlate.anchors.top);
var controlDotAnchors = script.controlDot.anchors;
var distanceSymbolAnchors = script.distanceSymbol.anchors;
var worldOrigin = new vec3(0,0,0);
var manipulating;

// States
var controlPos;
var distanceSet;
var centeringDot;

script.api.resetPosition = resetPosition;
script.api.setCameraMode = setCameraMode;
script.api.setLookAtEnabled = setLookAtEnabled;
script.api.setGyroEnabled = setGyroEnabled;

// Enable full screen touches
global.touchSystem.touchBlocking = true;

// Allow double-tap to be passed through to Snapchat to flip the camera.
global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", true);


// Events
function onUpdate (eventData){
	if (manipulating){
		if (controlPos) {
			var direction = controlPos.worldSpace
			moveCameraWith( new vec3(direction.x, 0, direction.y));	
		}
	}
	else {
		if (centeringDot) {
			centerControlDot();
		}
	}

	updateDistanceMarker();
}

function onTouchStart (eventData){
	var touchPos = eventData.getTouchPosition();

	if (touchWithinSpriteAligner(touchPos, script.controlPlate)) {
		manipulating = true;
		moveControlDot(touchPos);
	}
}

function onTouchMove (eventData){
	if (!manipulating) return;

	var touchPos = eventData.getTouchPosition();
	moveControlDot(touchPos);
}

function onTouchEnd (eventData){
	if (!manipulating) return;
	manipulating = false;
	centeringDot = true;
}

// Helpers
function screenPosToBindingPoint(screenPos){
	var x = (screenPos.x * 2) - 1;
	var y = 1 - (screenPos.y * 2);
	return new vec2(x, y);
}

function bindingPointToScreenPos(bindingPoint){
	var x = (bindingPoint.x + 1) / 2;
	var y = (1 - bindingPoint.y) / 2;
	return new vec2(x, y);
}

function getControlPosition (v, radius) {
	var screenSpace = v;

	// Convert to worldspace since screen space is affected by aspect ratio
	var clampedWorldSpace = script.orthoCamera.screenSpaceToWorldSpace(v, 1);
	var centerWorldPos = script.orthoCamera.screenSpaceToWorldSpace(controlPlateCenter, 1);

	// If current V is farther from center than radius, clamp it
	var distance = clampedWorldSpace.distance(centerWorldPos);
	if (distance > radius){
		clampedWorldSpace = centerWorldPos.moveTowards(clampedWorldSpace, radius);

		screenSpace = script.orthoCamera.worldSpaceToScreenSpace(clampedWorldSpace);
	}

	return {
		screenSpace: screenSpace,
		worldSpace: clampedWorldSpace
			.sub(centerWorldPos)
	};
}

function moveControlDot(touchPos) {
	var screenPos = screenPosToBindingPoint(touchPos);

	controlPos = getControlPosition(screenPos, radius);

	controlDotAnchors.left = controlPos.screenSpace.x;
	controlDotAnchors.right = controlPos.screenSpace.x;
	controlDotAnchors.top = controlPos.screenSpace.y;
	controlDotAnchors.bottom = controlPos.screenSpace.y;
}

function centerControlDot() {
	var current = new vec2(controlDotAnchors.left, controlDotAnchors.top);
	var target = controlPlateCenter;
	var distance = current.distance(target);

	if (distance > .005) {
		var next = vec2.lerp(current, target, .2);

		controlDotAnchors.left = next.x;
		controlDotAnchors.right = next.x;
		controlDotAnchors.top = next.y;
		controlDotAnchors.bottom = next.y;
	} else {
		centeringDot = false;
	}
	
}

function touchWithinSpriteAligner(touchPos, spriteAligner) {
	var screenPosInWorldSpace = screenPosToBindingPoint(touchPos)
		.scale(halfOrthographicSizeWithAspectRatio);

	var centerInWorldSpace = controlPlateCenter
		.scale(halfOrthographicSizeWithAspectRatio);

	var leftBound = (centerInWorldSpace.x + script.controlPlate.offsets.left);
	var rightBound = (centerInWorldSpace.x + script.controlPlate.offsets.right);
	var bottomBound = (centerInWorldSpace.y + script.controlPlate.offsets.bottom);
	var topBound = (centerInWorldSpace.y + script.controlPlate.offsets.top);
	
	return (
		screenPosInWorldSpace.x > leftBound
		&& screenPosInWorldSpace.x < rightBound
		&& screenPosInWorldSpace.y > bottomBound
		&& screenPosInWorldSpace.y < topBound
	);
}

function moveCameraWith(direction){
	var pos = cameraTransform.getWorldPosition()
	pos = pos.add(direction.uniformScale(moveSpeed));
	if (pos.distance(worldOrigin) > maxDistanceFromCenter){
		print("NavigationUIController: reach maximum navigation travel distance");
		return;
	}
	cameraTransform.setWorldPosition(pos);
}

function resetPosition(){
	var pos = script.debugViewAnchor.getTransform().getWorldPosition();
	cameraTransform.setWorldPosition(pos);
}

function setCameraMode(mode){
	//camera mode 0: look at target
	switch (mode) {
		case 0:
			setLookAtEnabled(true);
			setGyroEnabled(false);
			break;
		case 1:
			setLookAtEnabled(false);
			setGyroEnabled(true);
			break;
		case 2:
			setLookAtEnabled(false);
			setGyroEnabled(false);
			break;
	}
}

function setLookAtEnabled(status){
	var lookAtComponent = script.sceneCamera.getSceneObject().getFirstComponent("Component.LookAtComponent");
	lookAtComponent.enabled = status;
}

function setGyroEnabled(status){
	var deviceTracking = script.sceneCamera.getSceneObject().getFirstComponent("Component.DeviceTracking");
	deviceTracking.enabled = status;
}

function updateDistanceMarker() {
	var targetPos = script.distanceTarget.getTransform().getWorldPosition();

  // Check if visible
	var rotationZ = cameraTransform.getWorldRotation().toEulerAngles().z;
	var distanceMarkerVisible = !(rotationZ > Math.PI*0.9 && rotationZ < Math.PI*1.1);
	script.distanceSymbol.getSceneObject().enabled = distanceMarkerVisible;
	script.distanceText.getSceneObject().enabled = distanceMarkerVisible;

	// Set it's position
	var screenSpace = script.sceneCamera.project(targetPos);
	distanceSymbolAnchors.top = screenSpace.y;
	distanceSymbolAnchors.bottom = screenSpace.y;
	distanceSymbolAnchors.left = screenSpace.x;
	distanceSymbolAnchors.right = screenSpace.x;

	// Set the label
	var cameraPos = cameraTransform.getWorldPosition();

	// zero out the y to get flat distance
	cameraPos.y = 0;
	targetPos.y = 0;

	var distance = cameraPos.distance(targetPos) / 100; //in Meters
	script.distanceText.text = distance.toFixed(2) + "m";
}

// Bind our events
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var manipulatingEvent = script.createEvent("TouchStartEvent");
manipulatingEvent.bind(onTouchStart);

var manipulateMoveEvent = script.createEvent("TouchMoveEvent");
manipulateMoveEvent.bind(onTouchMove);

var manipulateEndEvent = script.createEvent("TouchEndEvent");
manipulateEndEvent.bind(onTouchEnd);