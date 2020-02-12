// -----JS CODE-----
// SkeletalTrackingHintController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the skeletal tracking hint controller.

// @input Asset.Texture awayFromPhoneAnim {"label": "Skeletal Hint"}
// @input bool advanced = false
// @input SceneObject camera {"showIf": "advanced"}
// @input Component.Image hintImage {"showIf":"advanced"}
// @input Component.Text hintText {"showIf":"advanced"}
// @input SceneObject magnifyingGlassPivot {"showIf":"advanced"}
// @input Component.ScriptComponent skeletalControllerScript {"showIf": "advanced"}
// @input Component.ScriptComponent skeletalTrackingScript {"showIf": "advanced"}

var isInitialized = false;

var DISTANCE_TO_CAMERA_HINT = "STAND FURTHER \nFROM THE PHONE";
var SHOW_SECOND_HINT_TIME = 1.0;
var MIN_DISTANCE = 85;
var MAX_DISTANCE = 130;

var mainHintTexture;
var mainHintText = "";
var hintTransform;
var hintProvider;
var faceFoundForDuration = false;
var timeStartedCounting = 0;

var headBinding = null;
var headTransform;
var faceFound = false;
var secondHintVisible = false;

var getSkeletalStatusFunc = null;
var cameraTransform;
var ratio = 0.0;

function onLensTurnOn()
{
    if( checkInputValues() )
    {
        initialize();
        getDefaultHintSettings();

        isInitialized = true;
    }
}

function onUpdate( eventData )
{
    if( isInitialized )
    {
        checkDistanceToCamera();
    }
}

function initialize()
{
    getSkeletalStatusFunc = script.skeletalTrackingScript.api.skeletalStatus;
    cameraTransform = script.camera.getTransform();

    if( script.awayFromPhoneAnim )
    {
        var isAnimated = !!script.awayFromPhoneAnim.control.getDuration;
        if( isAnimated )
        {
            hintProvider = script.awayFromPhoneAnim.control;
        }
    }
}


function onFaceFound( eventData )
{
    faceFound = true;
    timeStartedCounting = getTime();
    resetHint();
}

function onFaceLost( eventData )
{
    faceFound = false;
}

function checkDistanceToCamera()
{
    var skeletalStatus = getSkeletalStatusFunc();
    var isObjectTracking = skeletalStatus.isObjectTracking;
    createHeadBindingIfNeeded( skeletalStatus );

    if( faceFound )
    {
        var timeSinceStarted = getTime() - timeStartedCounting;
        var dist = getDistance( cameraTransform, headTransform );
        ratio = ( dist - MIN_DISTANCE ) / ( MAX_DISTANCE - MIN_DISTANCE );
        ratio = Math.max( 0.1, Math.min ( ratio, 1.0 ) );

        if( timeSinceStarted > SHOW_SECOND_HINT_TIME )
        {
            faceFoundForDuration = true;
        }
    }
    else
    {
        if( isObjectTracking )
        {
            ratio = 1.0;
        }
    }

    script.skeletalControllerScript.api.setAllImagesTransparency( ratio );
    script.skeletalControllerScript.api.showHint( !isObjectTracking || ratio < 0.9 );
    changeHintLogoToDistance( ( isObjectTracking || faceFoundForDuration ) && faceFound );
}

function getDefaultHintSettings()
{
    mainHintTexture = script.hintImage.mainPass.baseTex;
    mainHintText = script.hintText.text;
    hintTransform =  script.hintImage.getSceneObject().getFirstComponent( "Component.ScreenTransform" );
}

function changeHintLogoToDistance( trackingState )
{
    if( trackingState && !secondHintVisible)
    {
        if ( script.awayFromPhoneAnim )
        {
            script.hintImage.mainPass.baseTex = script.awayFromPhoneAnim;
            hintTransform.offsets.bottom = -0.1;
            hintTransform.offsets.top = 1.5;
        }
        script.hintText.text = DISTANCE_TO_CAMERA_HINT;
        secondHintVisible = true;

        script.magnifyingGlassPivot.enabled = false;
    }
    else if( !trackingState && secondHintVisible )
    {
        script.hintImage.mainPass.baseTex = mainHintTexture;
        hintTransform.offsets.bottom = 0;
        hintTransform.offsets.top = 0;

        script.hintText.text = mainHintText;
        secondHintVisible = false;

        script.magnifyingGlassPivot.enabled = true;
    }
}

function createHeadBindingIfNeeded( status )
{
    if ( status.isDelayedInitialized )
    {
        if( status.fpsStatus == false )
        {
            if (headBinding != null) {
                headBinding.enabled = !status.fpsStatus;
            } else {
                createHeadBinding();
            }
        }
    }
}

function createHeadBinding()
{
    var newObject = global.scene.createSceneObject( "Head Binding" );
    newObject.setParent( script.camera );
    headBinding = newObject.createComponent( "Component.Head" );
    headBinding.setAttachmentPointType(AttachmentPointType.HeadCenter);
    headTransform = newObject.getTransform();
    headTransform.setLocalPosition( vec3.zero() );


    var faceFoundEvent = script.createEvent( "FaceFoundEvent" );
    faceFoundEvent.faceIndex = 0;
    faceFoundEvent.bind( onFaceFound );

    var faceLostEvent = script.createEvent("FaceLostEvent");
    faceLostEvent.faceIndex = 0;
    faceLostEvent.bind( onFaceLost );
}

function resetHint()
{
    if( isInitialized )
    {
        hintProvider.pauseAtFrame( 0 );
        hintProvider.play( -1, 0 );
    }
}

function checkInputValues()
{
    if( !script.hintImage )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Hint Logo Image to the script under the Advanced checkbox" );
        return false;
    }

    if( !script.hintText )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Hint Text object to the script under the Advanced checkbox" );
        return false;
    }

    if( !script.magnifyingGlassPivot )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Magnifying Glass Pivot object to the script under the Advanced checkbox" );
        return false;
    }

    if( !script.skeletalControllerScript )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign SkeletalController [EDIT_ME] object to the script under the Advanced checkbox" );
        return false;
    }

    if( !script.skeletalControllerScript.api.setAllImagesTransparency )
    {
        print( "SkeletalTrackingHintController, ERROR: Please make sure the SkeletalTrackingController script contains the setAllImagesTransparency function" );
        return false;
    }

    if( !script.skeletalControllerScript.api.showHint )
    {
        print( "SkeletalTrackingHintController, ERROR: Please make sure the SkeletalTrackingController script contains the showHint function" );
        return false;
    }

    if( !script.skeletalTrackingScript )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Skeletal Tracking Controller object to the script under the Advanced checkbox" );
        return false;
    }

    if( !script.skeletalTrackingScript.api.skeletalStatus )
    {
        print( "SkeletalTrackingHintController, WARNING: ERROR: Please make sure the skeletalTrackingScript script contains the skeletalStatus function" );
        return false;
    }

    if( !script.camera )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Camera object to the script under the Advanced checkbox. Distance check hint will not work until the Camera object gets assigned to the script" );
        return false;
    }

    if( !script.awayFromPhoneAnim )
    {
        print( "SkeletalTrackingHintController, WARNING: Please assign Skeletal hint image to the Skeletal Tracking Hint Controller object." );
        return false;
    }

    return true;
}

function getDistance( pointA, pointB )
{
    return pointA.getWorldPosition().distance( pointB.getWorldPosition() );
}

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn );

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
