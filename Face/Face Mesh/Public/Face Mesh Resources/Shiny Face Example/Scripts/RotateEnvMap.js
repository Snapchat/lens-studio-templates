// -----JS CODE-----
// RotateEnvMap.js
// Version: 0.0.1
// Event: Initialized
// Description: A helper script that allows you to rotate an environment map based on a time

// @input float duration = 5.00
// @input int loopCount = -1

// @input bool advanced = false
// @input Component.LightSource envMap {"showIf": "advanced"}

var isFading = false;
var timeStartedFading;
var startingValue;
var endingValue;
var loopCount = 0;

initialized();

function initialized()
{
    if(checkInputValues())
    {
        startMoving();
    }
}

function startMoving()
{
    isFading = true;
    timeStartedFading = getTime();
    startingValue = 0;
    endingValue = 360;
}

function onUpdate()
{
    if(isFading)
    {
        var timeSinceStarted = getTime() - timeStartedFading;
        var percentageComplete = timeSinceStarted / script.duration;
        var transition = lerp(startingValue,endingValue,percentageComplete);
        script.envMap.envmapRotation = transition;
        
        if(percentageComplete >= 1.0)
        {
            loopCount++;
            if(loopCount == script.loopCount)
            {
                isFading = false;
            }
            else
            {
                startMoving();
            }
        }
    }
}

function lerp(a, b, t)
{
    return a + t * (b - a);
}

function checkInputValues()
{
    if( !script.envMap )
    {
        print( "RotateEnvMap, ERROR: Make sure the Env Map light object exists and set under the Advanced checkbox" );
        return false;
    }
    
    if( script.loopCount == 0)
    {
        return false;
    }
    
    return true;
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
    