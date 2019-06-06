// MultipleMarkerController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Allows you to bind events to the status of multiple markers. 

// @input Component.MarkerTrackingComponent[] markerTrackingComponent
// @input float markerTimeout = 5.0;

var markerMissingTimeout;
var isTrackingCallbackCalled;
var hasInitialized;

function onTurnOn() {
	markerMissingTimeout = script.markerTimeout;

	script.api.isTracking = isTrackingCallbackCalled;
	script.api.getCurrentTracker = getCurrentTracker;

	isTrackingCallbackCalled = false;
	hasInitialized = true;
}

function onUpdate () {
	if(!hasInitialized) return;

	var atLeastOneMarkerFound = isAnyTrackerTracking();

	if (atLeastOneMarkerFound) {
		if (!isTrackingCallbackCalled) {
			if (script.api.onMarkerFound) {
				isTrackingCallbackCalled = true;
				script.api.onMarkerFound();
			}
		}
		markerMissingTimeout = script.markerTimeout;
	} else {
		markerMissingTimeout--;

		if (markerMissingTimeout <= 0 && isTrackingCallbackCalled) {

			if (script.api.onMarkerLost) {
				script.api.onMarkerLost();
				isTrackingCallbackCalled = false;
			}

		}
	}
}

function isAnyTrackerTracking() {
	var atLeastOneMarkerFound = false;

	for (var i = 0; i < script.markerTrackingComponent.length; i++) {
		var markerTrackingComponent = script.markerTrackingComponent[i];

		atLeastOneMarkerFound = atLeastOneMarkerFound || markerTrackingComponent.isTracking();
	}

	return atLeastOneMarkerFound;
}

function getCurrentTracker() {
	if (!isTrackingCallbackCalled) return false;

	for (var i = script.markerTrackingComponent.length - 1; i >= 0; i--) {
		var markerTrackingComponent = script.markerTrackingComponent[i];

		if (markerTrackingComponent.isTracking()){
			return markerTrackingComponent;
		}
	}
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);