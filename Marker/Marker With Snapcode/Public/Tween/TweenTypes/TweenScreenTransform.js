// TweenScreenTransform.js
// Version: 0.0.5
// Event: Any Event
// Description: Runs a tween on a Lens Studio ScreenTransform using TweenJS
// ----- USAGE -----
// Attach this script as a component after the Tween Manager script on either the same scene object or in a lower scene object in the Objects Panel.
//
// Assign a Scene Object that has a ScreenTransform component to the "Scene Object" property on this script.
// -----------------


//@input SceneObject sceneObject
//@input string tweenName
//@input bool playAutomatically = true
//@input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
//@ui {"widget":"separator"}
//@input int type = 0 {"widget":"combobox", "values":[{"label":"Position", "value":0}, {"label":"Scale", "value":1}, {"label":"Rotation", "value":2}, {"label":"Anchors", "value":3}]}
//@input int movementType = 0 {"widget": "combobox", "values": [{"label": "From / To", "value": 0}, {"label": "To", "value": 1}, {"label":"From", "value": 2}, {"label":"Offset", "value": 3}]}

// Movement Values - From/To
    //@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 0}
    //@input vec3 startPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "Start"}
    //@input vec3 endPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "End"}
    //@input vec3 startScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "Start"}
    //@input vec3 endScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "End"}
    //@input float startRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "Start"}
    //@input float endRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "End"}
    //@ui {"widget":"group_start", "label":"Start", "showIf": "type", "showIfValue": 3}
        //@input vec2 startAnchorsMin = {-1, -1} {"label": "Min"}
        //@input vec2 startAnchorsMax = {1, 1} {"label": "Max"}
    //@ui {"widget":"group_end"}
    //@ui {"widget":"group_start", "label":"End", "showIf": "type", "showIfValue": 3}
        //@input vec2 endAnchorsMin = {-1, -1} {"label": "Min"}
        //@input vec2 endAnchorsMax = {1, 1} {"label": "Max"}
    //@ui {"widget":"group_end"}
//@ui {"widget":"group_end"}

// Movement Values - From
//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 1}
    //@input vec3 toPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "End"}
    //@input vec3 toScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "End"}
    //@input float toRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "End"}
    //@ui {"widget":"group_start", "label":"End", "showIf": "type", "showIfValue": 3}
        //@input vec2 toAnchorsMin = {-1, -1} {"label": "Min"}
        //@input vec2 toAnchorsMax = {1, 1} {"label": "Max"}
    //@ui {"widget":"group_end"}
//@ui {"widget":"group_end"}

// Movement Values - To
//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 2}
    //@input vec3 fromPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "Start"}
    //@input vec3 fromScale = {1, 1, 1} {"showIf": "type", "showIfValue": 1, "label": "Start"}
    //@input float fromRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "Start"}
    //@ui {"widget":"group_start", "label":"Start", "showIf": "type", "showIfValue": 3}
        //@input vec2 fromAnchorsMin = {-1, -1} {"label": "Min"}
        //@input vec2 fromAnchorsMax = {1, 1} {"label": "Max"}
    //@ui {"widget":"group_end"}    
//@ui {"widget":"group_end"}

// Movement Values - Offset
//@ui {"widget":"group_start", "label":"Movement Values", "showIf": "movementType", "showIfValue": 3}
    //@input vec3 offsetPosition = {0, 0, 0} {"showIf": "type", "showIfValue": 0, "label": "Offset"}
    //@input vec3 offsetScale = {0, 0, 0}{"showIf": "type", "showIfValue": 1, "label": "Offset"}
    //@input float offsetRotation = 0 {"showIf": "type", "showIfValue": 2, "label": "Offset"}
    //@ui {"widget":"group_start", "label":"Offset", "showIf": "type", "showIfValue": 3}
        //@input vec2 offsetAnchorsMin = {0, 0} {"label": "Min"}
        //@input vec2 offsetAnchorsMax = {0, 0} {"label": "Max"}
    //@ui {"widget":"group_end"}
//@ui {"widget":"group_end"}

//@input bool additive {"showIf":"movementType", "showIfValue": 3}
//@ui {"widget":"label", "label":"(Use on Loop)", "showIf": "movementType", "showIfValue": 3}
//@input float time = 1.0
//@input float delay = 0.0

//@ui {"widget":"separator"}
//@input string easingFunction = "Quadratic" {"widget":"combobox", "values":[{"label":"Linear", "value":"Linear"}, {"label":"Quadratic", "value":"Quadratic"}, {"label":"Cubic", "value":"Cubic"}, {"label":"Quartic", "value":"Quartic"}, {"label":"Quintic", "value":"Quintic"}, {"label":"Sinusoidal", "value":"Sinusoidal"}, {"label":"Exponential", "value":"Exponential"}, {"label":"Circular", "value":"Circular"}, {"label":"Elastic", "value":"Elastic"}, {"label":"Back", "value":"Back"}, {"label":"Bounce", "value":"Bounce"}]}
//@input string easingType = "Out" {"widget":"combobox", "values":[{"label":"In", "value":"In"}, {"label":"Out", "value":"Out"}, {"label":"In / Out", "value":"InOut"}]}

