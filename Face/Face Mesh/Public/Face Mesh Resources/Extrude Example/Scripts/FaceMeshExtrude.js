// -----JS CODE-----
// FaceMeshExtrude.js
// Version: 0.0.1
// Event: Initialized
// Description: A helper script that allows you to duplicate and offset the child objects

// @input vec3 extrudeDirection
// @input int copies {"label":"Count", "widget":"slider", "min":1, "max":10, "step":1}

var duplicatedObjects = [];

initialized();

function initialized()
{
    if(script.copies > 1 && checkInputValues())
    {
        createCopies(script.copies);
        extrude(script.extrudeDirection);
    }
}

function createCopies(count)
{
    var thisSceneObject = script.getSceneObject();
    var childCount = thisSceneObject.getChildrenCount();

    for (var i = 0; i < count; i++)
    {
        var childIndex = getIndex(i, childCount);

        if( i < childCount)
        {
            duplicatedObjects[i] = thisSceneObject.getChild(childIndex);
        }
        else
        {
            duplicatedObjects[i] = thisSceneObject.copyWholeHierarchy(thisSceneObject.getChild(childIndex));
        }
    }

    if(childCount > count)
    {
        for (var i = count; i < childCount; i++)
        {
            thisSceneObject.getChild(i).enabled = false;
        }
    }
}

function extrude(dir)
{
    var curPos = vec3.zero();
    for(var i = 0; i < duplicatedObjects.length; i++)
    {
        var meshPosition =  duplicatedObjects[i].getTransform().getLocalPosition();
        meshPosition = curPos;
        duplicatedObjects[i].getTransform().setLocalPosition(meshPosition);
        curPos = curPos.add(dir);
    }
}

function getIndex(count, max)
{
    var objectIndex = count % max;
    return objectIndex;
}

function checkInputValues()
{
    var thisSceneObject = script.getSceneObject();
    var childCount = thisSceneObject.getChildrenCount();

    if(childCount == 0)
    {
        print("FaceMeshExtrude, ERROR: No Children found in  " + thisSceneObject.name);
        return false;
    }

    return true;
}
