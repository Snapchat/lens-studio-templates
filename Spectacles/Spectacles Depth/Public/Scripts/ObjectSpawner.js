// -----JS CODE-----
// ObjectSpawner.js
// Version: 0.0.1
// Event: Initialized
// Description: Spawns copies of a child objects on a random screen position, reuses them, tracks collisions with the depth, calls api functions on spawned, collided

//@input int count { "widget" : "slider", "min" : "0", "max" : "50", "step" : "1"}

//@input float lifetime //set this to -1 if infinite
//@input bool collideWithDepth {"label" : "Collide"}
//@input float lifetimeAfterCollision {"label":"    Lifetime After", "showIf" : "collideWithDepth", "showIfValue" : "true"}  

//@ui {"widget":"separator"}
//@input SceneObject spawnSource 
//@ui {"label":"Spawn Box"}
//@input vec3 spawnBoxSize {"label":"    Size"}
//@input vec3 spawnBoxOffset {"label":"    Offset"}

//@ui {"widget":"separator"}
//@input bool applyRotation  
//@input bool move   
//@input vec3 startSpeed  {"showIf" : "move", "label":"    Speed"}
//@input vec3 worldForce  {"showIf" : "move", "label":"    Force"}
//@input bool freeze  {"showIf" : "move", "label":"    Stop on Collide"}
//@ui {"widget":"separator"}

//@input bool advanced 
//@input Component.Camera camera { "showIf" : "advanced", "showIfValue" : "true"}
//@input Asset.Material spectaclesDepthMaterial { "showIf" : "advanced", "showIfValue" : "true"}

var CLIP_LENGTH = 10.0;
var MAX_DISTANCE_FROM_CAMERA = 400.0;

var spawnDeltaTime;
var spawnTime;
var prevTime;

var activeObjects;
var recycledObjects;

var spawnerTargetTransform;
var cameraTransform;

var thisSceneObject;
var originalObjects;
var objectToSpawnIndex;

var depthProvider;

var hiddenLayerSet;
var visibleLayerSet;

script.createEvent("TurnOnEvent").bind(onTurnOn);

function checkInitialized() {

    if (script.spectaclesDepthMaterial && script.spectaclesDepthMaterial.mainPass.baseTex) {
        if (script.spectaclesDepthMaterial.mainPass.baseTex.getHeight() == 1) {
            print("[ObjectSpawner], Warning, Spectacles Depth Texture is not initialized, Collisions will not be calculated correctly, falling back to default distance of MAX_DISTANCE_FROM_CAMERA.");
        }
        else {
            depthProvider = script.spectaclesDepthMaterial.mainPass.baseTex.control;
        }

    } else {
        print("[ObjectSpawner], Error, Please set Spectacles Depth Material on [ObjectSpawner] script under the advanced checkbox");
        return false;
    }
    if (script.spawnSource) {
        spawnerTargetTransform = script.spawnSource.getTransform();
    } else {
        print("[ObjectSpawner], Error, Please set spawner source on [ObjectSpawner]");
        return false;
    }
    if (script.camera) {
        cameraTransform = script.camera.getSceneObject().getTransform();
    } else {
        print("[ObjectSpawner], Error, Please set camera on [ObjectSpawner] script under the advanced checkbox");
        return false;
    }
    visibleLayerSet = script.camera.renderLayer;
    hiddenLayerSet = visibleLayerSet.except(visibleLayerSet);

    thisSceneObject = script.getSceneObject();
    originalObjects = [];
    objectToSpawnIndex = 0;

    for (var i = 0; i < thisSceneObject.getChildrenCount(); i++) {
        var originalObject = thisSceneObject.getChild(i);
        if (originalObject.enabled) {
            originalObjects.push(originalObject);
            //hide originals
            var children = getAllChildren(originalObject);
            switchRenderLayer(children, false);
        }
    }

    if (script.count == 0) {
        print("[ObjectSpawner], Warning, Spawn count is set to 0 on [ObjectSpawner] script component")
        return false; //don't spawn in this case
    }

    if (originalObjects.length == 0) {
        print("[ObjectSpawner], Warning, There are no objects to spawn. Please make the objects you want to spawn a children of ObjectSpawner and make sure they are enabled")
        return false; //don't spawn in this case
    }
    return true;
}

