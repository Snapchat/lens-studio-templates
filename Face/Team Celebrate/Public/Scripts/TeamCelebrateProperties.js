// TeamCelebrateProperties.js
// Version: 0.0.1
// Event: Initialized
// Description: Holds references to various properties that drive the team
// celebrate template. Users of the template should not have to modify this.

//@ui {"widget":"group_start", "label":"Materials [DO NOT EDIT]"}
//@input SceneObject confetti
//@input SceneObject tertiaryConfetti
//@input Asset.Material confettiPrimaryMaterial
//@input Asset.Material confettiSecondaryMaterial
//@input Asset.Material confettiTertiaryMaterial
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Face Paint [DO NOT EDIT]"}
//@input SceneObject[] facePaintTypes
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Face Logo [DO NOT EDIT]"}
//@input SceneObject[] faceLogoTypes
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Screen Logo [DO NOT EDIT]"}
//@input Component.Image screenLogo
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Screen Banner [DO NOT EDIT]"}
//@input Component.Image screenBanner
//@ui {"widget":"group_end"}


script.api.confetti = script.confetti;
script.api.tertiaryConfetti = script.tertiaryConfetti;
script.api.confettiPrimaryMaterial = script.confettiPrimaryMaterial;
script.api.confettiSecondaryMaterial = script.confettiSecondaryMaterial;
script.api.confettiTertiaryMaterial = script.confettiTertiaryMaterial;

script.api.facePaintTypes = script.facePaintTypes;

script.api.faceLogoTypes = script.faceLogoTypes;

script.api.screenLogo = script.screenLogo;

script.api.screenBanner = script.screenBanner;