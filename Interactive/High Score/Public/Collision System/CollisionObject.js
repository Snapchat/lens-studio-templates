//-----------------------------------------
// CollisionObject.js
//-----------------------------------------
// Version: 0.0.1
// Event: Lens Initialized

// Description: Register this object as a collider to be used with CollisionManager


// ----- SETUP -----
// Make sure CollisionManager is present in your scene, higher up in the hierarchy than 
// any instance of this script. 


// ----- USAGE -----
// This script will add a Collider object to the ScriptComponent's API object. You can then
// access that Collider in other scripts. For example:

// ----- EXAMPLE -----
// var collider = script.colliderScript.api.collider;
// collider.addOnEnterCallback("enemy", function(otherCollider) {
//      print("entered collision with " + otherCollider.name);
// });


// ----- SCRIPT API -----
// <this_script_component>.api.collider - The Collider object owned by this script


// ----- COLLIDER API ------
// Collider.addOnEnterCallback(tag, function(otherCollider))
// Adds a callback for when this Collider starts colliding with a Collider with the specified tag.
// The callback function will be passed the other Collider object involved in the collision.

// Collider.addOnCollidingCallback(tag, function(otherCollider))
// Adds a callback for when this Collider continues colliding with a Collider with the specified tag.

// Collider.addOnExitCallback(tag, function(otherCollider))
// Adds a callback for when this Collider stops colliding with a Collider with the specified tag.

// Collider.getCenter() : vec3
// Returns the center point (in world space) of the Collider's boundaries

// Collider.sceneObject
// The SceneObject associated with this Collider

// Collider.instanceId
// The unique identifier assigned to this Collider



//-----------------------------------------
// Inspector Properties
//-----------------------------------------

// @input string colliderType = "Box" {"widget":"combobox","values":[{"value":"Box","label":"Box"},{"value":"Sphere","label":"Sphere"},{"value":"UnitBoxMesh", "label":"Unit Box Mesh"},{"value":"UnitSphereMesh", "label":"Unit Sphere Mesh"}]}

// @input vec3 boxSize = {1, 1, 1} {"showIf":"colliderType", "showIfValue":"Box"}
// @input vec3 boxOffset = {0, 0, 0} {"showIf":"colliderType", "showIfValue":"Box"}

// @input float sphereRadius = 1.0 {"showIf":"colliderType", "showIfValue":"Sphere"}
// @input vec3 sphereOffset = {0, 0, 0} {"showIf":"colliderType", "showIfValue":"Sphere"}

// @input Component.MeshVisual unitBoxMesh {"showIf":"colliderType", "showIfValue":"UnitBoxMesh"}
// @input bool hideBoxMesh {"showIf":"colliderType", "showIfValue":"UnitBoxMesh"}

// @input Component.MeshVisual unitSphereMesh {"showIf":"colliderType", "showIfValue":"UnitSphereMesh"}
// @input bool hideSphereMesh {"showIf":"colliderType", "showIfValue":"UnitSphereMesh"}

// @ui {"widget":"separator"}

// @input string[] collisionTags = {"default"}

var selfTransform = script.getTransform();
var selfSceneObj = script.getSceneObject();

var collider = null;
var boundsWrapper = null;
var validCheck = null;

if (script.colliderType == "Box" || script.colliderType == "UnitBoxMesh") {
    var getBoxCenter;
    var getBoxSize;

    if (script.colliderType == "UnitBoxMesh") {
        var meshTransform = script.unitBoxMesh.getTransform();
        getBoxCenter = function() {
            return meshTransform.getWorldPosition();
        };
        getBoxSize = function() {
            return meshTransform.getWorldScale();
        };
        validCheck = createValidCheck(script.unitBoxMesh.getSceneObject());
        if (script.hideBoxMesh) {
            script.unitBoxMesh.enabled = false;
        }
    } else if (script.colliderType == "Box") {
        getBoxCenter = function() {
            return selfTransform.getWorldPosition().add(script.boxOffset);
        };
        getBoxSize = function() {
            return selfTransform.getWorldScale().scale(script.boxSize);
        };
        validCheck = createValidCheck(selfSceneObj);
    }
    boundsWrapper = new global.CollisionSystem.BoxBoundsWrapper(getBoxCenter, getBoxSize);
} else if (script.colliderType == "Sphere" || script.colliderType == "UnitSphereMesh") {
    var getSphereCenter;
    var getSphereRadius;

    if (script.colliderType == "UnitSphereMesh") {
        var sphereMeshTransform = script.unitSphereMesh.getTransform();
        getSphereCenter = function() {
            return sphereMeshTransform.getWorldPosition();
        };
        getSphereRadius = function() {
            return sphereMeshTransform.getWorldScale().x;
        };
        validCheck = createValidCheck(sphereMeshTransform.getSceneObject());
        if (script.hideSphereMesh) {
            script.unitSphereMesh.enabled = false;
        }
    } else if (script.colliderType == "Sphere") {
        getSphereCenter = function() {
            return selfTransform.getWorldPosition().add(script.sphereOffset);
        };
        getSphereRadius = function() {
            return selfTransform.getWorldScale().x * script.sphereRadius;
        };
        validCheck = createValidCheck(selfSceneObj);
    }
    boundsWrapper = new global.CollisionSystem.SphereBoundsWrapper(getSphereCenter, getSphereRadius);
}

if (boundsWrapper) {
    collider = new global.CollisionSystem.Collider(selfSceneObj, boundsWrapper, script.collisionTags, validCheck);
    collider.name = script.getSceneObject().name;
    global.collisionManager.registerCollider(collider);
    
    script.api.collider = collider;

    script.createEvent("UpdateEvent").bind(function() {
        collider.markActive();
    });
}


function createValidCheck(obj) {
    return function() {
        return !global.isNull(obj);
    };
}
