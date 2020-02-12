// -----JS CODE-----
// MoveAlongPath.js
// Version: 0.0.1
// Event: Initialized
// Description: This is one of the effectors provided in this template.
// this effector will let you to move a content based on the speed along the path.

// @input string loopType = "none" {"label":"Loop Type", "widget":"combobox", "values":[{"label":"None", "value":"none"}, {"label":"Loop", "value":"loop"}, {"label":"Ping Pong", "value":"pingPong"}]}
// @input float speed = 200.0
// @input float delay = 0.0
// @input float startOffset = 0.0 {"label":"Start Offset", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float endOffset = 1.0 {"label":"End Offset", "widget":"slider", "min":0.01, "max":1.0, "step":0.01}
// @input bool addPathRotation

var pathData;
var smoothedPath = [];
var thisSceneObject;
var rootOriginPosition = [];
var rootOriginRotation = [];
var childCount;
var childTransform = [];
var smoothPathFinalIndex = 0;
const smoothingDist = 100;

function onLensTurnOn()
{
    setChildTransform();
    setPathData();
    setSmoothPath();
}

function setPathData()
{
    pathData = global.pathDataManager.createPathData({
        startOffset: script.startOffset,
        endOffset: script.endOffset,
        frameResolution: 1,
        smoothingAmount: 1,
        randomizeValue: 0
    });
}

function setSmoothPath()
{
    var previousPos = null;
    var counter = 0;
    for(var i = 0; i < pathData.length; i++)
    {
        var curPos = pathData[i].position;
        if (!previousPos || previousPos.distance(curPos) >= smoothingDist)
        {
            smoothedPath[counter] ={
                position: curPos,
                rotation: pathData[i].rotation
            };
            counter++;
            previousPos = curPos;
        }
    }
    smoothPathFinalIndex = smoothedPath.length - 1;
}

function pingPong(t, len)
{
    var l = 2 * len;
    t = t % l;
    return (0 <= t && t < len) ? t : l - t;
}

function onUpdate()
{
    if(smoothedPath.length > 1)
    {
        var time = getTime();

        var totalDist = smoothPathFinalIndex * smoothingDist;
        var loopDuration = totalDist / Math.abs(script.speed);

        var localTime = Math.max(0, time - script.delay);
        if (script.loopType == "loop") {
            localTime = localTime % loopDuration;
        } else if (script.loopType == "pingPong") {
            localTime = pingPong(localTime, loopDuration);
        } else {
            localTime = Math.min(localTime, loopDuration);
        }

        var localT = localTime / loopDuration;
        if (script.speed < 0) {
            localT = 1 - localT;
        }

        var ind = localT * smoothPathFinalIndex;

        var adjustedPos = global.pathDataManager.getEasedPosition(smoothedPath, ind);
        var adjustedRot = global.pathDataManager.getEasedRotation(smoothedPath, ind);

        for(var i = 0; i < childTransform.length; i++)
        {
            childTransform[i].setWorldPosition(adjustedPos.add(rootOriginPosition[i]));

            if(script.addPathRotation)
            {
                childTransform[i].setWorldRotation(adjustedRot.multiply(rootOriginRotation[i]));
            }
        }
    }
}

function setChildTransform()
{
    thisSceneObject = script.getSceneObject();
    childCount = thisSceneObject.getChildrenCount();

    if(childCount == 0)
    {
        print("MoveAlongPath:, ERROR: No Children found in  " + script.getSceneObject().name);
    }
    else
    {
        for(var i = 0; i < childCount; i++)
        {
            childTransform[i] = thisSceneObject.getChild(i).getTransform();
            rootOriginPosition[i] = childTransform[i].getWorldPosition();
            rootOriginRotation[i] = childTransform[i].getWorldRotation();
        }
    }
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);