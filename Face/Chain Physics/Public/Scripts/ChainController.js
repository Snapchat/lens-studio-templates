// ChainController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: A controller script that allows you to create a chain like movement of an array of sceneObjects attached by the fist link 

//@input SceneObject[] joints

//@ui {"widget" : "separator"}

//@input float stiffness = 1.0 {"widget":"slider","min":"0.0","max":"1.0", "step": " 0.1"}
//@input int type = 0 {"widget":"combobox", "values" : [{"label" : "Rigid", "value" : "0"}, {"label" : "Elastic", "value" : "1"}]}
//@input int iterations = 1 
//@input float timeSpeed = 1.0

//@ui {"widget" : "separator"}

//@input vec3 force = {0.0, -1.0, 0.0}
//@input bool isRelative = false
//@input SceneObject relativeTo {"showIf" : "isRelative"}

//@ui {"widget" : "separator"}

//@input bool addRotation = false

//@ui {"widget" : "separator"}

var points = [];
var constraints = [];
var links = [];

var updatePin = true;
var timeSpeed = 33.0 * script.timeSpeed;
var deltaTime = 0.033;

var relativeToTransform;
var acc;

if (checkValid()) {
    initialize();
}

function checkValid() {
    if(!global.MathLib){
        print("ChainController, Error, please add a JSMathLibrary.js script to the scene and put it before the ChainController script");
        return false;
    }
    
    if(!global.Point || !global.Constraint){
        print("ChainController, Error, please add a PositionBasedDynamicsHelpers.js script to the scene and put it before the ChainController script");
        return false;
    }

    if (script.isRelative) {
        if (!script.relativeTo) {
            print("ChainController, Warning, please set the RelativeTo sceneobject force is relative to");
            return false;
        }
        relativeToTransform = script.relativeTo.getTransform();
    }

    if (script.iterations <= 0) {
        print("ChainController, Warning, iteration count should be > 0");
        return false;
    }
    return true;
}

function initialize() {
    for (var i = 0; i < script.joints.length; i++) {
        var transform = script.joints[i].getTransform();
        links.push({
            transform: transform,
            startRot: global.MathLib.quat.fromEngine(transform.getWorldRotation()),
            startDir: null
        })
        var pos = MathLib.vec3.fromEngine(transform.getWorldPosition());
        var p;
        if (i == 0) {
            p = new global.Point(0.0, pos);//static particle
            points.push(p);
            continue;
        } else {
            p = new global.Point(1.0, pos);
            points.push(p);
            var c = new global.Constraint(points[i - 1], points[i], script.stiffness, script.type == 0);
            constraints.push(c);
            links[i - 1].startDir = points[i].getPosition().sub(points[i - 1].getPosition());
        }
    }
    acc = global.MathLib.vec3.fromEngine(script.force);

    if (points.length > 0 && script.iterations > 0) {
        script.createEvent("UpdateEvent").bind(onUpdate);
    }
}

function onUpdate(eventData) {
    updatePhysics(deltaTime, script.iterations);//calculate point positions
    if (script.addRotation) {
        applyRotations();
    }
    applyPositions();
}

function updatePhysics(dt, iteration) {
    
    if (updatePin) {
        points[0].setPosition(global.MathLib.vec3.fromEngine(links[0].transform.getWorldPosition()))
    }

    if (script.isRelative) {
        acc = MathLib.vec3.fromEngine(relativeToTransform.getWorldTransform().multiplyDirection(script.force))
    }
    for (var i = 1; i < points.length; i++) {
        points[i].update(dt * timeSpeed, acc);
    }
    for (var i = 0; i < iteration; i++) {
        for (var c in constraints) {
            constraints[c].solve(dt * timeSpeed);
        }
    }
}


function applyRotations() {

    for (var i = 1; i < points.length; i++) {
        var direction = points[i].getPosition().sub(points[i - 1].getPosition());
        var q = MathLib.quat.rotationFromTo(links[i - 1].startDir, direction);
        var newRot = q.multiply(links[i - 1].startRot);
        links[i - 1].transform.setWorldRotation(global.MathLib.quat.toEngine(newRot))
    }
}

function applyPositions() {
    for (var i = 0; i < points.length; i++) {
        var worldPos = global.MathLib.vec3.toEngine(points[i].getPosition());
        links[i].transform.setWorldPosition(worldPos);
    }
}