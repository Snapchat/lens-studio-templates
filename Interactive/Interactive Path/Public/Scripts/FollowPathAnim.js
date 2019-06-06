// FollowPathAnim.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Moves an object along a drawn path and plays an animation at the same time

//  @ui {"widget": "group_start", "label": "Path Animation Settings"}
    //  @input Component.ScriptComponent idleAnimScript
    //  @input string PathAnimLayer
    //  @input string ArriveAnimLayer
//  @ui {"widget": "group_end"}

//  @ui {"widget": "group_start", "label": "Path Move Settings"}
    //  @input Component.MeshVisual drawingObject
    //  @input Asset.Material drawingCurveMaterial
    //  @input Asset.Material finalCurveMaterial
    //  @input Component.ManipulateComponent followObject
    //  @input SceneObject trackerObject
    //  @input float moveSpeed = 10.0
    //  @input SceneObject sceneCamera
//  @ui {"widget": "group_end"}

//  @ui {"widget": "group_start", "label": "Path Audio Settings"}
    //  @input Asset.AudioTrackAsset followAudio
    //  @input Asset.AudioTrackAsset arriveAudio
    //  @input Asset.AudioTrackAsset pathDrawAudio
//  @ui {"widget": "group_end"}

//Establish existence of key variables
if(!script.drawingObject){
    print("Follow Path Anim: Drawing object is undefined please correct.");
    return;
}
else if(!script.drawingCurveMaterial){
    print("Follow Path Anim: Drawing curve material is undefined please correct.");
    return;
}
else if(!script.finalCurveMaterial){
    print("Follow Path Anim: Final curve material is undefined please correct.");
    return;
}
else if(!script.followObject){
    print("Follow Path Anim: Follow object is undefined please correct.");
    return;
}
else if(!script.trackerObject){
    print("Follow Path Anim: Follow object is undefined please correct.");
    return;
}

// Define touch blocking
global.touchSystem.touchBlocking = true;
global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", true);
global.touchSystem.enableTouchBlockingException("TouchTypeTap", true);

// Set material for the drawing object to the starting material
script.drawingObject.mainMaterial = script.drawingCurveMaterial;

// Value used by TapAnim.js for status of arrival logic
script.api.inArrival = false;

// Touch and mesh vars
var screenPoint = vec3.zero();      // Last known screen touch point
var pointCounter = 0;               // Counter for drawn surface points
var lastPoint = vec3.zero();        // Last drawn point
var lineComplete = false;           // Drawing has completed bool
var inIdle = true;                  // Is the object currently idling
var canIdle = false;                // Bool to check if object can move back into idle
var arrivalStartTime = 0.0;         // Current scene time when arrival began
var drawing = false;                // Bool to check if we're currently drawing a path
var frameBuffer = 0;                // A counter used to give us time to begin drawing the path
var touchingCharacter = false;      // Are we touching the character object
var touchMoveBuffer = 0;            // As we start to draw we need to buffer a few frames to determine if we actually drawing or just a small touch
var curvedPointVal = undefined;     // Our current curved path point
var startTime = 0.0;                // The current start time reset each time we need reference to a new start time
var currTime = getTime();           // The current script time
var timeVal = 0.0;                  // The current resulting time of startTime - currTime
var fadePath = false;               // A bool to check if we can start fading down drawn path
var touches = [];

//Audio
var audioComponentFollow = null;
var audioComponentArrive = null;
var audioComponentPathDraw = null;

// Move vars
var currMovePoint = 0;              // Reference index to our current destination point from array of points
const POINT_COUNTER_MAX = 50;       // Maximum number of points a user can draw
var movePoints = [];                // Array of move points

// Builds a quad mesh and applies it to meshVisual component
var builder = new MeshBuilder([
    { name: "position", components: 3 },
    { name: "normal", components: 3, normalized: true },
    { name: "texture0", components: 2 },
    { name: "color", components: 4 },
]);

builder.topology = MeshTopology.Triangles;
builder.indexType = MeshIndexType.UInt16;

// Setup the audio component if audio track defined
function audioSetup()
{
    if(script.followAudio && !audioComponentFollow)
    {       
        audioComponentFollow = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentFollow.audioTrack = script.followAudio;
    }  
    
    if(script.arriveAudio && !audioComponentArrive)
    {       
        audioComponentArrive = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentArrive.audioTrack = script.arriveAudio;
    }      

    if(script.pathDrawAudio && !audioComponentPathDraw)
    {       
        audioComponentPathDraw = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentPathDraw.audioTrack = script.pathDrawAudio;
    }  
}

audioSetup();

function playAnimAudio(audioComponent, loops)
{ 
    if(audioComponent)
        audioComponent.play( loops );  
}

