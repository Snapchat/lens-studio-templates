// -----JS CODE-----
// ObjectTrackingHintController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls a object tracking logo and text that appears when camera is not seeing cat, dog, hand, body.

// @input Asset.Texture hintLogo
// @input int hint = 0 {"widget": "combobox", "values":[{"label": "Cat", "value": 0}, {"label": "Dog", "value": 1}, {"label": "Cat or Dog", "value": 2}, {"label": "Body", "value": 3},{"label": "Hand", "value": 4}, {"label": "Custom", "value": 5}]}
// @input string customText {"showIf": "hint", "showIfValue": 5}

// @input bool advanced = false
// @input Component.Text hintText {"showIf":"advanced"}
// @input SceneObject hintRenderZone {"showIf":"advanced"}
// @input SceneObject hintLogoImage {"showIf":"advanced"}
// @input SceneObject magnifyingGlassPivot {"showIf":"advanced"}
// @input SceneObject magnifying {"showIf":"advanced"}

var hints = ["LOOK FOR CAT", "LOOK FOR DOG", "LOOK FOR CAT OR DOG", "LOOK FOR BODY", "LOOK FOR HAND", script.customText];
var hidden = false;
var currentAngle = 0;
var rotationSpeed = .025;
var t = script.magnifyingGlassPivot.getTransform();
var additionalRotation = quat.angleAxis(rotationSpeed, vec3.forward());

function initialize()
{
    global.tweenManager.startTween( script.magnifying, "transitionin" );
    global.tweenManager.startTween( script.hintLogoImage, "transitionin" );
    script.api.show = show;
    script.api.hide = hide;

    if( script.hintLogo )
    {
        script.hintLogoImage.getFirstComponent("Component.Image").mainPass.baseTex = script.hintLogo;
    }

    updateHintText();
}

function onUpdate()
{
    if( global.scene.isRecording() )
    {
        hide();
        return;
    }

    rotateMagnifyingGlass();
}


function show()
{
    if ( !hidden )
    {
        return;
    }

    hidden = false;

    script.hintRenderZone.enabled = true;

    global.tweenManager.startTween( script.magnifying, "transitionin" );
    global.tweenManager.startTween( script.hintLogoImage, "transitionin" );

}

function hide()
{
    if ( hidden )
    {
        return;
    }

    hidden = true;

    global.tweenManager.stopTween( script.magnifying, "transitionin" );
    global.tweenManager.stopTween( script.hintLogoImage, "transitionin" );
    global.tweenManager.resetObject( script.magnifying, "transitionin" );
    global.tweenManager.resetObject( script.hintLogoImage, "transitionin" );

    script.hintRenderZone.enabled = false;
}

function rotateMagnifyingGlass()
{
    var currentRot = t.getLocalRotation();
    t.setLocalRotation(currentRot.multiply(additionalRotation));
}

function updateHintText()
{
    if( !script.hintText )
    {
        print( "ObjectTrackingHintController, ERROR: Please make sure Hint Text object is set under the advanced checkbox" );
        return;
    }

    script.hintText.text = hints[script.hint];
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

initialize();