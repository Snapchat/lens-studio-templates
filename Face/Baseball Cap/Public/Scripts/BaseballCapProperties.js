//@ui {"widget":"group_start", "label":"Materials [DO NOT EDIT]"}
//@input Asset.Material logoMaterial
//@input Asset.Material capMaterialPrimary
//@input Asset.Material capMaterialSecondary
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Blendshapes [DO NOT EDIT]"}
//@input Component.BlendShapes[] blendshapes
//@input string[] blendshapeNames
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Objects [DO NOT EDIT]"}
//@input SceneObject hatTransform
//@input Component.FaceMaskVisual facePaintPrimary
//@input Component.FaceMaskVisual facePaintSecondary
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"FacePaint Textures [DO NOT EDIT]"}
//@input Asset.Texture facePaintEyelines01
//@input Asset.Texture facePaintEyelines02
//@input Asset.Texture facePaintEyeMask01
//@input Asset.Texture facePaintEyeMask02
//@input Asset.Texture facePaintKitty01
//@input Asset.Texture facePaintKitty02
//@input Asset.Texture facePaintSwirl01
//@input Asset.Texture facePaintSwirl02
//@ui {"widget":"group_end"}

script.api.logoMaterial = script.logoMaterial;
script.api.capMaterialPrimary = script.capMaterialPrimary;
script.api.capMaterialSecondary = script.capMaterialSecondary;
script.api.blendshapes = script.blendshapes;
script.api.blendshapeNames = script.blendshapeNames;
script.api.hatTransform = script.hatTransform;
script.api.facePaintPrimary = script.facePaintPrimary;
script.api.facePaintSecondary = script.facePaintSecondary;

script.api.facePaintEyelines01 = script.facePaintEyelines01;
script.api.facePaintEyelines02 = script.facePaintEyelines02;
script.api.facePaintEyeMask01 = script.facePaintEyeMask01;
script.api.facePaintEyeMask02 = script.facePaintEyeMask02;
script.api.facePaintKitty01 = script.facePaintKitty01;
script.api.facePaintKitty02 = script.facePaintKitty02;
script.api.facePaintSwirl01 = script.facePaintSwirl01;
script.api.facePaintSwirl02 = script.facePaintSwirl02;