// @input Asset.ObjectPrefab[] prefabs

// @input SceneObject spawnParent

// @input string timeScaling = "Normal" {"widget":"combobox", "values":[{"label":"Normal", "value":"Normal"}, {"label":"Scale By Game Time", "value":"Game"}]}

// @ui {"widget":"separator"}

// @input string spawnAreaType = "None" {"widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Box", "value":"Box"}]}
// @input vec3 spawnAreaBox {"showIf":"spawnAreaType", "showIfValue":"Box", "label":"Box Size"}

// @input string prefabPositionUsage = "Offset" {"widget":"combobox", "values":[{"label":"Ignore Original Position", "value":"Ignore"}, {"label":"Apply Original Position as Offset", "value":"Offset"}]}

// @ui {"widget":"separator"}

// @input bool autoSpawning = true 
// @input float frequencyMin = 1.0 {"showIf":"autoSpawning"}
// @input float frequencyMax = 1.0 {"showIf":"autoSpawning"}

// @ui {"widget":"separator"}

// @input bool prespawning = false
// @input int prespawnCount = 1 {"showIf":"prespawning"}

// @ui {"widget":"separator"}

// @input bool useObjectScaling = false {"label":"Object Scaling"}
// @input float objectScaleMin = 1.0 {"showIf":"useObjectScaling"}
// @input float objectScaleMax = 1.0 {"showIf":"useObjectScaling"}

// @ui {"widget":"separator"}

// @input bool setObjectVelocity = false
// @input vec3 objectVelocity {"showIf":"setObjectVelocity"}

// @ui {"widget":"separator"}

// @input bool despawnObjects = false
// @input float despawnAfterTime {"showIf":"despawnObjects", "label":"Lifetime"}

var nextSpawnTimer = null;
var useGameTime = (script.timeScaling == "Game");

function onUpdate() {
    if (nextSpawnTimer !== undefined) {
        nextSpawnTimer -= getDelta();
    }
    if (nextSpawnTimer <= 0) {
        spawn(-nextSpawnTimer);
        nextSpawnTimer = nextSpawnTimer + getSpawnTime();
    }
}
script.createEvent("UpdateEvent").bind(onUpdate);


function spawn(timeAhead) {
    timeAhead = timeAhead || 0;
    var ind = Math.floor(Math.random() * script.prefabs.length);
    var nextPrefab = script.prefabs[ind];
    if (nextPrefab !== null && nextPrefab !== undefined) {
        var newObj = nextPrefab.instantiate(script.spawnParent || null);
        newObj.enabled = true;
        var newTran = newObj.getTransform();
        var pos = newTran.getLocalPosition();

        if (script.prefabPositionUsage == "Ignore") {
            pos = vec3.zero();
        }
        
        if (script.spawnAreaType == "Box") {
            pos = pos.add(new vec3(
                script.spawnAreaBox.x * randomRange(-.5, .5),
                script.spawnAreaBox.y * randomRange(-.5, .5),
                script.spawnAreaBox.z * randomRange(-.5, .5)
            ));
            newTran.setLocalPosition(pos);
        }

        if (script.useObjectScaling) {
            var scale = newObj.getTransform().getLocalScale();
            var scaling = randomRange(script.objectScaleMin, script.objectScaleMax);
            newObj.getTransform().setLocalScale(scale.uniformScale(scaling));
        }

        if (script.setObjectVelocity) {
            if (timeAhead > 0) {
                moveTransformLocal(newTran, script.objectVelocity.uniformScale(timeAhead));
            }
            addMovementScript(newObj, script.objectVelocity);
        }

        if (script.despawnObjects) {
            if (script.despawnAfterTime > 0) {
                addTimedDespawnScript(newObj, script.despawnAfterTime - timeAhead);
            }
        }
    }
}

function addMovementScript(sceneObject, velocity) {
    var transform = sceneObject.getTransform();
    addEventToObject(sceneObject, "UpdateEvent", function(eventData) {
        var dt = getDelta();
        moveTransformLocal(transform, velocity.uniformScale(dt));
    });
}

function addTimedDespawnScript(sceneObject, time) {
    var timer = time;
    addEventToObject(sceneObject, "UpdateEvent", function() {
        timer -= getDelta();
        if (timer <= 0) {
            sceneObject.destroy();
        }
    });
}

function getSpawnTime() {
    return randomRange(script.frequencyMin, script.frequencyMax);
}

function getDelta() {
    return useGameTime
        ? global.gameController.getDeltaGameTime()
        : global.getDeltaTime();
}

// If prespawning is enabled, spawn objects on the first frame as if time has already passed
if (script.prespawning) {
    if (script.prespawnCount > 0) {
        var timeAhead = 0;
        // Make list of spawn times
        var spawnTimes = new Array(script.prespawnCount);
        for (var i=0; i<script.prespawnCount; i++) {
            spawnTimes[spawnTimes.length-i-1] = timeAhead;
            timeAhead += getSpawnTime();
        }
        // Spawn each object in order
        spawnTimes.forEach(spawn);
    }
}

nextSpawnTimer = getSpawnTime();

// Public API
script.api.spawn = spawn;

// Helpers
function randomRange(min, max) {
    return min + Math.random() * (max-min);
}

function moveTransformLocal(transform, offset) {
    var pos = transform.getLocalPosition();
    transform.setLocalPosition(pos.add(offset));
}

function addEventToObject(sceneObject, eventType, callback) {
    var newScript = sceneObject.createComponent("Component.ScriptComponent");
    var evt = newScript.createEvent(eventType);
    evt.bind(callback);
    return evt;
}