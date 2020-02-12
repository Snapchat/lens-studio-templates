// -----JS CODE-----
// PlaceObjectsOnPath.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that let you to place any content on the camera path.
// just place any content as a child of the PlaceObjectsOnPath [OBJECTS_HERE] and it will appear on camera path.

//@ui {"widget":"group_start", "label":"Distribution"}
// @input string objectDistribution = "count" {"label":"Type", "widget":"combobox", "values":[{"label":"Count", "value":"count"}, {"label":"Distance", "value":"distance"}]}
// @input int objectCount {"label":"Amount", "widget":"slider", "min":1, "max":50, "step":1, "showIf": "objectDistribution", "showIfValue":"count" }
// @input float objectDistance {"label":"Distance", "widget":"slider", "min":20.0, "max":100.0, "step":1.0, "showIf": "objectDistribution", "showIfValue":"distance" }
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Transform Each"}
// @input vec3 positionToAdd {"label":"Position"}
// @input vec3 rotationToAdd {"label":"Rotation"}
// @input vec3 scaleToAdd {"label":"Scale"}
// @input bool applyRotation = false {"label":"Add Path Rotation"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Path Customization"}
// @input bool customPath = false
// @input float removeFrameAmount = 1.0 {"label":"Resolution", "widget":"slider", "min":0.0, "max":1.0, "step":0.1, "showIf": "customPath"}
// @input float smoothingAmount = 0.0 {"label":"Smoothing", "widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf": "customPath"}
// @input float randPosValue = 0.0 {"label":"Randomness", "widget":"slider", "min":0.0, "max":10.0, "step":0.01, "showIf": "customPath"}
// @input float startOffset = 0.0 {"label":"Start Offset", "widget":"slider", "min":0.0, "max":0.99, "step":0.01, "showIf": "customPath"}
// @input float endOffset = 1.0 {"label":"End Offset", "widget":"slider", "min":0.01, "max":1.0, "step":0.01, "showIf": "customPath"}
//@ui {"widget":"group_end"}


var pathData;
var childObject = [];
var thisSceneObject;
var childCount;

function onLensTurnOn()
{
    getChildObjects();
    if(childObject.length == 0)
    {
        return;
    }
    getPathData();
    placeObjectsOnPath();
    configureTransform();
}

function getPathData()
{
    if(script.customPath)
    {
        pathData = global.pathDataManager.createPathData({
            startOffset: script.startOffset,
            endOffset: script.endOffset,
            frameResolution: script.removeFrameAmount,
            smoothingAmount: script.smoothingAmount,
            randomizeValue: script.randPosValue
        });
    }
    else
    {
        pathData = global.pathDataManager.createPathData();
    }
}

function getChildObjects()
{
    thisSceneObject = script.getSceneObject();
    childCount = thisSceneObject.getChildrenCount();

    if(childCount == 0)
    {
        print("PlaceObjectsOnPath:, ERROR: No Children found in  " + script.getSceneObject().name);
    }
    else
    {
        for(var i = 0; i < childCount; i++)
        {
            childObject[i] = thisSceneObject.getChild(i);
        }
    }
}

function placeObjectsOnPath()
{
    if(script.objectDistribution == "count")
    {
        countPopulate();
    }
    else
    {
        distancePopulate();
    }
}

function countPopulate()
{
    var length = pathData.length - 1;
    var pathIndex = 0;
    var ratio = Math.floor(length / script.objectCount);

    for(var i = 0; i < script.objectCount; i++)
    {
        if (pathIndex >= length) 
        {
            pathIndex -= length;
        }

        var index = getIndex(i, childCount);

        if(i >= childCount)
        {
            childObject.push(thisSceneObject.copyWholeHierarchy(childObject[index]));
            index = childObject.length - 1;
        }

        childObject[index].getTransform().setWorldPosition(pathData[pathIndex].position);

        if(script.applyRotation)
        {
            childObject[index].getTransform().setWorldRotation(pathData[pathIndex].rotation);
        }

        pathIndex += ratio;
    }

    if(childCount > script.objectCount)
    {
        for (var i = script.objectCount; i < childCount; i++)
        {
            childObject[i].enabled = false;
        }
    }

}

function distancePopulate()
{
    var previousPos = null;
    var objectIndex = 0;
    var rawPath = global.pathDataManager.getRawPathData();

    if(rawPath == null)
    {
        return;
    }

    var ratio = pathData.length / rawPath.length;

    if(rawPath == null)
    {
        return;
    }

    for(var i = 0; i < rawPath.length; i++)
    {
        var rawData = rawPath[i];
        if (!previousPos || previousPos.distance(rawData.position) >= script.objectDistance)
        {
            var smoothedIndex = i * ratio;

            var index = getIndex(objectIndex, childCount);
            if(objectIndex > childCount)
            {
                childObject.push(thisSceneObject.copyWholeHierarchy(childObject[index]));
                index = childObject.length - 1;
            }

            var smoothedPosition = global.pathDataManager.getEasedPosition(pathData, smoothedIndex);
            childObject[index].getTransform().setWorldPosition( smoothedPosition );
            if(script.applyRotation)
            {
                var smoothedRotation = global.pathDataManager.getEasedRotation(pathData, smoothedIndex);
                childObject[index].getTransform().setWorldRotation(smoothedRotation);
            }
            previousPos = rawData.position;
            objectIndex++;
        }
    }
}

function getIndex(count, length)
{
    return count % length;
}

function configureTransform()
{
    for(var i = 0; i < childObject.length; i++)
    {
        if (childObject[i]) 
        {
            var transform = childObject[i].getTransform();
            var offsetTo = transform.getLocalPosition().add(script.positionToAdd);
            var curEuler = transform.getLocalRotation().toEulerAngles();
            curEuler = curEuler.sub(script.rotationToAdd);
            var rotateTo = quat.fromEulerVec(curEuler);
            var scaleTo = transform.getLocalScale().mult(script.scaleToAdd);
            transform.setLocalPosition(offsetTo);
            transform.setLocalRotation(rotateTo);
            transform.setLocalScale(scaleTo);
        }
    }
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);