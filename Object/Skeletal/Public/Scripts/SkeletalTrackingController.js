// -----JS CODE-----
// SkeletalTrackingController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that control the skeletal tracking behavior.

// @input string trackingType {"widget":"combobox", "values":[{"label":"Smooth", "value":"Smooth"}, {"label":"Precise", "value":"Precise"}]}
// @input float smoothMultiplier {"label":"Smoothness","widget":"slider", "min":0.1, "max":1.0, "step":0.1, "showIf": "trackingType", "showIfValue": "Smooth"}

// @input bool advanced = false
// @input Component.ObjectTracking headTracker {"showIf": "advanced"}
// @input Component.ObjectTracking neckTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightElbowTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightHandTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftElbowTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftHandTracker {"showIf": "advanced"}


var initialized = false;
var delayedInitialized = false;
var isObjectTracking = false;

var trackingItems = [];
var originalsTracker = [];

var trackingCount = 0;

var HEAD_ID = "Head";
var NECK_ID = "Neck";
var LEFT_SHOULDER_ID = "LeftShoulder";
var LEFT_ELBOW_ID = "LeftElbow";
var LEFT_HAND_ID = "LeftHand";
var RIGHT_SHOULDER_ID = "RightShoulder";
var RIGHT_ELBOW_ID = "RightElbow";
var RIGHT_HAND_ID = "RightHand";

var LOW_FPS_THRESHOLD = 1 / 27.0;
var MAX_TIME_SAMPLES = 1;

var avgFrameTime = 0;
var lastDeltaTimes = [];

var smoothRatio = calculateSmoothRatio(script.smoothMultiplier);

script.api.skeletalStatus = skeletalStatus;

function onLensTurnOn() {
    configureTrackingCallback();
    configureTrackers();
}

function onUpdate(eventData) {
    lastDeltaTimes.push(eventData.getDeltaTime());

    while (lastDeltaTimes.length > MAX_TIME_SAMPLES) {
        lastDeltaTimes.shift();
        delayedInitialized = true;
    }
    avgFrameTime = 0;

    for (var i = 0; i < lastDeltaTimes.length; i++) {
        avgFrameTime += lastDeltaTimes[i];
    }
    avgFrameTime /= lastDeltaTimes.length;

    if (initialized) {
        for (var i = 0; i < trackingItems.length; i++) {
            updateTrackedItem(trackingItems[i]);
        }

        if (script.trackingType == "Smooth") {
            for (var i = 0; i < trackingItems.length; i++) {
                smoothFollow(trackingItems[i]);
            }
        }
    }
}

function smoothFollow(trackerItems) {
    var desiredCenter = trackerItems.original.anchors.getCenter();
    var desiredSize = trackerItems.original.anchors.getSize();

    var currentCenter = trackerItems.smoothObject.anchors.getCenter();
    var currentSize = trackerItems.smoothObject.anchors.getSize();

    var smoothing = getDeltaTime() * 0.9;

    var t = Math.min(smoothing * smoothRatio, 1.0);
    var sizeT = Math.min(smoothing * (smoothRatio + 5), 0.9);

    // Calculate the next position
    var newCenter = vec2.lerp(currentCenter, desiredCenter, t);
    var newSize = vec2.lerp(currentSize, desiredSize, sizeT);

    // Apply next position
    trackerItems.smoothObject.anchors.setCenter(newCenter);
    trackerItems.smoothObject.anchors.setSize(newSize);
}

function updateTrackedItem(trackerItem) {
    var lastEnabled = trackerItem.tracker.isStable;
    trackerItem.tracker.isStable = trackerItem.isTracking();

    if (lastEnabled != trackerItem.tracker.isStable) {
        if (lastEnabled) {
            onTrackingLost();
        }
        else {
            onTrackingFound();
        }
    }

    for (var i = 0; i < trackerItem.image.length; i++) {
        if (!isNull(trackerItem.image[i])) {
            trackerItem.image[i].enabled = trackerItem.tracker.isStable;
        }
    }
}

