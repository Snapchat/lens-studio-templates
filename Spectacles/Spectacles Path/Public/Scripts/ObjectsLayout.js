// -----JS CODE-----
// ObjectsLayout.js
// Version: 0.0.1
// Event: Initialized
// Description: This is one of the effectors provided in this template.
// This effector lets you automatically layout content in a circular or rectangular shape.

// @input string layoutType = "circle" {"label":"Layout Type", "widget":"combobox", "values":[{"label":"Circle", "value":"circle"}, {"label":"Rectangle", "value":"rectangle"}]}
//@ui {"widget":"group_start", "label":"Circle Layout Customization", "showIf": "layoutType", "showIfValue":"circle" }
// @input int circleObjectCount = 8 {"label":"Count", "widget":"slider", "min":0, "max":20, "step":1}
// @input int radiusX = 100
// @input int radiusY = 100
//@ui {"widget":"group_end"}
//@ui {"widget":"group_start", "label":"Rectangle Layout Customization", "showIf": "layoutType", "showIfValue":"rectangle" }
// @input int rectObjectCountX = 3 {"label":"Width Count", "widget":"slider", "min":1, "max":20, "step":1}
// @input int rectObjectCountY = 3 {"label":"Height Count", "widget":"slider", "min":1, "max":20, "step":1}
// @input int rectWidth = 80 {"label":"Width"}
// @input int rectHeight = 80 {"label":"Height"}
//@ui {"widget":"group_end"}

var duplicatedObjects = [];

initialized();

function initialized()
{
    if(checkInputValues())
    {
        doLayout();
    }
}

function doLayout()
{
    switch(script.layoutType)
    {
        case "circle":
            createObjects(script.circleObjectCount);
            layoutInCircle(duplicatedObjects);
          break;
        case "rectangle":
            var objectCount = getRectangleEdgeCount(script.rectObjectCountX, script.rectObjectCountY);
            createObjects(objectCount);
            layoutInRect(duplicatedObjects, script.rectWidth, script.rectHeight, script.rectObjectCountX, script.rectObjectCountY);
          break;
      }
}

function createObjects(count)
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

function layoutInCircle(objectToLayout)
{
    for (var pointNum = 0; pointNum < script.circleObjectCount; pointNum++)
    {
        var objectIndex = getIndex(pointNum, duplicatedObjects.length);
        var i = pointNum / script.circleObjectCount;
        var angle = i * Math.PI * 2;

        var x = Math.sin(angle) * script.radiusX;
        var y = Math.cos(angle) * script.radiusY;

        var curPos = new vec3(x, y, 0);

        objectToLayout[objectIndex].getTransform().setLocalPosition(curPos);
    }
}

function layoutInRect(objectToLayout, width, height, countX, countY)
{
    var counter = 0;
    var points = getPointsAroundRectangle(countX, countY);

    for (var i = 0; i < points.length; i++)
    {
        var objectIndex = getIndex(counter, duplicatedObjects.length);
        var x = remap(0, countX - 1, -width * 0.5, width * 0.5, points[i].x);
        var y = remap(0, countY - 1, -height * 0.5, height * 0.5, points[i].y);

        var curPos = new vec3(x, y, 0);
        objectToLayout[objectIndex].getTransform().setLocalPosition(curPos);
        counter++;
    }
}

function getIndex(count, max)
{
    var objectIndex = count % max;
    return objectIndex;
}

function getRectangleEdgeCount(x, y)
{
    var count = (x * 2) + (y * 2) - 4;

    if(count == 0)
    {
        count = 1;
    }

    return count;
}

function getPointsAroundRectangle(width, height)
{
    var points = [];

    var w = 0;
    var h = 0;

    // Placing top side points
    h = 0;
    for (w = 0; w < width; w++)
    {
        points.push(new vec3(w, h, 0));
    }

    // Placing right side points
    w = width-1;
    for (h = 1; h < height; h++)
    {
        points.push(new vec3(w, h, 0));
    }

    if (height > 1)
    {
        // Placing bottom side points
        h = height-1;
        for (w = width-2; w >= 0; w--)
        {
            points.push(new vec3(w, h, 0));
        }
    }

    if (width > 1)
    {
        // Placing left side points
        w = 0;
        for (h = height-2; h > 0; h--)
        {
            points.push(new vec3(w, h, 0));
        }
    }

    return points;
}

function inverseLerp(min, max, value)
{
    return (value-min) / (max-min);
}

function lerp(min, max, value)
{
    return (max-min) * value + min;
}

function remap(inMin, inMax, outMin, outMax, value)
{
    return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

function checkInputValues()
{
    var thisSceneObject = script.getSceneObject();
    var childCount = thisSceneObject.getChildrenCount();

    if(childCount == 0)
    {
        print("ObjectsLayout:, ERROR: No Children found in  " + thisSceneObject.name);
        return false;
    }

    return true;
}

