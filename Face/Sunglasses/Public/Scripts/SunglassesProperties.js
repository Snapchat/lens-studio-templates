// SunglassesProperties.js
// Version: 0.0.1
// Event: Initialized
// Description: Holds references to various properties that drive the sunglasses
// template. Users of the template should not have to modify this.

// @ui {"widget":"group_start", "label":"Frames"}
// @input SceneObject sunglassesObject
// @input Asset.Material frameMaterial
// @input SceneObject[] frames
// @input Asset.Texture[] frameParams
// @input Asset.Texture[] frameNormals
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Lenses"}
// @input Asset.Material lensMaterial
// @input Asset.Material lensMaterialCustom
// @input Asset.Texture[] reflectionTextures
// @input Component.MeshVisual[] lensMeshes
// @input Asset.Texture blackTexture
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Environment"}
// @input Component.LightSource envMap
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"MultipleHeads"}
// @input SceneObject headBinding
// @input SceneObject faceRetouch
// @ui {"widget":"group_end"}


script.api.sunglassesObject = script.sunglassesObject;
script.api.frames = script.frames;
script.api.frameParams = script.frameParams;
script.api.frameNormals = script.frameNormals;
script.api.frameMaterial = script.frameMaterial;

script.api.lensMaterial = script.lensMaterial;
script.api.lensMaterialCustom = script.lensMaterialCustom;
script.api.reflectionTextures = script.reflectionTextures;
script.api.lensMeshes = script.lensMeshes;
script.api.blackTexture = script.blackTexture;

script.api.envMap = script.envMap;

script.api.headBinding = script.headBinding;
script.api.faceRetouch = script.faceRetouch;
