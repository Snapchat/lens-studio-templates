//-----------------------------------------
// CollisionManager.js
//-----------------------------------------
// Version: 0.0.1
// Event: Lens Initialized

// Description: Detects simple collisions between objects.

// ----- USAGE -----

// Make sure this script on a single object in your scene, early in the hierarchy.
// In most cases this system should be accessed through CollisionObject.js, 
// which will set up all the hard parts for you. 

// ----- Global API -----

// global.collisionManager.getCollider(sceneObject) : Collider
// Helper function that searches the ScriptComponents on a SceneObject and returns the first Collider found.
// Meant for use with CollisionObject.js


global.CollisionSystem = {};


// Simple version of vec3 for more efficient vec3 math
var SimpleVec3 = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

SimpleVec3.prototype = {
    setFromVec3: function(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    },
};

SimpleVec3.copyFromVec3 = function(vec) {
    return new SimpleVec3(vec.x, vec.y, vec.z);
};

SimpleVec3.distanceSquared = function(a, b) {
    return  (a.x - b.x) * (a.x - b.x) +
            (a.y - b.y) * (a.y - b.y) +
            (a.z - b.z) * (a.z - b.z);
};

SimpleVec3.distance = function(a, b) {
    return Math.sqrt(SimpleVec3.distanceSquared(a, b));
};


var ColliderType = {
    Box : "Box",
    Sphere : "Sphere",
};
global.CollisionSystem.ColliderType = ColliderType;


var ColliderBounds = function(colliderType) {
    this.colliderType = colliderType;
};
global.CollisionSystem.ColliderBounds = ColliderBounds;

var BoxBounds = function(center, size) {
    ColliderBounds.call(this, ColliderType.Box);
    this._center = SimpleVec3.copyFromVec3(center);
    this._size = SimpleVec3.copyFromVec3(size);
    this._halfSize = SimpleVec3.copyFromVec3(size.uniformScale(0.5));
    
    this._isDirty = true;
    this._max = new SimpleVec3(0,0,0);
    this._min = new SimpleVec3(0,0,0);
};
BoxBounds.prototype = Object.create(ColliderBounds.prototype);
BoxBounds.prototype.constructor = BoxBounds;

Object.defineProperties(BoxBounds.prototype, {
    "center": {
        get: function() {
            return this._center;
        },
        set: function(c) {
            this._center.setFromVec3(c);
            this._isDirty = true;
        }
    },
    "size": {
        get: function() {
            return this._size;
        },
        set: function(s) {
            this._size.setFromVec3(s);
            this._halfSize.setFromVec3(s.uniformScale(0.5));
            this._isDirty = true;
        }
    },
    "min": {
        get: function() {
            this._recalcIfDirty();
            return this._min;
        }
    },
    "max": {
        get: function() {
            this._recalcIfDirty();
            return this._max;
        }
    },
});

Object.assign(BoxBounds.prototype, {
    _recalcIfDirty: function() {
        if (this._isDirty) {
            this._recalc();
        }
    },

    _recalc: function() {
        this._max.x = this._center.x + this._size.x * 0.5;
        this._max.y = this._center.y + this._size.y * 0.5;
        this._max.z = this._center.z + this._size.z * 0.5;

        this._min.x = this._center.x - this._size.x * 0.5;
        this._min.y = this._center.y - this._size.y * 0.5;
        this._min.z = this._center.z - this._size.z * 0.5;
        
        this._isDirty = false;
    },

    constrainPointInPlace: function(point) {
        point.x = Math.max(this.min.x, Math.min(point.x, this.max.x));
        point.y = Math.max(this.min.y, Math.min(point.y, this.max.y));
        point.z = Math.max(this.min.z, Math.min(point.z, this.max.z));
    },

    constrainPoint: function(point) {
        var ret = SimpleVec3.copyFromVec3(point);
        this.constrainPointInPlace(ret);
        return ret;
    },
});

var SphereBounds = function(center, radius) {
    ColliderBounds.call(this, ColliderType.Sphere);
    this._center = SimpleVec3.copyFromVec3(center);
    this._radius = radius;
    this._radiusSquared = radius * radius;
};
SphereBounds.prototype = Object.create(ColliderBounds.prototype);
SphereBounds.prototype.constructor = SphereBounds;

