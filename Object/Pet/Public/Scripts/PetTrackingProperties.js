// -----JS CODE-----
// ObjectTrackingProperties.js
// Version: 0.0.1
// Event: Initialized
// Description: Holds references to various properties that drive the pet
// template. Users of the template should not have to modify this.

// @input bool advanced = false
// @input Component.ObjectTracking rightEyeTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftEyeTracker {"showIf": "advanced"}
// @input Component.ObjectTracking centerTracker {"showIf": "advanced"}
// @input Component.ObjectTracking noseTracker {"showIf": "advanced"}

script.api.rightEyeTracker = script.rightEyeTracker;
script.api.leftEyeTracker = script.leftEyeTracker;
script.api.centerTracker = script.centerTracker;
script.api.noseTracker = script.noseTracker;
