// SpectaclesTimeLoopHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: This script manages what helper scripts should do when time loops in Lenses for Spectacles.

//@ui {"widget":"label", "label":"On Spectacles Time Loop"}
//@ui {"widget":"separator"}
//@ui {"widget":"group_start", "label":"Tween Manager"}
//@input bool  tweenReset = true {"label":"Reset Tweens"}
//@input bool  tweenPlayAutomatic = true {"label":"Play Automatic", "showIf": "tweenReset"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}
//@ui {"widget":"group_start", "label":"Behavior"}
//@input bool behaviorReinit = true {"label":"Reinitialize"}
//@input bool behaviorCallTurnOn = true {"label":"Trigger Turn On Event"}
//@ui {"widget":"group_end"}

var prevTime = getTime();

function checkTime() {
    var curTime = getTime();
    if (prevTime > curTime) {
        onLoop();
    }
    prevTime = curTime;
}

function onLoop() {
    if (global.behaviorSystem) {
        if (script. behaviorReinit) {
            global.behaviorSystem.sendCustomTrigger("_reinitialize_all_behaviors");
        }
        if (script.behaviorCallTurnOn) {
            global.behaviorSystem.sendCustomTrigger("_trigger_all_turn_on_behaviors");
        }
    }

    if (global.tweenManager) {
        if (script.tweenReset) {
            global.tweenManager.resetTweens();
            
            if (script.tweenPlayAutomatic) {
                global.tweenManager.restartAutoTweens();
            }
        }
    }
}

script.createEvent("UpdateEvent").bind(checkTime);