function playLoopingAudio(audioComponent)
{
    if(audioComponent)
    {
        if(audioComponent.isPaused())
        {
            audioComponent.resume();
        }
        else
        {
            audioComponent.play(-1);
        }
    }    
}

function stopAnimAudio(audioComponent)
{  
    if(audioComponent)
        audioComponent.stop(false);        
}

function stopLoopingAudio(audioComponent)
{
    if(audioComponent)
        audioComponent.pause();
}

// Bezier Curve Function
function curvedPoint(points, delta)
{
    var curvePoint = vec3.zero();
    var newPoints = points;       
     
    for(var x=0; x < points.length - 2; x++)
    {
        var tempPoints = [];
        for(var i=0; i < newPoints.length - 1; i++)
        {
            var point1 = newPoints[i];
            var point2 = newPoints[i+1];
            var newPoint = vec3.lerp(point1, point2, delta);
            tempPoints.push(newPoint);
        }
        newPoints = tempPoints;
    }
    
    curvePoint = vec3.lerp(newPoints[0], newPoints[1], delta);
    return curvePoint;
}

// Curve length function
function getCurveLength(points)
{
    var length = 0.0;
    var chordLength = points[0].distance(points[points.length - 1]);
    for(var i=0; i<points.length - 1; i++)
    {
        length += points[i].distance(points[i+1]);         
    }
    return (length + chordLength) / 2.0;
}

// Function for drawing each quad for mesh where path is created
function drawQuad(centerPos, transform)
{
    if(!global.scene.isRecording())
    {
        fadePath = false;

        var left = centerPos.x - 3;
        var right = centerPos.x + 3;
        var top = centerPos.z + 3;
        var bottom = centerPos.z - 3;  
        
        var colorVal = new vec3(1,1,1);
    
        var v1 = centerPos.add(transform.forward.uniformScale(3.0)).add(transform.right.uniformScale(-3.0));
        var v2 = centerPos.add(transform.forward.uniformScale(-3.0)).add(transform.right.uniformScale(-3.0));
        var v3 = centerPos.add(transform.forward.uniformScale(-3.0)).add(transform.right.uniformScale(3.0));
        var v4 = centerPos.add(transform.forward.uniformScale(3.0)).add(transform.right.uniformScale(3.0));
        builder.appendVerticesInterleaved([
            // Position                     Normal      UV      Color                                  Index
            v1.x, centerPos.y, v1.z,         0, 0, 1,    0, 1,  colorVal.x,colorVal.y,colorVal.z,0,    // 0
            v2.x, centerPos.y, v2.z,         0, 0, 1,    0, 0,  colorVal.x,colorVal.y,colorVal.z,0,    // 1   
            v3.x, centerPos.y, v3.z,         0, 0, 1,    1, 0,  colorVal.x,colorVal.y,colorVal.z,0,    // 2
            v4.x, centerPos.y, v4.z,         0, 0, 1,    1, 1,  colorVal.x,colorVal.y,colorVal.z,0,    // 3         
        ]);
    
        var startIndex = (pointCounter-1) * 4;
        builder.appendIndices([
            0 + startIndex, 1 + startIndex, 2 + startIndex, // First Triangle
            2 + startIndex, 3 + startIndex, 0 + startIndex, // Second Triangle
        ]);
        
        if(builder.isValid()){
            script.drawingObject.mesh = builder.getMesh();
            builder.updateMesh();
        }
        else{
            print("Follow Path Anim: Mesh data invalid!");
        }
    }    
}

function touchMove(eventData)
{
    touches.push(eventData);
}
var movePointEvent = script.createEvent("TouchMoveEvent");
movePointEvent.bind(touchMove);

// Util function for getting a user's touch position for path data
function getTouchPos(updateData)
{ 
    if(touches.length == 0)
    {
        return;
    }

    var eventData = touches[0];
    touchMoveBuffer++;

    if(!touchingCharacter && !lineComplete && touchMoveBuffer > 3)
    {
        drawing = true;

        if(script.followObject.getSceneObject().getComponentCount("Component.TouchComponent") > 0)
        {
            script.followObject.getSceneObject().getFirstComponent("Component.TouchComponent").enabled = false;
        }

        var touchPos = eventData.getTouchPosition();
        var intersectManipFrame = script.followObject.intersectManipulateFrame(touchPos);
        if(intersectManipFrame && intersectManipFrame.isValid())
        {       
            screenPoint = intersectManipFrame.getIntersectionPoint(); 
            
            var distFromLast = screenPoint.distance(lastPoint);
            if(distFromLast > 11.0 && pointCounter < POINT_COUNTER_MAX)
            {
                movePoints.push(screenPoint);           
    
                script.trackerObject.getTransform().setWorldPosition(screenPoint);
                if(movePoints.length > 1)
                {
                    var vecRot = movePoints[pointCounter].sub(movePoints[pointCounter - 1]).normalize();
                    var rotation = quat.lookAt(new vec3(vecRot.x, script.trackerObject.getTransform().getWorldPosition().y, vecRot.z), script.trackerObject.getTransform().up);
                    script.trackerObject.getTransform().setWorldRotation(rotation);
                }    
    
                if(pointCounter > 0)
                {
                    drawQuad(screenPoint, script.trackerObject.getTransform());  
                    playAnimAudio(audioComponentPathDraw, 1);
                }
                            
                lastPoint = screenPoint;           
                pointCounter++;
            }            
        }
    } 
    
    touches = [];
}

