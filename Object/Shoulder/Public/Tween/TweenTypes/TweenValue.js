// TweenValue.js
// Version: 0.0.5
// Event: Any Event
// Description: Runs a tween on a generic data type
// ----- USAGE -----
// Attach this script as a component after the Tween Manager script on either the same scene object or in a lower scene object in the Objects Panel.
//
// Obtain the current value of this Tween while it is playing using the Tween Manager
// -----------------

//@input string tweenName
//@input bool playAutomatically = true
//@input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
//@ui {"widget":"separator"}
//@input int dataType = 0 {"widget":"combobox", "values":[{"label":"Int", "value": 0 }, {"label":"Float", "value": 1}, {"label":"Vec2", "value": 2}, {"label":"Vec3", "value": 3}, {"label":"Vec4", "value": 4}]}
//@input int startInt = 0 {"showIf": "dataType", "showIfValue": 0, "label":"Start"}
//@input int endInt = 0 {"showIf": "dataType", "showIfValue": 0, "label":"End"}
//@input float startFloat = 0 {"showIf": "dataType", "showIfValue": 1, "label":"Start"}
//@input float endFloat = 0 {"showIf": "dataType", "showIfValue": 1, "label":"End"}
//@input vec2 startVector2 = {0,0} {"showIf": "dataType", "showIfValue": 2, "label":"Start"}
//@input vec2 endVector2 = {0,0} {"showIf": "dataType", "showIfValue": 2, "label":"End"}
//@input vec3 startVector3 = {0,0,0} {"showIf": "dataType", "showIfValue": 3, "label":"Start"}
//@input vec3 endVector3 = {0,0,0} {"showIf": "dataType", "showIfValue": 3, "label":"End"}
//@input vec4 startVector4 = {0,0,0,0} {"showIf": "dataType", "showIfValue": 4, "label":"Start"}
//@input vec4 endVector4 = {0,0,0,0} {"showIf": "dataType", "showIfValue": 4, "label":"End"}
//@input float time = 1.0
//@input float delay = 0.0

//@ui {"widget":"separator"}
//@input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
//@input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}

// Setup the external API
script.api.tweenObject = script.getSceneObject();
script.api.tweenType = "value";
script.api.tweenName = script.tweenName;
script.api.time = script.time;
script.api.startTween = startTween;
script.api.resetObject = resetObject;
script.api.tween = null;
script.api.setupTween = setupTween;
script.api.setupTweenBackwards = setupTweenBackwards;
script.api.updateToStart = updateToStart;
script.api.updateToEnd = updateToEnd;
script.api.loopType = script.loopType;
script.api.value = getValue("start");
script.api.start = null;
script.api.end = null;
script.api.setStart = setStart;
script.api.setEnd = setEnd;
script.api.manualStart = false;
script.api.manualEnd = false;
script.api.playAutomatically = script.playAutomatically;

if ( global.tweenManager && global.tweenManager.addToRegistry )
{
    global.tweenManager.addToRegistry(script);
}

if ( script.dataType <= 1 )
{
    script.api.value = ( script.api.dataType == 0 ) ? Math.floor( script.api.value.a ) : script.api.value.a;
}

// Manually set start value
function setStart( start )
{
    script.api.manualStart = true;
    script.api.start = start;
}

// Manually set end value
function setEnd( end )
{
    script.api.manualEnd = true;
    script.api.end = end;
}

// Update the tween to its start
function updateToStart()
{
    updateValue( script.api.start );
}

// Update the tween to its end
function updateToEnd()
{
    updateValue( (script.loopType == 3) ? script.api.start : script.api.end );
}

// Play it automatically if specified
if( script.playAutomatically )
{
    // Start the tween
    startTween();
}

// Create the tween with passed in parameters
function startTween()
{
    if ( !global.tweenManager )
    {
        print( "Tween Value: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\"." );
        return;
    }

    script.api.tween = setupTween();

    if ( script.api.tween )
    {
        // Start the tween
        script.api.tween.start();
    }
}

// Create the tween with passed in parameters
function setupTween()
{
    if ( !script.api.manualStart )
    {
        script.api.start = getValue("start");
    }

    if ( !script.api.manualEnd )
    {
        script.api.end = getValue("end");
    }

    var startValue = script.api.start;
    var endValue = script.api.end;

    var tween = null;

    // Reset object to start
    resetObject();

    // Create the tween
    tween = new TWEEN.Tween(startValue)
        .to( endValue, script.api.time * 1000.0 )
        .delay( script.delay * 1000.0 )
        .easing( global.tweenManager.getTweenEasingType( script.easingFunction, script.easingType ) )
        .onUpdate( updateValue );

    if ( tween )
    {
        // Configure the type of looping based on the inputted parameters
        global.tweenManager.setTweenLoopType( tween, script.loopType );

        // Save reference to tween
        script.api.tween = tween;

        return tween;
    }
    else
    {
        return;
    }
}

// Create the tween with swapped start and end parameters
function setupTweenBackwards()
{
    var startValue = (script.loopType == 3) ? script.api.start : script.api.end;

    var endValue = (script.loopType == 3) ? script.api.end : script.api.start;

    var tween = null;

    var easingType = global.tweenManager.getSwitchedEasingType( script.easingType );

    // Create the tween
    tween = new TWEEN.Tween( startValue )
        .to( endValue, script.api.time * 1000.0 )
        .delay( script.delay * 1000.0 )
        .easing( global.tweenManager.getTweenEasingType( script.easingFunction, easingType ) )
        .onUpdate( updateValue );

    if ( tween )
    {
        // Configure the type of looping based on the inputted parameters
        global.tweenManager.setTweenLoopType( tween, script.api.loopType );

        return tween;
    }
    else
    {
        return;
    }
}

// Resets the object to its start
function resetObject()
{
    updateValue( script.api.start );
}

// Return the updated value from Tween.js
function updateValue(value)
{
    if ( script.dataType <= 1)
    {
        script.api.value = (script.dataType == 0) ? Math.floor(value.a) : value.a;
    }
    else
    {
        script.api.value = value;
    }
}


// Get appropriate start value based on dataType
function getValue(value)
{
    var val = {};

    var rawVal = (value == "start") ? [script.startInt, script.startFloat, script.startVector2, script.startVector3, script.startVector4] : [script.endInt, script.endFloat, script.endVector2, script.endVector3, script.endVector4];

    rawVal = rawVal[script.dataType];

    if ( script.dataType <= 1 )
    {
        val = {
            "a": rawVal
        };
    }
    else
    {
        var properties = ["x", "y", "z", "w"];

        for ( var i = 0; i < script.dataType; i++ )
        {
            var propName = properties[i];
            val[propName] = rawVal[propName];
        }
    }

    return val;
}
