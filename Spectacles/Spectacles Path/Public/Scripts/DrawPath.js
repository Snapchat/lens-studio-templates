// -----JS CODE-----
// DrawPath.js
// Version: 0.0.1
// Event: Initialized
// Description: This is one of the effectors provided in this template.
// This effector moves content along the path at a configurable speed.

//@ui {"widget":"group_start", "label":"Mesh Customization"}
// @input string meshDirection = "up" {"label":"Orientation", "widget":"combobox", "values":[{"label":"Up", "value":"up"}, {"label":"Down", "value":"down"}, {"label":"Right", "value":"right"}, {"label":"Left", "value":"left"}]}
// @input float meshHeight = 10.0 {"label":"Size"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Texture Customization"}
// @input Asset.Texture meshTexture {"label":"Texture"}
// @input float textureSize {"label":"Repeat", "widget":"slider", "min":0.01, "max":1.00, "step":0.01}
// @input float alphaValue = 0.0 {"label":"Edge Feathering", "widget":"slider", "min":0.0, "max":1.0, "step":0.05}
// @input string textureDirection = "forward" {"label":"Orientation", "widget":"combobox", "values":[{"label":"Forward", "value":"forward"}, {"label":"Backward", "value":"backward"}, {"label":"Right", "value":"right"}, {"label":"Left", "value":"left"}]}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Material Customization"}
// @input Asset.Material meshMaterial {"label":"Material"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Path Customization"}
// @input bool customPath = false
// @input float removeFrameAmount = 1.0 {"label":"Resolution", "widget":"slider", "min":0.0, "max":1.0, "step":0.1, "showIf": "customPath"}
// @input float smoothingAmount = 0.0 {"label":"Smoothing", "widget":"slider", "min":0.0, "max":1.0, "step":0.01, "showIf": "customPath"}
// @input float randPosValue = 0.0 {"label":"Randomness", "widget":"slider", "min":0.0, "max":10.0, "step":0.01, "showIf": "customPath"}
// @input float startOffset = 0.0 {"label":"Start Offset", "widget":"slider", "min":0.0, "max":0.99, "step":0.01, "showIf": "customPath"}
// @input float endOffset = 1.0 {"label":"End Offset", "widget":"slider", "min":0.01, "max":1.0, "step":0.01, "showIf": "customPath"}
//@ui {"widget":"group_end"}

const newPointDistance = 40;
var pathData;
var drawingObject;
var meshTextureAspect = 1;
var bottomCurrentUV = vec2.zero();
var topCurrentUV = vec2.zero();
var builder = new MeshBuilder([
    { name: "position", components: 3 },
    { name: "normal", components: 3, normalized: true },
    { name: "texture0", components: 2 },
    { name: "color", components: 4 },
]);
var meshDir = getMeshDirection();

builder.topology = MeshTopology.TriangleStrip;
builder.indexType = MeshIndexType.UInt16;

function onLensTurnOn()
{
    setPathData();
    createMesh();
}

function setPathData()
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

function createMesh()
{
    var pathToCreate = [];
    drawingObject = script.getSceneObject().createComponent("Component.MeshVisual");
    
    for(var i = 0; i < pathData.length; i++)
    {
        pathToCreate[i] = pathData[i].position;
    }

    var previousPos = null;
    var indices = [];
    var distances = global.pathDataManager.getDistanceData(pathData);
    
    for(var i = 0; i < pathToCreate.length; i++)
    {
        var curPos = pathToCreate[i];
        if (!previousPos || previousPos.distance(curPos) >= newPointDistance)
        {
            indices.push(i);
            previousPos = curPos;
        }
    }

    var totalDistance = distances[indices[indices.length-1]];

    var prev = null;
    for (var j = 0; j < indices.length; j++)
    {
        var inv;
        var ind = indices[j];
        var point = pathToCreate[ind];
        var dist = distances[ind];
        var fadePercent = script.alphaValue;

        if(fadePercent > 0)
        {
            var distToStart = dist;
            var distToEnd = totalDistance - dist;
            var nearestSide = Math.min(distToStart, distToEnd);
            var distRatio = nearestSide / (totalDistance * .5);
            inv = inverseLerp(0, fadePercent * 2, distRatio);
            inv = Math.max(0, Math.min(inv, 1));
            inv *= inv;
        }
        else
        {
            inv = 1;
        }
        
        addQuad(point, prev, inv);
        prev = point;
    }

    buildMesh();
}

function addQuad(pos, previousPos, alpha)
{
    var dist = 0;
    if (previousPos)
    {
        var offset = pos.sub(previousPos);
        offset.y = 0;
        dist = (offset.length * (script.textureSize * 2)) * getTextureDirection();
    }
    setUV(dist);
    var top = pos.add(meshDir.uniformScale(script.meshHeight * 0.5));
    var bottom = pos.add(meshDir.uniformScale(-script.meshHeight * 0.5));

    builder.appendVerticesInterleaved([
        // Position                       Normal       UV                                       Color              Index
        bottom.x, bottom.y, bottom.z,     0, 0, 1,     topCurrentUV.x, topCurrentUV.y,          1, 1, 1, alpha,    // 0
        top.x, top.y, top.z,              0, 0, 1,     bottomCurrentUV.x, bottomCurrentUV.y,    1, 1, 1, alpha,    // 1
    ]);

    var startIndex = builder.getIndicesCount();
	builder.appendIndices([
	    0 + startIndex, 1 + startIndex,
	]);
}

function buildMesh()
{
    if(builder.isValid())
    {
        drawingObject.mesh = builder.getMesh();

        if(script.meshMaterial)
        {
            drawingObject.mainMaterial = script.meshMaterial;
        }

        if(script.meshTexture)
        {
            drawingObject.mainMaterial.mainPass.baseTex = script.meshTexture;
            meshTextureAspect = script.meshTexture.control.getAspect();
        }

        builder.updateMesh();
    }
    else
    {
        print("DrawPath, ERROR: Mesh data invalid!");
    }
}

function inverseLerp(min, max, value)
{
    return (value-min) / (max-min);
}

function getMeshDirection()
{

    switch(script.meshDirection) 
    {
        case "right":
            return script.getTransform().up;
        case "left":
            return script.getTransform().down;
        case "up":
            return script.getTransform().right;
        case "down":
            return script.getTransform().left;
      }

}

function setUV(dist)
{
    if(script.textureDirection == "forward" || script.textureDirection == "backward")
    {
        topCurrentUV.x += (dist / script.meshHeight) / meshTextureAspect;
        topCurrentUV.y = 0;
        bottomCurrentUV.x += (dist / script.meshHeight) / meshTextureAspect;
        bottomCurrentUV.y = 1;
    }
    else if(script.textureDirection == "right")
    {
        topCurrentUV.x = 0;
        topCurrentUV.y += (dist / script.meshHeight) / meshTextureAspect;
        bottomCurrentUV.x = 1;
        bottomCurrentUV.y += (dist / script.meshHeight) / meshTextureAspect;
    }
    else
    {
        topCurrentUV.x = 1;
        topCurrentUV.y += (dist / script.meshHeight) / meshTextureAspect;
        bottomCurrentUV.x = 0;
        bottomCurrentUV.y += (dist / script.meshHeight) / meshTextureAspect;
    }
}

function getTextureDirection()
{
    if(script.textureDirection == "backward")
    {
        return -1;
    }
    else
    {
        return 1;
    }
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);