function onTurnOn() {

    var initialized = checkInitialized();
    if (!initialized) {
        return;
    }

    recycledObjects = new DuplicatePool(objectConstructor, script.count);
    activeObjects = [];

    spawnDeltaTime = CLIP_LENGTH / script.count;
    spawnTime = 0;
    prevTime = getTime();

    script.createEvent("UpdateEvent").bind(onUpdate);
}

function onUpdate(eventData) {
    // Check if time looped. If Lens is running on Spectacles video, at the end of the video, time will loop as the video restarts
    var curTime = getTime();
    if (curTime < prevTime) {
        onLoopStarted();
    }

    updateObjects(eventData.getDeltaTime());

    if (curTime >= spawnTime && activeObjects.length < script.count) {
        spawn();
        spawnTime = curTime + spawnDeltaTime;
    }
    prevTime = curTime;
}

function onLoopStarted() {
    for (var i in activeObjects) {
        recycledObjects.recycle(activeObjects[i]);
    }
    activeObjects = [];
    spawnTime = 0;
}

function updateObjects(dt) {
    var n = activeObjects.length;
    var i = n;
    while (i--) {
        var activeObject = activeObjects[i];
        activeObject.update(dt);
        if (activeObject.shouldDie()) {
            recycledObjects.recycle(activeObject);
            activeObjects.splice(i, 1);
        }
    }
}

function objectConstructor() {
    //creates a copy of one of children
    var obj = thisSceneObject.copyWholeHierarchy(originalObjects[objectToSpawnIndex]);
    objectToSpawnIndex = (objectToSpawnIndex + 1) % originalObjects.length;
    return new SpawnedObject(obj);
}

function spawn() {
    //setup spawned object
    var spawnedObject = recycledObjects.get();
    var sourcePosition = spawnerTargetTransform.getWorldPosition();
    var offset = vec3.zero();
    offset.x += (Math.random() - 0.5) * script.spawnBoxSize.x + script.spawnBoxOffset.x;
    offset.y += (Math.random() - 0.5) * script.spawnBoxSize.y + script.spawnBoxOffset.y;
    offset.z += (Math.random() - 0.5) * script.spawnBoxSize.z + script.spawnBoxOffset.z;

    var mat = spawnerTargetTransform.getWorldTransform();
    var position = mat.multiplyDirection(offset).add(sourcePosition);
    var rotation = script.applyRotation ? quat.lookAt(spawnerTargetTransform.forward, vec3.up()) : undefined;

    spawnedObject.spawn(script.lifetime, position, rotation);

    if (script.move) {
        spawnedObject.addMovement(mat.multiplyDirection(script.startSpeed), script.worldForce);
    }
    if (script.collideWithDepth) {
        var conditionFunc = depthProvider ? isColliding : isTooFar;
        spawnedObject.addCollisionCheck(conditionFunc, script.lifetimeAfterCollision, script.freeze);
    }
    activeObjects.push(spawnedObject);

}

function isTooFar(position) {
    return cameraTransform.getWorldPosition().distance(position) > MAX_DISTANCE_FROM_CAMERA;
}

function isColliding(position) {
    var screenPos = script.camera.worldSpaceToScreenSpace(position);
    if (screenPos.x > 1 || screenPos.x < 0 || screenPos.y > 1 || screenPos.y < 0) {
        return false;
    }
    var screenPosDepth = depthProvider.getDepth(screenPos);
    var objectDepth = cameraTransform.getWorldPosition().distance(position);
    return screenPosDepth - objectDepth <= 0;
}

//Helper functions

function createCallback(scriptComponents, eventName) {
    return function () {
        for (var i = 0; i < scriptComponents.length; i++) {
            if (scriptComponents[i].api[eventName]) {
                scriptComponents[i].api[eventName]();
            }
        }
    }
}

function getComponentsInSceneObjects(sceneObjects, name) {
    var components = [];
    for (j in sceneObjects) {
        var componentCount = sceneObjects[j].getComponentCount(name);
        if (componentCount > 0) {
            for (var i = 0; i < componentCount; i++) {
                components.push(sceneObjects[j].getComponentByIndex(name, i));
            }
        }
    }
    return components;
}
function getAllChildren(sceneObject) {
    var childArr = [];
    putChildrenRecursively(sceneObject, childArr);
    return childArr;
}