function configureTracker(shouldTrack, tracker) {
    if (shouldTrack) {
        tracker.isStable = false;
    }
}

function onTrackingFound() {
    trackingCount++;
    if (trackingCount >= 1) {
        isObjectTracking = true;
    }
}

function onTrackingLost() {
    trackingCount--;
    if (trackingCount < 1) {
        isObjectTracking = false;
    }
}

function configureTrackingCallback() {
    configureTracker(script.headTracker.enabled, script.headTracker);
    configureTracker(script.neckTracker.enabled, script.neckTracker);

    configureTracker(script.rightHandTracker.enabled, script.rightHandTracker);
    configureTracker(script.rightElbowTracker.enabled, script.rightElbowTracker);
    configureTracker(script.rightShoulderTracker.enabled, script.rightShoulderTracker);

    configureTracker(script.leftHandTracker.enabled, script.leftHandTracker);
    configureTracker(script.leftElbowTracker.enabled, script.leftElbowTracker);
    configureTracker(script.leftShoulderTracker.enabled, script.leftShoulderTracker);
}

function configureTrackers() {
    addToOriginalTracker(
        {
            id: HEAD_ID,
            trackerObject: script.headTracker,
        }
    );

    addToOriginalTracker(
        {
            id: NECK_ID,
            trackerObject: script.neckTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_HAND_ID,
            trackerObject: script.rightHandTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_ELBOW_ID,
            trackerObject: script.rightElbowTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_SHOULDER_ID,
            trackerObject: script.rightShoulderTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_HAND_ID,
            trackerObject: script.leftHandTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_ELBOW_ID,
            trackerObject: script.leftElbowTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_SHOULDER_ID,
            trackerObject: script.leftShoulderTracker,
        }
    );

    var useSmoothing = (script.trackingType == "Smooth");
    for (var i = 0; i < originalsTracker.length; i++) {
        var config = initObjectConfig(originalsTracker[i], useSmoothing);
        trackingItems.push(config);
        config.id = originalsTracker[i].id;
    }

    initialized = true;
}

function addToOriginalTracker(option) {
    originalsTracker.push(option);
}

function initObjectConfig(data, useSmoothing) {
    var tracker = data.trackerObject;
    var originalScreenTransform = tracker.getSceneObject().getFirstComponent("Component.ScreenTransform");
    var smoothObject = originalScreenTransform;

    var trackerSceneObject = tracker.getSceneObject();
    var childImages = [];
    var childCount = trackerSceneObject.getChildrenCount();
    for (var i = 0; i < childCount; i++) {
        childImages[i] = trackerSceneObject.getChild(i);
    }

    if (useSmoothing) {
        var newObject = global.scene.createSceneObject("SmoothFollower");
        newObject.setParent(script.getSceneObject());
        var targetScreenTransform = newObject.createComponent("Component.ScreenTransform");

        for (var i = 0; i < childImages.length; i++) {
            childImages[i].setParent(newObject);
        }
        targetScreenTransform.scale = originalScreenTransform.scale;
        smoothObject = targetScreenTransform;
    }

    var config =
    {
        original: originalScreenTransform,
        smoothObject: smoothObject,
        tracker: tracker,
        image: childImages,
        isTracking: function () { return tracker.isTracking() },
    };

    return config;
}

function calculateSmoothRatio(multiplier) {
    // convert the smoothingMultiplier to be a number between 15 to 20 which are the best values for smooth tracking.
    var invertSmoothMultiplier = Math.abs(multiplier - 1);
    var ratio = (invertSmoothMultiplier - (-3.0)) / ((-2.8) - (-3.0));
    return Math.max(15, Math.min(ratio, 20));
}

function skeletalStatus() {
    var status =
    {
        isObjectTracking: isObjectTracking,
        fpsStatus: avgFrameTime > LOW_FPS_THRESHOLD,
        isDelayedInitialized: delayedInitialized
    };

    return status;
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);