Object.defineProperties(SphereBounds.prototype, {
    "center": {
        get: function() {
            return this._center;
        },
        set: function(c) {
            this._center.setFromVec3(c);
        },
    },
    "radius": {
        get: function() {
            return this._radius;
        },
        set: function(r) {
            this._radius = r;
            this._radiusSquared = r*r;
        },
    },
    "radiusSquared": {
        get: function() {
            return this._radiusSquared;
        },
    }
});

Object.assign(SphereBounds.prototype, {
    containsPoint: function(point) {
        var dist = SimpleVec3.distanceSquared(this._center, point);
        return dist < this._radiusSquared;
    },
});


var BoundsWrapper = function() {
    this.isDirty = true;
};
BoundsWrapper.prototype = {
    updateIfDirty: function() {
        if (this.isDirty) {
            this.updateValues();
        }
    },
    updateValues: function() {
        throw Error("updateValues must be overridden.");
    },
    getCenter: function() {
        throw Error("getCenter must be overridden.");
    },
};

var BoxBoundsWrapper = function(centerGetter, sizeGetter) {
    BoundsWrapper.call(this);
    this._centerGetter = centerGetter;
    this._sizeGetter = sizeGetter;
    this.bounds = new BoxBounds(centerGetter(), sizeGetter());
};
BoxBoundsWrapper.prototype = Object.create(BoundsWrapper.prototype);
BoxBoundsWrapper.prototype.constructor = BoxBoundsWrapper;

BoxBoundsWrapper.prototype.updateValues = function() {
    this.bounds.center = this._centerGetter();
    this.bounds.size = this._sizeGetter();
    this.isDirty = false;
};
global.CollisionSystem.BoxBoundsWrapper = BoxBoundsWrapper;

var SphereBoundsWrapper = function(centerGetter, radiusGetter) {
    BoundsWrapper.call(this);
    this._centerGetter = centerGetter;
    this._radiusGetter = radiusGetter;
    this.bounds = new SphereBounds(centerGetter(), radiusGetter());
};
SphereBoundsWrapper.prototype = Object.create(BoundsWrapper.prototype);
SphereBoundsWrapper.prototype.constructor = SphereBoundsWrapper;

SphereBoundsWrapper.prototype.updateValues = function() {
    this.bounds.center = this._centerGetter();
    this.bounds.radius = this._radiusGetter();
    this.isDirty = false;
};
global.CollisionSystem.SphereBoundsWrapper = SphereBoundsWrapper;

// Class for looking up the intersection test functions between collider types
var IntersectTestLookup = function() {
    this._lookupTable = {};
};

IntersectTestLookup.prototype = {
    _getFirstLayer: function(type) {
        return getOrSetDefault(this._lookupTable, type, {});
    },

    getTest: function(typeA, typeB) {
        return this._getFirstLayer(typeA)[typeB];
    },

    addTest: function(typeA, typeB, testFunc) {
        this._getFirstLayer(typeA)[typeB] = testFunc;
        
        // Add reversed
        if (typeA !== typeB) {
            this._getFirstLayer(typeB)[typeA] = function(a, b) {
                return testFunc(b, a);
            };
        }
    },
};

var intersectLookup = new IntersectTestLookup();
intersectLookup.addTest(ColliderType.Box, ColliderType.Box, testBoxCollision);
intersectLookup.addTest(ColliderType.Sphere, ColliderType.Sphere, testSphereCollision);
intersectLookup.addTest(ColliderType.Box, ColliderType.Sphere, testBoxSphereCollision);

function testBoxCollision(a, b) {
    return (a.min.x <= b.max.x && a.max.x >= b.min.x &&
            a.min.y <= b.max.y && a.max.y >= b.min.y &&
            a.min.z <= b.max.z && a.max.z >= b.min.z);
}

function testSphereCollision(a, b) {
    var distSquared = SimpleVec3.distanceSquared(a.center, b.center);
    return distSquared < (a.radius + b.radius) * (a.radius + b.radius);
}

var scratchVec3 = new SimpleVec3(0, 0, 0);
function testBoxSphereCollision(box, sphere) {
    scratchVec3.setFromVec3(sphere.center);
    box.constrainPointInPlace(scratchVec3);
    return sphere.containsPoint(scratchVec3);
}

function testIntersection(boundsA, boundsB) {
    var test = intersectLookup.getTest(boundsA.colliderType, boundsB.colliderType);
    if (test) {
        return test(boundsA, boundsB);
    } else {
        throw (Error("no collision test: " + boundsA.colliderType + " <-> " + boundsB.colliderType));
    }
}