function putChildrenRecursively(so, arr) {
    arr.push(so);
    var childrenCount = so.getChildrenCount();
    for (var i = 0; i < childrenCount; i++) {
        putChildrenRecursively(so.getChild(i), arr);
    }
}

function switchRenderLayer(sceneObjects, visible) {
    for (var i in sceneObjects) {
        sceneObjects[i].layer = visible ? visibleLayerSet : hiddenLayerSet;
    }
}

//SpawnedObject the class responsible for spawned object's lifecycle, including its movement and collision

var SpawnedObject = function (sceneObject) {
    this.sceneObject = sceneObject;
    this.transform = sceneObject.getTransform();
    this.children = getAllChildren(sceneObject);
    var scriptComponents = getComponentsInSceneObjects(this.children, "ScriptComponent");

    //functions
    this.onSpawned = createCallback(scriptComponents, "onSpawned");
    this.onCollided = createCallback(scriptComponents, "onCollided");
    this.onRecycled = createCallback(scriptComponents, "onRecycled");
    this.collisionCheck;
    this.positionUpdate;
    
    //properties
    this.justSpawned; // because wee need to wait for the script initialization
    this.timeleft;

}

SpawnedObject.prototype.spawn = function (lifetime, pos, rot) {
    this.timeleft = lifetime >= 0 ? lifetime : undefined;
    this.transform.setWorldPosition(pos);
    if (rot) {
        this.transform.setWorldRotation(rot);
    }
    switchRenderLayer(this.children, true);
    this.justSpawned = true;
}

SpawnedObject.prototype.addMovement = function (s, f) {
    this.speed = s;
    this.force = f;
    this.positionUpdate = true;
}

SpawnedObject.prototype.addCollisionCheck = function (checkFunction, lifetime, freeze) {
    this.collisionCheck = function (pos) {
        if (checkFunction(pos)) {
            if (freeze) {
                this.positionUpdate = undefined;
            }
            this.timeleft = lifetime >= 0 ? lifetime : undefined;
            return true;
        }
    }
}

SpawnedObject.prototype.update = function (dt) {
    if (this.justSpawned) {
        this.onSpawned();
        this.justSpawned = false;
    }

    if (this.timeleft) {
        this.timeleft -= dt;
    }

    var position = this.transform.getWorldPosition();

    if (this.collisionCheck && this.collisionCheck(position)) {
        this.onCollided();
        this.collisionCheck = undefined;
    }

    if (this.positionUpdate) {
        this.speed = this.speed.add(this.force.uniformScale(dt));
        this.transform.setWorldPosition(position.add(this.speed.uniformScale(dt)));
    }
}

SpawnedObject.prototype.shouldDie = function () {
    return this.timeleft != undefined && this.timeleft <= 0;
}

SpawnedObject.prototype.recycle = function () {
    this.onRecycled();
    switchRenderLayer(this.children, false);
}

SpawnedObject.prototype.destroy = function () {
    this.sceneObject.destroy();
}

// Description: The class that manages duplication and reuse of an object or resource (SceneObject, material, etc);

var DuplicatePool = function (constructor, maxCount) {
    this.constructor = constructor;
    this.maxCount = maxCount;
    this.objects = [];
    this.count = 0;
}

DuplicatePool.prototype.get = function () { // API to allow user to get item from the pool of the duplicated things
    if (this.count > 0) {
        this.count -= 1;
        var obj = this.objects[this.count];
        this.objects[this.count] = null;
        return obj;
    }
    return this.constructor();
};

DuplicatePool.prototype.recycle = function (obj) {// API to allow user to return object back to the pool for reuse
    if (this.count < this.maxCount) {
        if (obj.recycle) {
            obj.recycle();
        }
        this.objects[this.count] = obj;
        this.count += 1;
    } else {
        if (obj.destroy) {
            obj.destroy();
        }
    }
}

DuplicatePool.prototype.getSize = function () {// get current amount of objects in the Pool
    return this.count;
}
