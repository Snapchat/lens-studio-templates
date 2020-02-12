// -----JS CODE-----
// PlayStop3DAnimation.js
// Version: 0.0.1
// Event: Initialized
// Description: Plays or stops a 3D animation on a spawner event

//@input string eventType = "onSpawned" {"label" : "Event", "widget" : "combobox", "values" : [{"label" : "On Spawn", "value" : "onSpawned"}, {"label" : "On Collided", "value" : "onCollided"},  {"label" : "On Recycled", "value" : "onRecycled"}]}

//@input Component.AnimationMixer animMixer 

//@input int actionType = 0 {"label" : "Action", "widget" : "combobox", "values" : [{"label" : "Start", "value" : "0"}, {"label" : "Stop", "value" : "1"}]}
//@input string animName 
//@input int loops = 1 { "showIf" : "actionType", "showIfValue" : "0"}
//@input bool onComplete { "showIf" : "actionType", "showIfValue" : "0"}
//@input string onCompleteAnimName { "showIf" : "actionType", "showIfValue" : "0"}
//@input int loops1 {"label": "Loops",  "showIf" : "actionType", "showIfValue" : "0"}

var initialized = checkInitialized();

function checkInitialized() {
    if (script.animMixer) {
        script.animMixer.autoPlay = false;
        script.layers = script.animMixer.getLayers();
        setWeights("");
        return true;
    } else {
        print("[PlayStop3DAnimation], Error, Please set animation mixer");
        return false;
    }
}

if (initialized) {
    script.api[script.eventType] = function () {
        switch (script.actionType) {
            case (0):
                setWeights(script.animName);
                if (!script.onComplete) {
                    script.animMixer.start(script.animName, 0.0, script.loops);
                }
                else {
                    script.animMixer.startWithCallback(script.animName, 0.0, script.loops, function () {
                        setWeights(script.onCompleteAnimName);
                        script.animMixer.start(script.onCompleteAnimName, 0.0, script.loops1);
                    });
                }
                break;
            case (1):
                setWeights(script.animName);
                script.animMixer.start(script.animName, 0.0, 1.0);
                script.animMixer.pause(script.animName);
                break;
        }
    }
}

function setWeights(name) {
    for (i in script.layers) {
        var weight = script.layers[i].name == name ? 1.0 : 0.0;
        script.layers[i].weight = weight;
    }
}
