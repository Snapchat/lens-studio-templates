// @input SceneObject target

// @ui {"widget":"separator"}
// @input bool positionEasing
// @input float positionEasingSpeed = 10.0 {"label":"Pos. Easing Speed", "showIf":"positionEasing"}

// @ui {"widget":"separator"}
// @input bool rotationEasing
// @input float rotationEasingSpeed = 10.0 {"label":"Rot. Easing Speed", "showIf":"rotationEasing"}

// @ui {"widget":"separator"}
// @input bool startAtTarget

const selfTransform = script.getTransform();

var targetTransform;
var positionEasingSpeed = script.positionEasingSpeed;
var rotationEasingSpeed = script.rotationEasingSpeed;

setTargetObject(script.target);

if (script.startAtTarget && targetTransform) {
    if (script.positionEasing) {
        easeTowardsTargetPosition(1.0);
    }
    if (script.rotationEasing) {
        easeTowardsTargetRotation(1.0);
    }
}

script.createEvent("UpdateEvent").bind(function(data) {
    if (!global.isNull(targetTransform)) {
        var delta = global.getDeltaTime();
        if (script.positionEasing) {
            var positionT = Math.min(delta * positionEasingSpeed, 1.0);
            easeTowardsTargetPosition(positionT);
        }
        if (script.rotationEasing) {
            var rotationT = Math.min(delta * rotationEasingSpeed, 1.0);
            easeTowardsTargetRotation(rotationT);
        }
    }
});

function easeTowardsTargetPosition(t) {
    var currentPos = selfTransform.getWorldPosition();
    var targetPos = targetTransform.getWorldPosition();

    selfTransform.setWorldPosition(vec3.lerp(currentPos, targetPos, t));
}

function easeTowardsTargetRotation(t) {
    var currentRot = selfTransform.getWorldRotation();
    var targetRot = targetTransform.getWorldRotation();

    selfTransform.setWorldRotation(quat.slerp(currentRot, targetRot, t));
}

function setTargetObject(sceneObject) {
    if (global.isNull(sceneObject)) {
        targetTransform = null;
    } else {
        targetTransform = sceneObject.getTransform();
    }
}

script.api.setTargetObject = setTargetObject;