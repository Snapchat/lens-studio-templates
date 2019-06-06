// SwitchModeController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls the debug control UI

//@input bool Advanced

    //@ui {"widget":"group_start","label":"References", "showIf": "Advanced"}
		//@input Component.ScriptComponent landmarkerController

		// @input SceneObject birdsEyeVisual
		// @input SceneObject fullSizeVisual

//@ui {"widget":"group_end"}

script.api.setToggleVisual = setToggleVisual;

// Events
function onTouchStart(eventData) {
	var touchPos = eventData.getTouchPosition();

	if (
		script.landmarkerController
		&& script.landmarkerController.api.toggleMarkerMode
	) {
		var currentMode = script.landmarkerController.api.toggleMarkerMode();
		setToggleVisual(currentMode);
	}
}

// Helpers
function setToggleVisual(currentMode) {
	var birdsEyeEnabled = currentMode === "BirdsEye";
	script.birdsEyeVisual.enabled = birdsEyeEnabled;
	script.fullSizeVisual.enabled = !birdsEyeEnabled;
}

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(onTouchStart);