// Class representing an object that can collide
var Collider = function(sceneObject, boundsWrapper, tags, validCheck) {
    this.sceneObject = sceneObject;
    this.boundsWrapper = boundsWrapper;
    this.tags = tags;
    
    this._validCheck = validCheck;
    
    this.lastUpdate = global.getTime();

    this.collisionChecks = [];
    this.instanceId = Collider.getNewInstanceId();
};

Collider.nextInstanceId = 0;
Collider.getNewInstanceId = function() {
    return (Collider.nextInstanceId++).toString();
};

Collider.prototype = {
    isValid: function(currentTime) {
        return this._validCheck();
    },

    isActive: function(currentTime) {
        return this.lastUpdate === currentTime;
    },

    getCenter: function() {
        return this.boundsWrapper.bounds.center;
    },

    getCollisionConfigForTag: function(tag) {
        for (var i=0; i<this.collisionChecks.length;i++) {
            if (this.collisionChecks[i].tag === tag) {
                return this.collisionChecks[i];
            }
        }
        var config = {"tag": tag};
        this.collisionChecks.push(config);
        return config;
    },

    addCollisionCallback(tag, callbackConfig) {
        var config = this.getCollisionConfigForTag(tag);
        if (config.onEnter) {
            config.onEnterCalls = initOrAdd(config.onEnterCalls, callbackConfig);
        }
        if (config.onColliding) {
            config.onCollidingCalls = initOrAdd(config.onCollidingCalls, callbackConfig);
        }
        if (config.onExitCalls) {
            config.onExitCalls = initOrAdd(config.onExitCalls, callbackConfig);
        }
    },

    addOnEnterCallback(tag, callback) {
        var config = this.getCollisionConfigForTag(tag);
        config.onEnterCalls = initOrAdd(config.onEnterCalls, callback);
    },

    addOnCollidingCallback(tag, callback) {
        var config = this.getCollisionConfigForTag(tag);
        config.onCollidingCalls = initOrAdd(config.onCollidingCalls, callback);
    },

    addOnExitCallback(tag, callback) {
        var config = this.getCollisionConfigForTag(tag);
        config.onExitCalls = initOrAdd(config.onExitCalls, callback);
    },

    setDirty: function() {
        this.boundsWrapper.isDirty = true;
    },
    
    markActive: function() {
        this.lastUpdate = global.getTime();
    },
};
global.CollisionSystem.Collider = Collider;

// Class for tracking collision status between two colliders
var CollisionState = function(a, b) {
    this.colliderA = a;
    this.colliderB = b;
    
    this.isColliding = false;
    this.isEntering = false;
    this.isExiting = false;

    this.lastUpdateTime = null;
};

// Class for tracking the status of all collisions between all colliders
var CollisionTable = function() {
    this.collisionStates = {};
};

CollisionTable.prototype = {
    // Get or create the dic of collision states for a specific collider
    getFirstLayer: function(id) {
        return getOrSetDefault(this.collisionStates, id, {});
    },

    // Find or initialize the collision state between two specific colliders
    getCollisionState: function(colliderA, colliderB) {
        var aId = colliderA.instanceId;
        var bId = colliderB.instanceId;

        var aState = this.getFirstLayer(aId)[bId];
        var bState = this.getFirstLayer(bId)[aId];

        var state = aState || bState || new CollisionState(colliderA, colliderB);

        // If either collider's lookup dic is missing this state, add it in
        if (!aState) {
            this.getFirstLayer(aId)[bId] = state;
        }
        if (!bState) {
            this.getFirstLayer(bId)[aId] = state;
        }

        return state;
    },

    removeCollider: function(collider) {
        var id = collider.instanceId;
        var layer = this.getFirstLayer(id);
        var keys = Object.keys(layer);
        for (var i=0; i<keys.length; i++) {
            delete this.getFirstLayer(keys[i])[id];
        }
        delete this.collisionStates[id];
    },
};
var collisionTable = new CollisionTable();


var colliders = [];
var tagLookup = {};

// Find all colliders matching a tag
function getCollidersForTag(tag) {
    return getOrSetDefault(tagLookup, tag, []);
}

function registerCollider(collider) {
    var tags = collider.tags;
    for (var i=0; i<tags.length; i++) {
        getCollidersForTag(tags[i]).push(collider);
    }
    colliders.push(collider);
}

