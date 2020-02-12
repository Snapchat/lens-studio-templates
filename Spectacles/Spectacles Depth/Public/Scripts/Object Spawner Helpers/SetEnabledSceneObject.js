// -----JS CODE-----
// SetEnabledSceneObject.js
// Version: 0.0.1
// Event: Initialized
// Description: Description: Enables or disables a SceneObject on a specific spawner event

//@input string eventType = "onSpawned" {"label" : "Event", "widget" : "combobox", "values" : [{"label" : "On Spawn", "value" : "onSpawned"}, {"label" : "On Collided", "value" : "onCollided"},  {"label" : "On Recycled", "value" : "onRecycled"}]}

//@input SceneObject so {"label" : "Scene Object"} 
//@input int enabledValue = 0 {"label" : "Action", "widget" : "combobox", "values" : [{"label" : "Enable", "value" : "0"}, {"label" : "Disable", "value" : "1"},  {"label" : "Toggle", "value" : "2"}]}

var initialized = checkInitialized();

function checkInitialized() {
    if (!script.so) {
        print("[SetEnabledSceneObject], Error, Please set Scene Object parameter on SetEnabledSceneObject script")
        return false;
    }
    return true;
}

if (initialized) {

    script.api[script.eventType] = function () {

        switch (script.enabledValue) {
            case (0):
                script.so.enabled = true;
                break;
            case (1):
                script.so.enabled = false;
                break;
            case (2):
                script.so.enabled = !script.so.enabled;
                break;
        }
    }
}