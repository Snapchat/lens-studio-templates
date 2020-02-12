// -----JS CODE-----
// TriggerBehaviorScript.js
// Version: 0.0.1
// Event: Initialized
// Description: Description: Calls the trigger function on BehaviorScripts on a spawner event

//@input string eventType = "onSpawned" {"label" : "Event", "widget" : "combobox", "values" : [{"label" : "On Spawn", "value" : "onSpawned"}, {"label" : "On Collided", "value" : "onCollided"},  {"label" : "On Recycled", "value" : "onRecycled"}]}
//@input Component.ScriptComponent[] behaviorScripts

script.api[script.eventType] = function () {
    for (var i in script.behaviorScripts) {
        if (script.behaviorScripts[i] && script.behaviorScripts[i].api.trigger) {
            script.behaviorScripts[i].api.trigger();
        }
    }
}