var propertyTypes = ["Position", "Scale", "Rotation", "Anchors"];
var PropertyType = {};
propertyTypes.forEach(function(d, i){PropertyType[d] = i;});

var propertyTypeName = Object.keys(PropertyType)[script.type];

function setProperty(propName) {
    if(script.type == PropertyType.Rotation){
        script[propName] = new vec3(script[propName + propertyTypeName], 0, 0);
    }
    else if(script.type == PropertyType.Anchors){
        script[propName] = new vec4(script[propName + propertyTypeName + "Min"].x, script[propName + propertyTypeName + "Min"].y, script[propName + propertyTypeName + "Max"].x, script[propName + propertyTypeName + "Max"].y);
    }
    else{
        script[propName] = script[propName + propertyTypeName]
    }
}

["start", "end", "to", "from", "offset"].forEach(setProperty);

// If no scene object is specified, use object the script is attached to
if( !script.sceneObject )
{
    script.sceneObject = script.getSceneObject();
}

// Setup the external API
script.api.tweenObject = script.getSceneObject();
script.api.tweenType = "screen_transform";
script.api.type = script.type;
script.api.movementType = script.movementType;
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
script.api.playAutomatically = script.playAutomatically;

if ( global.tweenManager && global.tweenManager.addToRegistry ) 
{
    global.tweenManager.addToRegistry(script);
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
        print( "Tween Screen Transform: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\"." );
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
    var componentCount = script.api.sceneObject.getComponentCount( "Component.ScreenTransform" );
    var screenTransform = null;
    var screenTransformParams = null;
    var startValue = null;
    var endValue = null;
    var tween = null;
    if (componentCount > 0){
        screenTransform = script.api.sceneObject.getFirstComponent("Component.ScreenTransform");
        screenTransformParams = null;

        // Set the appropriate parameter based on movementType and tweenType selected
        switch( script.type )
        {
            case 0:
                screenTransformParams = screenTransform.position;
                break;
            case 1:
                screenTransformParams = screenTransform.scale;
                break;
            case 2:
                screenTransformParams = screenTransform.rotation.toEulerAngles().z
                break;
            case 3:
                // left, bottom, right, top
                screenTransformParams = new vec4(screenTransform.anchors.left, screenTransform.anchors.bottom, screenTransform.anchors.right, screenTransform.anchors.top);
                break;
        }


        if ( !script.api.manualStart )
        {
            switch ( script.movementType )
            {
                case 0:
                    if(script.type == PropertyType.Rotation){
                        script.api.start = script.start.x * DEG_TO_RAD;
                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.start = new vec4(script.start.x, script.start.y, script.start.z, script.start.w);
                    }
                    else{
                        script.api.start = new vec3(script.start.x, script.start.y, script.start.z);
                    }
                    break;
                case 1:
                    if(script.type == PropertyType.Rotation){
                        script.api.start = screenTransformParams;

                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.start = new vec4( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z, screenTransformParams.w);
                    }
                    else{
                        script.api.start = new vec3( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z);
                    }
                    break;
                case 2:
                    if(script.type == PropertyType.Rotation){
                        script.api.start = script.from.x * DEG_TO_RAD;

                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.start = new vec4( script.from.x, script.from.y, script.from.z, script.from.w );

                    }
                    else{
                        script.api.start = new vec3( script.from.x, script.from.y, script.from.z );
                    }
                    break;
                case 3:
                    if(script.type == PropertyType.Rotation){
                        script.api.start = screenTransformParams;

                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.start = new vec4( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z, screenTransformParams.w);

                    }
                    else{
                        script.api.start = new vec3( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z );                        
                    }
                    break;
            }
        }

        if ( !script.api.manualEnd )
        {
            switch ( script.movementType )
            {
                case 0:
                    if(script.type == PropertyType.Rotation){
                        script.api.end = script.end.x * DEG_TO_RAD;
                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.end = new vec4(script.end.x, script.end.y, script.end.z, script.end.w);
                    }
                    else{
                        script.api.end = new vec3(script.end.x, script.end.y, script.end.z);
                    }
                    break;
                case 1:
                    if(script.type == PropertyType.Rotation){
                        script.api.end = script.to.x * DEG_TO_RAD;
                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.end = new vec4( script.to.x, script.to.y, script.to.z, script.to.w );
                    }
                    else{
                        script.api.end = new vec3( script.to.x, script.to.y, script.to.z );
                    }
                    break;
                case 2:
                    if(script.type == PropertyType.Rotation){
                        script.api.end = screenTransformParams;
                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.end = new vec4( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z, screenTransformParams.w );
                    }
                    else{
                        script.api.end = new vec3( screenTransformParams.x, screenTransformParams.y, screenTransformParams.z );
                    }
                    break;
                case 3:
                    if(script.type == PropertyType.Rotation){
                        script.api.end = screenTransformParams + script.offset.x * DEG_TO_RAD;
                    }
                    else if(script.type == PropertyType.Anchors){
                        script.api.end = new vec4( script.api.start.x + script.offset.x, script.api.start.y + script.offset.y, script.api.start.z + script.offset.z, script.api.start.w + script.offset.w );
                    }
                    else{
                        script.api.end = new vec3( script.api.start.x + script.offset.x, script.api.start.y + script.offset.y, script.api.start.z + script.offset.z );
                    }
                    break;
            }
        }

        var startValue;
        var endValue;
        if(script.type == PropertyType.Rotation){
            startValue = {"x": 0};
        }
        else if(script.type == PropertyType.Anchors){
            startValue = {
                "x": script.api.start.x,
                "y": script.api.start.y,
                "z": script.api.start.z,
                "w": script.api.start.w
            };
        }
        else{
            startValue = {
                "x": script.api.start.x,
                "y": script.api.start.y,
                "z": script.api.start.z
            };
        }

        if(script.type == PropertyType.Rotation){
            endValue = {"x": 1};
        }
        else if(script.type == PropertyType.Anchors){
            endValue = {
                "x": script.api.end.x,
                "y": script.api.end.y,
                "z": script.api.end.z,
                "w": script.api.end.w
            };
        }
        else{
            endValue = {
                "x": script.api.end.x,
                "y": script.api.end.y,
                "z": script.api.end.z
            };
        }

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

    var startValue;
    var endValue;

    if(script.type == PropertyType.Rotation){
        startvalue = {"x": (script.loopType == 3) ? 0 : 1}
    }
    else if(script.type == PropertyType.Anchors){
        startValue = {
            "x": (script.loopType == 3) ? script.api.start.x : script.api.end.x,
            "y": (script.loopType == 3) ? script.api.start.y : script.api.end.y,
            "z": (script.loopType == 3) ? script.api.start.z : script.api.end.z,
            "w": (script.loopType == 3) ? script.api.start.w : script.api.end.w
        }
    }
    else{
        startValue = {
            "x": (script.loopType == 3) ? script.api.start.x : script.api.end.x,
            "y": (script.loopType == 3) ? script.api.start.y : script.api.end.y,
            "z": (script.loopType == 3) ? script.api.start.z : script.api.end.z
        }
    }

    if(script.type == PropertyType.Rotation){
        startValue = {"x": (script.loopType == 3) ? 1 : 0}
    }
    else if(script.type == PropertyType.Anchors){
        startValue = {
            "x": (script.loopType == 3) ? script.apiend.x : script.api.start.x,
            "y": (script.loopType == 3) ? script.apiend.y : script.api.start.y,
            "z": (script.loopType == 3) ? script.apiend.z : script.api.start.z,
            "w": (script.loopType == 3) ? script.apiend.w : script.api.start.w
        }
    }
    else{
        startValue = {
            "x": (script.loopType == 3) ? script.api.end.x : script.api.start.x,
            "y": (script.loopType == 3) ? script.api.end.y : script.api.start.y,
            "z": (script.loopType == 3) ? script.api.end.z : script.api.start.z
        }
    }    

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
    if (script.api.start == null) {
        return;
    }

    if(script.type == PropertyType.Rotation){
        startValue = {"x": 0};
    }
    else if(script.type == PropertyType.Anchors){
        startValue = {
            "x": script.api.start.x,
            "y": script.api.start.y,
            "z": script.api.start.z,
            "w": script.api.start.w
        };        
    }
    else{
        startValue = {
            "x": script.api.start.x,
            "y": script.api.start.y,
            "z": script.api.start.z
        };
    }    

    // Initialize to start value
    updateValue( startValue );
}

// Here's where the values returned by the tween are used
// to drive the Component.ScreenTransform of the SceneObject

function updateValue( value )
{
    if (script.api.sceneObject == null) {
        return;
    }

    var DEG_TO_RAD = 0.0174533;
    var componentCount = script.api.sceneObject.getComponentCount( "Component.ScreenTransform" );

    if( componentCount > 0 )
    {
        var screenTransform = script.api.sceneObject.getFirstComponent("Component.ScreenTransform");

        switch( script.api.type )
        {
            case PropertyType.Position: // Position
                screenTransform.position = new vec3( value.x, value.y, value.z );
                break;
            case PropertyType.Scale: // Scale
                screenTransform.scale = new vec3( value.x, value.y, value.z);
                break;
            case PropertyType.Rotation: // Rotation
                var newAngle = lerp(script.api.start, script.api.end, value.x);
                var newQuat = quat.angleAxis(newAngle, vec3.forward());
                newQuat.normalize();
                screenTransform.rotation = newQuat ;
                break;
            case PropertyType.Anchors: // Anchors
                screenTransform.anchors.left = value.x;
                screenTransform.anchors.bottom = value.y;
                screenTransform.anchors.right = value.z;
                screenTransform.anchors.top = value.w;
                break;                
        }
    }
}

function lerp(a,b,t) { return a + (b-a)*t; }