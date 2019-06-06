// LandmarkerController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: The main script that controls the Landmarker Template

// @input int liveBuildingMode = 0 {"label": "Building Mode", "widget":"combobox", "values":[{"label":"Occluder", "value": 0}, {"label":"Semi-transparent", "value":2}, {"label":"Custom Textures", "value":3}, {"label":"None", "value":4}]}
// @input Asset.Texture[] textures {"showIf":"liveBuildingMode", "showIfValue":"3"}

//@ui {"widget":"separator"}
//@ui {"widget":"group_start","label":"Debug Settings"}
    //@input int debugBuildingMode = 1 {"label": "Building Mode", "widget":"combobox", "values":[{"label":"Occluder", "value": 0}, {"label":"Reference", "value":1}, {"label":"Semi-transparent", "value":2}, {"label":"Custom Textures", "value":3}]}
    //@input int defaultDebugMode = 1 {"widget":"combobox", "values":[{"label":"Birds Eye", "value": 0}, {"label":"Full Size", "value":1}]}
    //@input int cameraMode = 1 {"label" : "Camera Mode", "widget":"combobox", "values":[{"label":"Look At Distance Target", "value": 0}, {"label":"Gyro", "value": 1}]}
//@ui {"widget":"group_end"}


//@ui {"widget":"separator"}
//@input bool Advanced
    //@ui {"widget":"group_start","label":"References", "showIf": "Advanced"}

    //@ui {"widget":"group_start","label":"SceneObjects"}
        //@input SceneObject landmarkerScene

        //@input SceneObject debugParent
        //@input SceneObject birdsEyeParent
        //@input SceneObject fullSizeParent

        //@input SceneObject toggleUI
        //@input SceneObject navigationUI

        //@input SceneObject segmentationImage

        //@input SceneObject[] buildingProxy

    //@ui {"widget":"group_end"}

    //@ui {"widget":"separator"}

    //@ui {"widget":"group_start","label":"MarkerTrackingComponent"}
        //@input Component.DeviceLocationTrackingComponent locationTracking
        //@input Component.MarkerTrackingComponent imageMarker
        //@input Asset.MarkerAsset imageMarkerAsset
    //@ui {"widget":"group_end"}

    //@ui {"widget":"separator"}

    //@input Component.Script hintController
    //@input Component.Script moveController
    //@input Component.Script switchUIController

    //@ui {"widget":"separator"}
        //@input Asset.Material occluderMaterial
        //@input Asset.Material debugMaterial

//@ui {"widget":"group_end"}

//settings
var Mode = {
    Landmarker: "Landmarker",
    BirdsEye: "BirdsEye",
    FullSize: "FullSize"
}

// Define the content of each mode
var modeConfigs = {
    "BirdsEye": {
        "enabled": [
            script.landmarkerScene,
            script.toggleUI,
        ],
        "disabled": [
            script.debugParent,
            script.navigationUI,
        ],
        "parent": script.birdsEyeParent,
        callback: function() {
            script.hintController.api.hide();
            script.moveController.api.setCameraMode(2);
        },
        "isDebug": true,
    },
    "FullSize": {
        "enabled": [
            script.landmarkerScene,
            script.toggleUI,
            script.debugParent,
            script.navigationUI,
        ],
        "disabled": [
        ],
        "parent": script.fullSizeParent,
        callback: function() {
            script.hintController.api.hide();
            script.moveController.api.resetPosition();
            script.moveController.api.setCameraMode(script.cameraMode);
        },
        "isDebug": true,
    },
    "Landmarker": {
        "enabled": [
            script.landmarkerScene,
        ],
        "disabled": [
            script.navigationUI,
            script.toggleUI,
            script.debugParent,
        ],
        "parent": script.getSceneObject(),
        callback: function() {
            script.hintController.api.hide();
            script.moveController.api.setCameraMode(2);
        },
        "isDebug": false,
    }
}

// Expose API
script.api.toggleMarkerMode = toggleMarkerMode;
script.api.getMarkerMode = getMarkerMode;
script.api.locationDataDownloaded = false;

// States
var trackingMode = Mode.Landmarker;
var markerMode = script.defaultDebugMode ?  Mode.FullSize : Mode.BirdsEye;
var debugModeUnlocked = false;
var referenceMaterials = {};
var referenceTextures = [];

