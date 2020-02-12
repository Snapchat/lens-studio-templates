// TweenBillboard.js
// Version: 0.0.2
// Event: Any Event
// Description: Runs a tween on a Lens Studio Billboard using TweenJS
// ----- USAGE -----
// Attach this script as a component after the Tween Manager script on either the same scene object or in a lower scene object in the Objects Panel.
//
// Assign a scene object that contains an Aligner component to "Scene Object" on this script.
// -----------------

//@ui{"label": "<font color='#ff4400'>TweenBillboard - DEPRECATED</font>"}
//@input SceneObject sceneObject
//@input string tweenName
//@input bool playAutomatically = true
//@input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
//@ui {"widget":"separator"}
//@input int type = 0 {"widget":"combobox", "values":[{"label":"Binding Point", "value":0}, {"label":"Size", "value":1}, {"label":"Rotation", "value":2}]}
//@input int movementType = 0 {"widget": "combobox", "values": [{"label": "From / To", "value": 0}, {"label": "To", "value": 1}, {"label":"From", "value": 2}, {"label":"Offset", "value": 3}]}

//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 0}
//@input vec2 startBind {"showIf": "type", "showIfValue": 0, "label": "Start"}
//@input vec2 endBind {"showIf": "type", "showIfValue": 0, "label": "End"}
//@input vec2 startScale {"showIf": "type", "showIfValue": 1, "label": "Start"}
//@input vec2 endScale {"showIf": "type", "showIfValue": 1, "label": "End"}
//@input float startRot {"showIf": "type", "showIfValue": 2, "label": "Start"}
//@input float endRot {"showIf": "type", "showIfValue": 2, "label": "End"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 1}
//@input vec2 toBind {"showIf": "type", "showIfValue": 0, "label": "End"}
//@input vec2 toScale {"showIf": "type", "showIfValue": 1, "label": "End"}
//@input float toRot {"showIf": "type", "showIfValue": 2, "label": "End"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 2}
//@input vec2 fromBind {"showIf": "type", "showIfValue": 0, "label": "Start"}
//@input vec2 fromScale {"showIf": "type", "showIfValue": 1, "label": "Start"}
//@input float fromRot {"showIf": "type", "showIfValue": 2, "label": "Start"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 3}
//@input vec2 offsetBind {"showIf": "type", "showIfValue": 0, "label": "Offset"}
//@input vec2 offsetScale {"showIf": "type", "showIfValue": 1, "label": "Offset"}
//@input float offsetRot {"showIf": "type", "showIfValue": 2, "label": "Offset"}
//@ui {"widget":"group_end"}

//@input vec2 start {"showIf": "movementType"}
//@input vec2 end {"showIf": "movementType"}
//@input vec2 from {"showIf": "movementType"}
//@input vec2 to {"showIf": "movementType"}
//@input vec2 offset {"showIf": "movementType"}

//@input bool additive {"showIf":"movementType", "showIfValue": 3}
//@ui {"widget":"label", "label":"(Use on Loop)", "showIf": "movementType", "showIfValue": 3}
//@input float time = 1.0
//@input float delay = 0.0

//@ui {"widget":"separator"}
//@input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
//@input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}

var type = ["Bind", "Scale", "Rot"];
type = type[script.type];
script.start = (script.type == 2) ? new vec2(script["start" + type], 0) : script["start" + type];
script.end = (script.type == 2) ? new vec2(script["end" + type], 0) : script["end" + type];
script.to = (script.type == 2) ? new vec2(script["to" + type], 0) : script["to" + type];
script.from = (script.type == 2) ? new vec2(script["from" + type], 0) : script["from" + type];
script.offset = (script.type == 2) ? new vec2(script["offset" + type], 0) : script["offset" + type];

// If no scene object is specified, use object the script is attached to
if( !script.sceneObject )
{
    script.sceneObject = script.getSceneObject();
}

// Setup the external API
script.api.tweenType = "billboard";
script.api.type = script.type;
script.api.time = script.time;
script.api.tweenName = script.tweenName;
script.api.startTween = startTween;
script.api.resetObject = resetObject;
script.api.tween = null;
script.api.setupTween = setupTween;
script.api.setupTweenBackwards = setupTweenBackwards;
script.api.sceneObject = script.sceneObject;
script.api.updateToStart = updateToStart;
script.api.updateToEnd = updateToEnd;
script.api.loopType = script.loopType;
script.api.start = null;
script.api.end = null;
script.api.setStart = setStart;
script.api.setEnd = setEnd;
script.api.manualStart = false;
script.api.manualEnd = false;

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
    if ( script.loopType == 3 )
    {
        updateValue( script.api.start );
    }
    else
    {
        updateValue( script.api.end );
    }
}

// Play it automatically if specified
if( script.playAutomatically )
{
    // Start the tween
    startTween();
}

