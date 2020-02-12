// -----JS CODE-----
// PlayParticles.js
// Version: 0.0.1
// Event: Initialized
// Description: Plays particles when object is spawned or collides with depth, updates external time until object is recycled. Creates material copy, requires MaterialDuplicationHelper if cloneMaterial is enabled
//@input string eventType = "onSpawned" {"label" : "Event", "widget" : "combobox", "values" : [{"label" : "On Spawn", "value" : "onSpawned"}, {"label" : "On Collided", "value" : "onCollided"}]}
//@input Component.MeshVisual meshVisual
//@input int amount
//@input bool cloneMaterial 

var initialized = checkInitialized();

function checkInitialized() {
    if (!script.meshVisual) {
        print("[PlayParticles], Error, Please set up particle mesh visual");
        return false;
    }

    if (script.cloneMaterial) {
        var material = script.meshVisual.mainMaterial.clone();
        script.meshVisual.mainMaterial = material;
    }
    return true;
}

if (initialized) {
    script.meshVisual.mainMaterial.mainPass.externalTimeInput = 0.0;
    script.meshVisual.mainMaterial.mainPass.spawnMaxParticles = 0;

    var updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(updateExternalTime);
    updateEvent.enabled = false;

    script.api[script.eventType] = function () {
        script.meshVisual.mainMaterial.mainPass.externalTimeInput = 0.0;
        script.meshVisual.mainMaterial.mainPass.spawnMaxParticles = script.amount;
        updateEvent.enabled = true;
    }

    script.api.onRecycled = function () {
        updateEvent.enabled = false;
        script.meshVisual.mainMaterial.mainPass.externalTimeInput = 0.0;
        script.meshVisual.mainMaterial.mainPass.spawnMaxParticles = 0;
    }
}
function updateExternalTime(eventData) {
    script.meshVisual.mainMaterial.mainPass.externalTimeInput += eventData.getDeltaTime();
}