// Bindings
script.locationTracking.onLocationDataDownloaded = function() {
    script.api.locationDataDownloaded = true;
    script.imageMarker.marker = script.imageMarkerAsset;
    print("LandmarkerController: Location data was downloaded!"); 
};

script.locationTracking.onLocationDataDownloadFailed = function() {
    script.api.locationDataDownloaded = false;
    print("LandmarkerController: Could not download location data :("); 
};

script.locationTracking.onLocationFound = function() {
    switchModeTo(Mode.Landmarker);
};

script.locationTracking.onLocationLost = onTrackingLost;

script.imageMarker.onMarkerFound = function(){
    print("LandmarkerController: on marker found");
    if (!debugModeUnlocked){
        switchModeTo(markerMode);
        script.switchUIController.api.setToggleVisual(markerMode);
        debugModeUnlocked = true;
    }
}

function onTurnOn() {
    script.landmarkerScene.enabled = false;
    script.debugParent.enabled = false;
    script.navigationUI.enabled = false;
    script.toggleUI.enabled = false;
    for (var i = 0; i < script.buildingProxy.length; i++) {
        var o = script.buildingProxy[i];
        var mv = o.getFirstComponent("Component.MeshVisual");

        referenceMaterials[o.name] = mv.mainMaterial;
        referenceTextures.push(mv.mainPass.baseTex);
    }
}

function onCameraBackEvent() {
    script.segmentationImage.enabled = false;
}

function onCameraFrontEvent() {
    script.segmentationImage.enabled = true;
}

function onTrackingLost() {
    script.hintController.api.show();
    script.landmarkerScene.enabled = false;
}

function switchModeTo(mode) {
    trackingMode = mode;

    var config = modeConfigs[trackingMode]

    // Swap material based on user option
    var buildingMode = config.isDebug ? script.debugBuildingMode : script.liveBuildingMode;
    swapMaterial(buildingMode);

    // Enable objects
    for (var i = 0; i < config.enabled.length; i++) {
        var o = config.enabled[i];
        o.enabled = true;
    }

    // Disable objects
    for (var j = 0; j < config.disabled.length; j++) {
        var o = config.disabled[j];
        o.enabled = false;
    }

    script.landmarkerScene.setParent( config.parent );

    config.callback();

    print("LandmarkerController: Switched to: " + trackingMode + " mode");
}

function updateActionHint(){    
    if (script.locationTracking.locationProximityStatus == LocationProximityStatus.WithinRange){
        script.hintController.api.changeToPointAtHint();
    } else{
        script.hintController.api.changeToGoToHint();
    }
}

// Helper
function getMarkerMode() {
    if (trackingMode != Mode.Landmarker) {
        return markerMode;
    }
}

function toggleMarkerMode(){
    markerMode = markerMode == Mode.FullSize ? Mode.BirdsEye : Mode.FullSize;
    switchModeTo(markerMode);
    return markerMode;
}

function swapMaterial(option) {
    var mat;
    var color;
    var useReferenceMaterial;
    var textures;

    switch(option) {
        case 0:
            mat = script.occluderMaterial;
            break;
        case 1: 
            useReferenceMaterial = true;
            textures = referenceTextures;
            color = new vec4(1, 1, 1, 1);
            break;
        case 2: 
            mat = script.debugMaterial
            color = new vec4(1, .3, .3, .5);
            break;
        case 3: 
            useReferenceMaterial = true;
            textures = script.textures
            color = new vec4(1,1,1,1);
            break;
        case 4: 
            mat = script.debugMaterial
            color = new vec4(0,0,0,0);
            break;
        default: 
            mat = script.debugMaterial
            color = new vec4(1, 1, 1, 1);
            break;
    }

    for (var i = 0; i < script.buildingProxy.length; i++) {
        var o = script.buildingProxy[i];
        var mv = o.getFirstComponent("Component.MeshVisual");

        if (useReferenceMaterial) {
            mat = referenceMaterials[o.name];
        }

        if (textures && textures[i]) {
            mat.mainPass.baseTex = textures[i];
        }

        if (color) {
            mat.mainPass.baseColor = color;
        }

        mv.mainMaterial = mat;
    }
}

// Bind

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(updateActionHint);

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onTurnOn);

var cameraBackEvent = script.createEvent("CameraBackEvent");
cameraBackEvent.bind(onCameraBackEvent);

var cameraFrontEvent = script.createEvent("CameraFrontEvent");
cameraFrontEvent.bind(onCameraFrontEvent);