function touchStart(eventData)
{  
    if(!inIdle && !script.api.inArrival)
    {
        if(script.idleAnimScript != null && script.idleAnimScript.api.animMixer != null)
        {
            script.idleAnimScript.api.animMixer.stop(script.PathAnimLayer);    
            script.idleAnimScript.api.animMixer.setWeight(script.PathAnimLayer, 0.0);  
            script.idleAnimScript.api.animMixer.stop(script.ArriveAnimLayer);    
            script.idleAnimScript.api.animMixer.setWeight(script.ArriveAnimLayer, 0.0); 
            stopLoopingAudio(audioComponentFollow);
            stopAnimAudio(audioComponentArrive);
            script.idleAnimScript.api.idleAnimInitFunc();
            inIdle = true;
            script.api.inArrival = false;
            canIdle = false;
        }   
    }  
    
    if(lineComplete)
    {
        resetDrawingVars(eventData);  
        fadePath = false;
        clearMesh();
    }     
}
var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(touchStart);

function touchEnd(eventData)
{
    touchMoveBuffer = 0;
    if(drawing)
    {
        script.drawingObject.mainMaterial = script.finalCurveMaterial;
        var tempArray = [];        
        var currentPos = script.followObject.getTransform().getWorldPosition();        
        currentPos = currentPos.add(script.followObject.getTransform().forward.uniformScale(1.0));        
        var distToStart = movePoints[0].distance(currentPos);
        var dropIncrement = Math.floor(distToStart);
        var normVec = movePoints[0].sub(currentPos).normalize();
        for(var i=0; i<dropIncrement; i+=15)
        {
            tempArray.push(currentPos.add(normVec.uniformScale(i)));
        }        
       
        for(var i=0; i<movePoints.length; i++)
        {
            tempArray.push(movePoints[i]);
        }
        movePoints = tempArray;         

        timeVal = (getCurveLength(movePoints) / script.moveSpeed);
        lineComplete = true;
        drawing = false;        
        if(movePoints.length > 0 && inIdle)
        { 
            // Play the movement anim and stop the idle anim
            inIdle = false;
            stopAllAnims();
            if(script.idleAnimScript != null && script.idleAnimScript.api.animMixer != null && checkAnimExists(script.PathAnimLayer))
            {
                script.idleAnimScript.api.animMixer.start(script.PathAnimLayer, 0, -1);    
                script.idleAnimScript.api.animMixer.setWeight(script.PathAnimLayer, 1.0);    
            } 
            
            // Audio
            stopAnimAudio(audioComponentArrive);            
            stopAnimAudio(audioComponentPathDraw);
            playLoopingAudio(audioComponentFollow);             
            if(script.idleAnimScript.api.idleAnimAudio != null && script.idleAnimScript.api.idleAnimAudio.isPlaying())
            {
                script.idleAnimScript.api.idleAnimAudio.stop(false);
            }
            
        }
    }     
}
var touchEndEvent = script.createEvent("TouchEndEvent");
touchEndEvent.bind(touchEnd);

