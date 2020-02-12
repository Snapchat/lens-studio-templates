// -----JS CODE-----
// PathDataManager.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that gets the camera path data from device tracking component.
// This script also adds helper functions to global.pathDataManager to help with accessing path data.

// @input string ifStatic = "virtualPath" {"label":"On Static Video", "widget":"combobox", "values":[{"label":"Create Virtual Path", "value":"virtualPath"}, {"label":"Do Nothing", "value":"nothing"}]}
// @input bool advanced
//@ui {"widget":"group_start", "label":"Advanced Customization", "showIf": "advanced"}
// @input Component.DeviceTracking tracking {"label":"Device Tracking"}
//@ui {"widget":"group_end"}

var pathData;
var pathIndex;
var pathIndexExist = false;
var leastCameraMove = 500;
var getPathFromCamera = getRawPathDataFromCamera();

function onLensTurnOn()
{
    if(checkInputValues())
    {
        pathData = getPathFromCamera();
    }
}

function onUpdate()
{
    if(pathIndexExist)
    {
        pathIndex = script.tracking.getDevicePathIndex();
    }
}

function copyIndexData(original)
{
    return {
        position: original.position.uniformScale(1),
        rotation: original.rotation.multiply(quat.quatIdentity()),
    }
}

function createPathData(option)
{
    var customPath = [];

    if(pathData == null || pathData.length <= 1)
    {
        // If camera path data not found
        customPath = createStraightPath();
        return customPath;
    }

    if(!isCameraPathMoving(leastCameraMove) && script.ifStatic == "virtualPath")
    {
        // If camera is not moving beyond the border
        customPath = createPathBasedOnCamera();
        return customPath;
    }

    if(option == null)
    {
        // returns copy of the actual raw path data
        for (var i = 0; i < pathData.length; i++)
        {
            customPath[i] = copyIndexData(pathData[i]);
        }
        return customPath;
    }

    // setting the start and end offset
    var start = Math.round(option.startOffset * pathData.length);
    var end = Math.round(option.endOffset * pathData.length);

    // setting the frame reduction
    var amountOfFrameToRemove = Math.round((1 - option.frameResolution) * 10);
    if(amountOfFrameToRemove != 0)
    {
        // With frame reduction
        var biggerValue = (start > end)? start : end;
        var lowerValue = (start < end)? start : end;

        var counter = 0;
        for(var i = lowerValue; i < biggerValue; i += amountOfFrameToRemove )
        {
            customPath[counter] = copyIndexData(pathData[i]);
            counter++;
        }
    }
    else
    {
        // Without frame reduction
        var frameAmount = end - start;
        var counter = 0;

        if(frameAmount > 0)
        {
            counter = start;
        }
        else
        {
            frameAmount = frameAmount * -1;
            counter = end;
        }

        for(var i = 0; i < frameAmount; i++)
        {
            customPath[i] = copyIndexData(pathData[counter]);
            counter++;
        }
    }

    setSmoothPath(customPath, option.smoothingAmount, option.randomizeValue);

    return customPath;
}

function isCameraPathMoving(cameraMoveAmount)
{
    // This will check if user is moving above the border that we set with leastCameraMove
    // In other words, it checks if there's not enough movement to form a good path
    var cameraMoveDistance = getDistanceData(pathData);
    var isMoving = cameraMoveDistance[cameraMoveDistance.length - 1] > cameraMoveAmount;
    return isMoving;
}

function createStraightPath()
{
    var virtualPath = [];
    var cameraZPosition = -script.getTransform().getWorldPosition().z;
    for(var i = 0; i < 606; i++)
    {
        var virtualPos = new vec3(0, 80, cameraZPosition);
        cameraZPosition += .5;
        virtualPath[i] ={
            position: virtualPos,
            rotation: quat.quatIdentity()
        };
    }
    return virtualPath;
}