// Create the tween and start it
function startTween()
{
    if ( !global.tweenManager )
    {
        print( "Tween Billboard: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\"." );
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
    var DEG_TO_RAD = 0.0174533;
    var RAD_TO_DEG = 57.2958;
    var transform = script.api.sceneObject.getTransform();
    var componentCount = script.api.sceneObject.getComponentCount( "Component.SpriteAligner" );
    var spriteAligner = null;
    var billboardParams = null;
    var startValue = null;
    var endValue = null;
    var tween = null;
    if (componentCount > 0){
        spriteAligner = script.api.sceneObject.getFirstComponent("Component.SpriteAligner");
        billboardParams = null;

        // Set the appropriate parameter based on movementType and tweenType selected
        switch( script.type )
        {
            case 0:
                billboardParams = spriteAligner.bindingPoint;
                break;
            case 1:
                billboardParams = spriteAligner.size;
                break;
            case 2:
                billboardParams = transform.getLocalRotation()
                break;
        }

        if ( !script.api.manualStart )
        {
            switch ( script.movementType )
            {
                case 0:
                    script.api.start = (script.type == 2) ? quat.fromEulerAngles(0, 0, script.start.x * DEG_TO_RAD ) : script.start;
                    break;
                case 1:
                    script.api.start = (script.type == 2) ? billboardParams : new vec2( billboardParams.x, billboardParams.y );
                    break;
                case 2:
                    script.api.start = (script.type == 2) ? quat.fromEulerAngles(0, 0, script.from.x * DEG_TO_RAD) : new vec2( script.from.x, script.from.y );
                    break;
                case 3:
                    script.api.start = (script.type == 2) ? billboardParams : new vec2( billboardParams.x, billboardParams.y );
                    break;
            }
        }

        if ( !script.api.manualEnd )
        {
            switch ( script.movementType )
            {
                case 0:
                    script.api.end = (script.type == 2) ? quat.fromEulerAngles(0, 0, script.end.x * DEG_TO_RAD) : script.end;
                    break;
                case 1:
                    script.api.end = (script.type == 2) ? quat.fromEulerAngles(0, 0, script.to.x * DEG_TO_RAD) : new vec2( script.to.x, script.to.y );
                    break;
                case 2:
                    script.api.end = (script.type == 2) ? billboardParams : new vec2( billboardParams.x, billboardParams.y );
                    break;
                case 3:
                    script.api.end = (script.type == 2) ? billboardParams.multiply(quat.angleAxis(script.offset.x * DEG_TO_RAD, vec3.forward())) : new vec2( script.api.start.x + script.offset.x, script.api.start.y + script.offset.y );
                    break;
            }
        }

        startValue = (script.type == 2) ? {
            "x": 0
        } : {
            "x": script.api.start.x,
            "y": script.api.start.y
        };
        endValue = (script.type == 2) ? {
            "x": 1
        } : {
            "x": script.api.end.x,
            "y": script.api.end.y
        };
        // Reset object to start
        resetObject();
        // Create the tween
        tween = new TWEEN.Tween( startValue )
            .to( endValue, script.api.time * 1000.0 )
            .delay( script.delay * 1000.0 )
            .easing( global.tweenManager.getTweenEasingType( script.easingFunction, script.easingType ) )
            .onUpdate( updateValue )
            .onComplete( (script.movementType == 3 && script.additive && script.loopType == 1) ? startTween : null);
        if ( tween )
        {
            // Configure the type of looping based on the inputted parameters
            if ( script.movementType == 3 && script.additive && script.loopType == 1)
            {
                global.tweenManager.setTweenLoopType( tween, 0 );
            }
            else
            {
                global.tweenManager.setTweenLoopType( tween, script.api.loopType );
            }
            // Save reference to tween
            script.api.tween = tween;
            return tween;
        }
        else
        {
            return;
        }
    }
}

// Create the tween with swapped start and end parameters
function setupTweenBackwards()
{
    var tween = null;
    var startValue = (script.type == 2) ? {
        "x": (script.loopType == 3) ? 0 : 1
    } : {
        "x": (script.loopType == 3) ? script.api.start.x : script.api.end.x,
        "y": (script.loopType == 3) ? script.api.start.y : script.api.end.y,
        "z": (script.loopType == 3) ? script.api.start.z : script.api.end.z
    };
    var endValue = (script.type == 2) ? {
        "x": (script.loopType == 3) ? 1 : 0

    } : {
        "x": (script.loopType == 3) ? script.api.end.x : script.api.start.x,
        "y": (script.loopType == 3) ? script.api.end.y : script.api.start.y,
        "z": (script.loopType == 3) ? script.api.end.z : script.api.start.z
    };
    // Change easing type
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
}

// Resets the object to its start
function resetObject()
{
    var startValue = (script.type == 2) ? {
        "x": 0
    } : {
        "x": script.api.start.x,
        "y": script.api.start.y,
    };
    // Initialize to start value
    updateValue( startValue );
}

// Here's where the values returned by the tween are used
// to drive the Component.SpriteAligner of the SceneObject
function updateValue( value )
{
    var DEG_TO_RAD = 0.0174533;
    var transform = script.api.sceneObject.getTransform();
    var componentCount = script.api.sceneObject.getComponentCount( "Component.SpriteAligner" );
    if( componentCount > 0 )
    {
        var spriteAligner = script.api.sceneObject.getFirstComponent("Component.SpriteAligner");

        switch( script.api.type )
        {
            case 0: // Binding Point
                spriteAligner.bindingPoint = new vec2( value.x, value.y );
                break;
            case 1: // Size
                spriteAligner.size = new vec2( value.x, value.y );
                break;
            case 2: // Rotation
                var newQuat = quat.slerp(script.api.start, script.api.end, value.x);
                newQuat.normalize();
                transform.setLocalRotation( newQuat );
                break;
        }
    }
}