// Call once every frame
function update(eventData)
{    
    getTouchPos();

    if(drawing)
    {
        disableManipScale(false);
    }
    else
    {
        disableManipScale(true);
    }

    if(global.scene.isRecording())
    {
        script.drawingObject.enabled = false;
    } 
    if(!global.isTouchingObject)
    {
        frameBuffer++;        
    }
    else
    {
        frameBuffer = 0;
    }      
    touchingCharacter = !(frameBuffer > 6);     

    if(lineComplete)
    {
        if(script.followObject.getSceneObject().getComponentCount("Component.TouchComponent") > 0)
        {
            script.followObject.getSceneObject().getFirstComponent("Component.TouchComponent").enabled = true;
        }

        if(movePoints.length > 0)
        { 
            if(curvedPointVal == undefined)
            {
                startTime = getTime();                              
            }  
            currTime = getTime() - startTime;
            if(getTime() - startTime < timeVal)
            {
                // Move character to follow path                
                var normVal = (getTime() - startTime) / timeVal; 

                curvedPointVal = curvedPoint(movePoints, normVal);
                var objPos = script.followObject.getTransform().getWorldPosition();
                var destPoint = new vec3(curvedPointVal.x, script.followObject.getTransform().getWorldPosition().y, curvedPointVal.z);
                script.followObject.getTransform().setWorldPosition(destPoint);  

                // Rotate character to face next point
                var vecToDest = destPoint.sub(objPos).normalize();
                var destRotation = quat.lookAt(vecToDest, script.followObject.getTransform().up);
                var newRotation = quat.slerp(script.followObject.getTransform().getWorldRotation(), destRotation, 0.5);
                script.followObject.getTransform().setWorldRotation(newRotation);                        
            }
            else
            {                                            
                if(!script.api.inArrival && !inIdle)
                {
                    script.api.inArrival = true;
                    canIdle = false;
                    arrivalStartTime = getTime(); 
                    var hasArrival = checkAnimExists(script.ArriveAnimLayer);
                    if(script.idleAnimScript != null && script.idleAnimScript.api.animMixer != null)
                    {
                        script.idleAnimScript.api.animMixer.stop(script.PathAnimLayer);  
                        script.idleAnimScript.api.animMixer.setWeight(script.PathAnimLayer, 0.0); 
                        if(hasArrival)
                        {
                            script.idleAnimScript.api.animMixer.startWithCallback(script.ArriveAnimLayer, 0, 1, arrivalCallback);    
                            script.idleAnimScript.api.animMixer.setWeight(script.ArriveAnimLayer, 1.0);     
                        }                                               
                    } 

                    // Audio
                    stopLoopingAudio(audioComponentFollow);
                    stopAnimAudio(audioComponentPathDraw);
                    playAnimAudio(audioComponentArrive, 1);     
                    fadePath = true;         
                    if(!hasArrival)
                    {
                        arrivalCallback();
                    }     
                }                
            }                        
        }        
    }  
    
    if(fadePath && builder.isValid())
    {
        var newColor = vec4.lerp(script.finalCurveMaterial.mainPass.baseColor, new vec4(1,1,1,0), 0.2);
        script.finalCurveMaterial.mainPass.baseColor = newColor;        
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

// Called at end of path arrival animation
function arrivalCallback()
{
    inIdle = true;
    canIdle = true;   
    curvedPointVal = undefined;   
    if(script.idleAnimScript != null && script.idleAnimScript.api.animMixer != null)
    {
        script.idleAnimScript.api.idleAnimInitFunc(); 
        script.api.inArrival = false; 
    }    
    resetDrawingVars();   
    clearMesh(); 
}

// Resets the drawing data for the path
function resetDrawingVars(eventData)
{
    pointCounter = 0;
    lastPoint = vec3.zero();
    firstTap = true;
    lineComplete = false;
    frameBuffer = 0;
    drawing = false;    
    movePoints = [];
    currMovePoint = 0;  
    touchMoveBuffer = 0;  
    curvedPointVal = undefined; 
    fadePath = false;
    script.finalCurveMaterial.mainPass.baseColor = vec4.one();
    script.drawingObject.mainMaterial = script.drawingCurveMaterial;     
}

function clearMesh()
{    
    if(builder.isValid() && builder.getIndicesCount() > 0)
    {
        builder.eraseIndices(0, builder.getIndicesCount() );
        builder.eraseVertices(0, builder.getVerticesCount() );                
        script.drawingObject.mesh = builder.getMesh();
        builder.updateMesh();         
    }
    else
    {
        print("Follow Path Anim: Mesh data invalid!");
    }
}

// Util function for stopping all playing animations
function stopAllAnims()
{
    if(script.idleAnimScript != null && script.idleAnimScript.api.animMixer != null)
    {
        var animLayers = script.idleAnimScript.api.animMixer.getLayers();
        for(var i=0; i<animLayers.length; i++)
        {
            animLayers[i].stop();
        }   
    }    
}

function disableManipScale(enableVal)
{
    if(script.followObject)
    {
        script.followObject.enableManipulateType(ManipulateType.Scale, enableVal);
    }
}

function checkAnimExists(animName)
{
    var allNames = script.idleAnimScript.api.animMixer.getAnimationLayerNames();
    var isValid = false;
    for(var i=0; i<allNames.length; i++)
    {
        if(allNames[i] == animName)
        {
            isValid = true;
            break;
        }
    }

    return isValid;
}