function createPathBasedOnCamera()
{
    // Then it will create a virtual path based on the camera's direction
    var virtualPath = [];
    var dist = 20;

    var mathHelper = global.scene.createSceneObject("mathHelper").getTransform();
    var helper2 = global.scene.createSceneObject("mathHelper2").getTransform();
    helper2.getSceneObject().setParent(mathHelper.getSceneObject());

    for(var i = 0; i < pathData.length; i++)
    {
        helper2.setLocalPosition(new vec3(0, 0, -dist));
        dist += .5;
        mathHelper.setWorldPosition(pathData[i].position);
        mathHelper.setWorldRotation(pathData[i].rotation);
        var newWorldPos = helper2.getWorldPosition();

        virtualPath[i] ={
            position: newWorldPos,
            rotation: pathData[i].rotation
        };
    }

    mathHelper.getSceneObject().destroy();
    return virtualPath;
}

function setSmoothPath(array, smoothValue, randValue)
{
    var pointsLength = array.length;

    for(var i = 0; i < pointsLength - 2; i++)
    {
        array[i].position = getBezierPoint(
            array[i].position,
            array[i + 1].position,
            array[i + 2].position,
            smoothValue + randValue
        );
    }

}

function getBezierPoint(p0, p1, p2, t)
{
    return vec3.lerp(vec3.lerp(p0, p1, t), vec3.lerp(p1, p2, t), t);
}

function getDistanceData(array)
{
    var ret = [0];
    var totalDist = 0;
    var lastPos = array[0].position;
    for(var i=1; i<array.length; i++)
    {
        var nextPos = array[i].position;
        totalDist += lastPos.distance(nextPos);
        ret[i] = totalDist;
        lastPos = nextPos;
    }
    return ret;
}

function getEasedPosition(array, index)
{
    return getEasedValue(array, index, getPositionAtIndex, vecLerp, array.length);
}

function getEasedRotation(array, index)
{
    return getEasedValue(array, index, getRotationAtIndex, quatSlerp, array.length);
}

function getEasedValue(array, index, getterFunc, easeFunc, length)
{
    if (index <= 0) 
    {
        return getterFunc(array, 0);
    }
    if (index >= length-1) 
    {
        return getterFunc(array, length-1);
    }
    var fract = index % 1;
    var ind = Math.trunc(index);
    var prev = getterFunc(array, ind);
    var next = getterFunc(array, ind + 1);
    return easeFunc(prev, next, fract);
}

function getPositionAtIndex(array, index)
{
    return array[index].position;
}

function getRotationAtIndex(array, index)
{
    return array[index].rotation;
}

function vecLerp(a, b, t)
{
    return vec3.lerp(a, b, t);
}

function quatSlerp(a, b, t)
{
    return quat.slerp(a, b, t);
}

function getRawPathDataFromCamera()
{
    var rawPathData;

    function getSpectaclesData()
    {
        var transforms;
        transforms = script.tracking.getDevicePath();

        if (transforms && transforms.length != 0)
        {
            var result = transforms.map(function(transform)
            {
                var t =
                {
                    "position": transform.getPosition(),
                    "rotation": transform.getRotation(),
                };

                return t;
            });
            
            pathIndexExist = true;
            return result;
        }
    }

    return function()
    {
        if (!rawPathData)
        {
            var spectaclesData = getSpectaclesData();
            if (spectaclesData)
            {
                rawPathData = spectaclesData;
            } 
            else
            {
                print("PathDataManager, ERROR: Camera path data not found. Try to switch to Spectacle's preview videos");
            }

        }
        return rawPathData;
    }
}

function getRawPathData()
{
    return pathData;
}

function getPathIndex()
{
    return pathIndex;
}

function checkInputValues()
{
    if( !script.tracking )
    {
        print( "PathDataManager, ERROR: Please assign Camera object to the script under the advanced checkbox." );
        return false;
    }
    return true;
}

global.pathDataManager = {
    createPathData: createPathData,
    getRawPathData: getRawPathData,
    getPathIndex: getPathIndex,
    getEasedPosition: getEasedPosition,
    getEasedRotation: getEasedRotation,
    getDistanceData: getDistanceData,
};

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);