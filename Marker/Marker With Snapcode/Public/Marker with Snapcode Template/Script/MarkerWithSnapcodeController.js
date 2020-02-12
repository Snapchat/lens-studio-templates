// MarkerWithSnapcodeController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Plays Cross and Fade Animation, calls function when marker is lost or found. 

// @input bool enableSmoothing = true

//@ui {"widget":"separator"}
// @input bool advanced = false
// @input float smoothingAmount = 0.65 {"showIf":"advanced", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input Component.ScriptComponent multipleTrackerController {"showIf":"advanced"}
// @input Component.ScriptComponent crossHintScript {"showIf": "advanced"}
// @input Component.ScriptComponent fadeEffectScript {"showIf": "advanced"}
// @input Component.ScriptComponent hintControllerScript {"showIf": "advanced"}

var isMarkerTracking;
var crossHintScript;
var disableNextFrame;
var smoothingSlerpFactor;
var markerHasBeenTracking;

function onTurnOn() {
	if (script.multipleTrackerController) {
		script.multipleTrackerController.api.onMarkerFound = wrapFunction(script.multipleTrackerController.api.onMarkerFound, onMarkerFound);
		script.multipleTrackerController.api.onMarkerLost = wrapFunction(script.multipleTrackerController.api.onMarkerLost, onMarkerLost);		
	} else {
		print("MarkerWithSnapcodeController: Please assign multipleTrackerController.");
	}

	if (script.fadeEffectScript && script.fadeEffectScript.api.resetFadeEffect) {
		script.fadeEffectScript.api.resetFadeEffect();
	}

	setChildrenEnabled(false);

	smoothingSlerpFactor = 1 - script.smoothingAmount;
	markerHasBeenTracking = false;
}

function onLateUpdate() {
	if (isMarkerTracking) {

		if (script.multipleTrackerController && script.multipleTrackerController.api.getCurrentTracker) {
			
			var markerComponent = script.multipleTrackerController.api.getCurrentTracker();

			if (markerComponent) {
				var referenceObject = markerComponent.getSceneObject().getChild(0);
				copyTransformToSelf(referenceObject, markerHasBeenTracking);

				markerHasBeenTracking = true;
			}

		} else {
			print("MarkerWithSnapcodeController: Please assign multipleTrackerController.");
		}

	}

	if (disableNextFrame) {

		if (global.onSceneDisabled) {
			global.onSceneDisabled();
		}

		setChildrenEnabled(false);

		disableNextFrame = false;
		markerHasBeenTracking = false;
	}
}

function onMarkerFound() {
	isMarkerTracking = true;

	setChildrenEnabled(true);

	if (script.hintControllerScript && script.hintControllerScript.api.hide) {
		script.hintControllerScript.api.hide();
	}

	if (script.crossHintScript && script.crossHintScript.api.startCrossAnimation) {
		script.crossHintScript.api.startCrossAnimation();
	}

	if (script.fadeEffectScript && script.fadeEffectScript.api.startFade) {
		script.fadeEffectScript.api.startFade();
	}

	if (global.onSceneEnabled) {
		global.onSceneEnabled();
	}
}

function onMarkerLost() {
	isMarkerTracking = false;

	if (script.hintControllerScript && script.hintControllerScript.api.show) {
		script.hintControllerScript.api.show();
	}
	
	if (global.onSceneWillDisable) {
		global.onSceneWillDisable();
	}

	disableNextFrame = true;
}

function copyTransformToSelf(o, shouldSmooth) {
	var sourceT = o.getTransform();
	var targetT = script.getTransform();

	var nextPos = sourceT.getWorldPosition();
	var nextRot = sourceT.getWorldRotation();
	var nextScale = sourceT.getWorldScale();

	if (script.enableSmoothing && shouldSmooth) {
		var currentRot = targetT.getWorldRotation();
		nextRot = quat.slerp(currentRot, nextRot, smoothingSlerpFactor);
	}

	targetT.setWorldPosition(nextPos);
	targetT.setWorldRotation(nextRot);
	targetT.setWorldScale(nextScale);
}

function setChildrenEnabled (enabled) {
	for (var i = 0; i < script.getSceneObject().getChildrenCount(); i++) {
		script.getSceneObject().getChild(i).enabled = enabled;
	}
}

function wrapFunction(origFunc, newFunc) 
{
    if (!origFunc)
    {
        return newFunc;
    }
    return function() 
    {
        origFunc();
        newFunc();
    };
}

onTurnOn();

var lateUpdateEvent = script.createEvent("LateUpdateEvent");
lateUpdateEvent.bind(onLateUpdate);