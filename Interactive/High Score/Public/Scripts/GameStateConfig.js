// @input string stateName
// @input float timeSpeed
// @input float timeAccel
// @input SceneObject cameraPos

// @input SceneObject[] enabledObjects
// @input SceneObject[] clearChildren {"label":"Clear Children of..."}

// @ui {"label":"Sound Settings"}
// @input Asset.AudioTrackAsset ambientSound
// @input bool soundLooping = false

script.api.stateSettings = {
    stateName: script.stateName,
    timeSpeed: script.timeSpeed,
    timeAccel: script.timeAccel,
    cameraPos: script.cameraPos,
    enabledObjects: script.enabledObjects,
    clearChildren: script.clearChildren,

    ambientSound: script.ambientSound,
    soundLooping: script.soundLooping,
};