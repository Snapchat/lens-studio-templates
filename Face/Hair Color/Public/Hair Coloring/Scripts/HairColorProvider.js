//@input Component.Camera camDetector1
//@input Asset.Material matDetect1 {"hint":"material for first pass"}
//@input Asset.Material matDetect2 {"hint":"material for second pass"}

var sceneObject = scene.createSceneObject("HeadBinding");
var head = sceneObject.createComponent("Head");
head.faceIndex = 0;
head.setAttachmentPointType(AttachmentPointType.CandideCenter);

var zero2 = new vec2(0,0);

var pass1 = script.matDetect1.mainPass;
var pass2 = script.matDetect2.mainPass;
pass2.firstRun = 1.0;
pass2.faceOffset = zero2;


var newTime = 0.0;
var frameCount = 0;

function update(eventData) {

    if (frameCount == 1) {
        pass2.firstRun = 0.0;
    }
    frameCount += 1;

    if (head.getFacesCount() > 0) {
        var t = Math.min(newTime, 1.0);
        pass2.mixSpeed = 1.0 - 0.9 * t * t;
        newTime += 2.0 * getDeltaTime();

        var projectedCenter = script.camDetector1.project(head.getTransform().getWorldPosition());
        var faceCenter = new vec2(projectedCenter.x, projectedCenter.y);
        if (script.prevCenter) {
            var offset = faceCenter.sub(script.prevCenter);
            pass2.faceOffset = offset;
        }
        script.prevCenter = faceCenter;
    } else {
        pass2.faceOffset = zero2;
        newTime = 0.0;
        pass2.mixSpeed = 1.0;
    }
}

script.createEvent("UpdateEvent").bind(update);
