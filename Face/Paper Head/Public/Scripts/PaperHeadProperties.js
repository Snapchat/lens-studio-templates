// -----JS CODE-----
// Version: 0.0.1
// Event: Initialized
// Description: Holds references to various properties that drive the paper head
// template. Users of the template should not have to modify this.

// @ui {"widget":"group_start", "label":"Left Eye"}
// @input Component.Image leftEyeTrackerTop {"label":"Top Tracker"}
// @input Component.Image leftEyeTrackerBottom {"label":"Bottom Tracker"}
// @input Component.Image leftEyeImage {"label":"Image"}
// @input Component.Head leftEyeBinding {"label":"binding"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Right Eye"}
// @input Component.Image rightEyeTrackerTop {"label":"Top Tracker"}
// @input Component.Image rightEyeTrackerBottom {"label":"Bottom Tracker"}
// @input Component.Image rightEyeImage {"label":"Image"}
// @input Component.Head rightEyeBinding {"label":"binding"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Nose"}
// @input Component.Image noseImage {"label":"Image"}
// @input Component.Head noseBinding {"label":"binding"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Mouth"}
// @input Component.Image mouthTrackerTop {"label":"Top Tracker"}
// @input Component.Image mouthTrackerBottom {"label":"Bottom Tracker"}
// @input Component.Image mouthImage {"label":"Image"}
// @input Component.Image slidingMouthImage {"label":"Slide Image"}
// @input Component.Head mouthBinding {"label":"binding"}
// @input Component.Head slidingMouthBinding {"label":"Slide binding"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Head"}
// @input SceneObject headCenter {"label":"Head Center"}
// @input Component.Image headImage {"label":"Image"}
// @ui {"widget":"group_end"}


script.api.leftEyeTrackerTop = script.leftEyeTrackerTop;
script.api.leftEyeTrackerBottom = script.leftEyeTrackerBottom;
script.api.leftEyeImage = script.leftEyeImage;
script.api.leftEyeBinding = script.leftEyeBinding;

script.api.rightEyeTrackerTop = script.rightEyeTrackerTop;
script.api.rightEyeTrackerBottom = script.rightEyeTrackerBottom;
script.api.rightEyeImage = script.rightEyeImage;
script.api.rightEyeBinding = script.rightEyeBinding;

script.api.noseImage = script.noseImage;
script.api.noseBinding = script.noseBinding;

script.api.mouthTrackerTop = script.mouthTrackerTop;
script.api.mouthTrackerBottom = script.mouthTrackerBottom;
script.api.mouthImage = script.mouthImage;
script.api.slidingMouthImage = script.slidingMouthImage;
script.api.mouthBinding = script.mouthBinding;
script.api.slidingMouthBinding = script.slidingMouthBinding;

script.api.headCenter = script.headCenter;
script.api.headImage = script.headImage;