function removeColliderDuringLoop(collider) {
    collisionTable.removeCollider(collider);
    for (var i=0; i<collider.tags.length; i++) {
        var tag = collider.tags[i];
        var colliderList = getCollidersForTag(tag);
        removeColliderFromList(colliderList, collider);
    }
}

function testCollisionBetweenColliders(colliderA, colliderB, frameTime) {
    var state = collisionTable.getCollisionState(colliderA, colliderB);
    
    // If the timestamp isn't current, collision check needs to be updated (avoid doing the same check twice)
    if (state.lastUpdateTime !== frameTime) {
        colliderA.boundsWrapper.updateIfDirty();
        colliderB.boundsWrapper.updateIfDirty();
        
        var wasColliding = state.isColliding;

        var isColliding = testIntersection(colliderA.boundsWrapper.bounds, colliderB.boundsWrapper.bounds);

        state.isColliding = isColliding;
        state.isEntering = (!wasColliding && isColliding);
        state.isExiting = (wasColliding && !isColliding);

        // Mark this collision as being calculated this frame
        state.lastUpdateTime = frameTime;
    }

    return state;
}

// Check for collisions on this collider
function checkColliderCollisions(collider, frameTime) {
    // Skip inactive colliders
    if (!collider.isActive(frameTime)) {
        return;
    }
    // For each collision check that was registered on the collider...
    for (var i=0; i<collider.collisionChecks.length; i++) {
        var tag = collider.collisionChecks[i].tag;
        var otherColliders = getCollidersForTag(tag);
        // For each collider with a tag matching this check...
        for (var j=0; j<otherColliders.length; j++) {
            // Don't detect collisions with self
            if (otherColliders[j].instanceId == collider.instanceId) {
                continue;
            }
            
            // Get collision state between the colliders
            var state = testCollisionBetweenColliders(collider, otherColliders[j], frameTime);
            var collisionConfig = collider.collisionChecks[i];
            
            // Do callbacks for any collision event that occurred
            if (state.isEntering) {
                callbackHelper(collisionConfig.onEnterCalls, otherColliders[j]);
            }
            if (state.isColliding) {
                callbackHelper(collisionConfig.onCollidingCalls, otherColliders[j]);
            }
            if (state.isExiting) {
                callbackHelper(collisionConfig.onExitCalls, otherColliders[j]);
            }
        }
    }
}

// Check for collisions in LateUpdate, giving objects a chance to move during Update
function onLateUpdate(eventData) {
    var frameTime = global.getTime();
    for (var i=0; i<colliders.length; i++) {
        colliders[i].setDirty(true);
        
        // Remove invalid (destroyed) colliders
        if (!colliders[i].isValid(frameTime)) {
            removeColliderDuringLoop(colliders[i]);
            colliders.splice(i, 1);
            i--;
        }
    }

    // Check for collisions on each collider
    for (var j=0; j<colliders.length; j++) {
        checkColliderCollisions(colliders[j], frameTime);
    }
}
script.createEvent("LateUpdateEvent").bind(onLateUpdate);

// Global API
global.collisionManager = {};
global.collisionManager.registerCollider = registerCollider;
global.collisionManager.getCollider = findColliderOnSceneObject;

// Helper functions
function getOrSetDefault(obj, key, def) {
    if (key in obj) {
        return obj[key];
    }
    obj[key] = def;
    return def;
}

function initOrAdd(array, element) {
    if (!array) {
        return [element];
    }
    array.push(element);
    return array;
}

function callbackHelper(callbacks, arg) {
    if (callbacks) {
        for (var i=0; i<callbacks.length; i++) {
            callbacks[i](arg);
        }
    }
}

function removeColliderFromList(list, collider) {
    for (var i=0; i<list.length; i++) {
        if (list[i].instanceId === collider.instanceId) {
            list.splice(i, 1);
            return;
        }
    }
    throw Error("Couldn't remove collider from list");
}

function findColliderOnSceneObject(sceneObject) {
    if (!sceneObject) {
        return null;
    }
    var scriptCount = sceneObject.getComponentCount("Component.ScriptComponent");
    for (var i=0; i<scriptCount; i++) {
        var scriptComponent = sceneObject.getComponent("Component.ScriptComponent", i);
        if (scriptComponent.api.collider) {
            return scriptComponent.api.collider;
        }
    }
}