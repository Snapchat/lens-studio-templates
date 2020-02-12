// -----JS CODE-----
// SkeletalTemplateController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the skeletal template.

// @ui {"widget":"group_start", "label":"Right Arm Customization"}

// @input bool isRightShoulder = false {"label":"Right Shoulder"}
// @ui {"widget":"group_start", "label":"Shoulder Properties", "showIf": "isRightShoulder"}
// @input Asset.Texture rightShoulderTexture { "label":"Texture" }
// @input float rightShoulderSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float rightShoulderOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightShoulderOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightShoulderRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightShoulderAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string rightShoulderRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"separator"}

// @input bool isRightElbow = false {"label":"Right Elbow"}
// @ui {"widget":"group_start", "label":"Elbow Properties", "showIf": "isRightElbow"}
// @input Asset.Texture rightElbowTexture { "label":"Texture" }
// @input float rightElbowSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float rightElbowOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightElbowOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightElbowRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightElbowAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string rightElbowRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"separator"}

// @input bool isRightHand = false {"label":"Right Hand"}
// @ui {"widget":"group_start", "label":"Hand Properties", "showIf": "isRightHand"}
// @input Asset.Texture rightHandTexture { "label":"Texture" }
// @input float rightHandSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float rightHandOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightHandOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightHandRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightHandAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string rightHandRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"Left Arm Customization"}

// @input bool isLeftShoulder = false {"label":"Left Shoulder"}
// @ui {"widget":"group_start", "label":"Shoulder Properties", "showIf": "isLeftShoulder"}
// @input Asset.Texture leftShoulderTexture { "label":"Texture" }
// @input float leftShoulderSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float leftShoulderOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftShoulderOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftShoulderRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftShoulderAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string leftShoulderRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"separator"}

// @input bool isLeftElbow = false {"label":"Left Elbow"}
// @ui {"widget":"group_start", "label":"Elbow Properties", "showIf": "isLeftElbow"}
// @input Asset.Texture leftElbowTexture { "label":"Texture" }
// @input float leftElbowSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float leftElbowOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftElbowOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftElbowRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftElbowAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string leftElbowRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"separator"}

// @input bool isLeftHand = false {"label":"Left Hand"}
// @ui {"widget":"group_start", "label":"Hand Properties", "showIf": "isLeftHand"}
// @input Asset.Texture leftHandTexture { "label":"Texture" }
// @input float leftHandSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float leftHandOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftHandOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftHandRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftHandAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string leftHandRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"Head Customization"}

// @input bool isHead = false {"label":"Head"}
// @ui {"widget":"group_start", "label":"Head Properties", "showIf": "isHead"}
// @input Asset.Texture headTexture { "label":"Texture" }
// @input float headSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float headOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float headOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float headRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float headAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string headRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"separator"}

// @input bool isNeck = false {"label":"Neck"}
// @ui {"widget":"group_start", "label":"Neck Properties", "showIf": "isNeck"}
// @input Asset.Texture neckTexture { "label":"Texture" }
// @input float neckSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float neckOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float neckOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float neckRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float neckAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input string neckRotateTo {"label":"Rotate Toward", "widget":"combobox", "values":[{"label":"None", "value":"None"}, {"label":"Right Shoulder Joint", "value":"RightShoulder"}, {"label":"Right Elbow Joint", "value":"RightElbow"}, {"label":"Right Hand Joint", "value":"RightHand"}, {"label":"Left Shoulder Joint", "value":"LeftShoulder"}, {"label":"Left Elbow Joint", "value":"LeftElbow"}, {"label":"Left Hand Joint", "value":"LeftHand"}, {"label":"Head Joint", "value":"Head"}, {"label":"Neck Joint", "value":"Neck"}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool advanced = false
// @input Component.ScreenTransform headTransform {"showIf": "advanced"}
// @input Component.ScreenTransform neckTransform {"showIf": "advanced"}
// @input Component.ScreenTransform rightShoulderTransform {"showIf": "advanced"}
// @input Component.ScreenTransform rightElbowTransform {"showIf": "advanced"}
// @input Component.ScreenTransform rightHandTransform {"showIf": "advanced"}
// @input Component.ScreenTransform leftShoulderTransform {"showIf": "advanced"}
// @input Component.ScreenTransform leftElbowTransform {"showIf": "advanced"}
// @input Component.ScreenTransform leftHandTransform {"showIf": "advanced"}
// @input Asset.Material imageMaterial {"showIf": "advanced"}

// @input Component.ScriptComponent hintControllerScript {"showIf": "advanced"}
// @input Component.ScriptComponent skeletalHintScript {"showIf": "advanced"}

var frameDelay = 1;
var initialized = false;
var images = [];
var headTrackerTransform;
var headRotateToward;
var neckTrackerTransform;
var neckRotateToward;
var leftShoulderTrackerTransform;
var leftShoulderRotateToward;
var leftElbowTrackerTransform;
var leftElbowRotateToward;
var leftHandTrackerTransform;
var leftHandRotateToward;
var rightShoulderTrackerTransform;
var rightShoulderRotateToward;
var rightElbowTrackerTransform;
var rightElbowRotateToward;
var rightHandTrackerTransform;
var rightHandRotateToward;

script.api.toggleAllImages = toggleAllImages;
script.api.setAllImagesTransparency = setAllImagesTransparency;
script.api.showHint = showHint;

function initialize()
{
    if( checkInputValues() )
    {
        configureTrackingVisual();
        initialized = true;
    }
}

function onLensTurnOn()
{
    initRotator();
}

function onUpdate( eventData )
{
    if( initialized )
    {
        if ( frameDelay > 0 )
        {
            frameDelay--;
            return;
        }
        else if ( frameDelay == 0 )
        {
            toggleAllImages( true );
        }

        rotateBodyAnchors();
    }
}

function configureTrackingVisual()
{
    // Configure head
    configureGraphicVisual(
        {
            transformObject: script.headTransform,
            texture: script.headTexture,
            alpha: script.headAlpha,
            isEnabled: script.isHead,
            scale: script.headSize,
            offsetX: script.headOffsetX,
            offsetY: script.headOffsetY,
            rotation: script.headRotation
        }
    );

    // Configure neck
    configureGraphicVisual(
        {
            transformObject: script.neckTransform,
            texture: script.neckTexture,
            alpha: script.neckAlpha,
            isEnabled: script.isNeck,
            scale: script.neckSize,
            offsetX: script.neckOffsetX,
            offsetY: script.neckOffsetY,
            rotation: script.neckRotation
        }
    );

    // Configure right arm

    // Configure right hand
    configureGraphicVisual(
        {
            transformObject: script.rightHandTransform,
            texture: script.rightHandTexture,
            alpha: script.rightHandAlpha,
            isEnabled: script.isRightHand,
            scale: script.rightHandSize,
            offsetX: script.rightHandOffsetX,
            offsetY: script.rightHandOffsetY,
            rotation: script.rightHandRotation
        }
    );

    // Configure right elbow
    configureGraphicVisual(
        {
            transformObject: script.rightElbowTransform,
            texture: script.rightElbowTexture,
            alpha: script.rightElbowAlpha,
            isEnabled: script.isRightElbow,
            scale: script.rightElbowSize,
            offsetX: script.rightElbowOffsetX,
            offsetY: script.rightElbowOffsetY,
            rotation: script.rightElbowRotation
        }
    );

    // Configure right shoulder
    configureGraphicVisual(
        {
            transformObject: script.rightShoulderTransform,
            texture: script.rightShoulderTexture,
            alpha: script.rightShoulderAlpha,
            isEnabled: script.isRightShoulder,
            scale: script.rightShoulderSize,
            offsetX: script.rightShoulderOffsetX,
            offsetY: script.rightShoulderOffsetY,
            rotation: script.rightShoulderRotation
        }
    );

    // Configure left arm

    // Configure left hand
    configureGraphicVisual(
        {
            transformObject: script.leftHandTransform,
            texture: script.leftHandTexture,
            alpha: script.leftHandAlpha,
            isEnabled: script.isLeftHand,
            scale: script.leftHandSize,
            offsetX: script.leftHandOffsetX,
            offsetY: script.leftHandOffsetY,
            rotation: script.leftHandRotation
        }
    );

    // Configure left elbow
    configureGraphicVisual(
        {
            transformObject: script.leftElbowTransform,
            texture: script.leftElbowTexture,
            alpha: script.leftElbowAlpha,
            isEnabled: script.isLeftElbow,
            scale: script.leftElbowSize,
            offsetX: script.leftElbowOffsetX,
            offsetY: script.leftElbowOffsetY,
            rotation: script.leftElbowRotation
        }
    );

    // Configure left shoulder
    configureGraphicVisual(
        {
            transformObject: script.leftShoulderTransform,
            texture: script.leftShoulderTexture,
            alpha: script.leftShoulderAlpha,
            isEnabled: script.isLeftShoulder,
            scale: script.leftShoulderSize,
            offsetX: script.leftShoulderOffsetX,
            offsetY: script.leftShoulderOffsetY,
            rotation: script.leftShoulderRotation
        }
    );

    toggleAllImages( false );
}

function configureGraphicVisual( option )
{
    var mainImage = option.transformObject.getSceneObject().getFirstComponent("Component.Image");
    mainImage.enabled = option.isEnabled;

    if( option.isEnabled )
    {
        var scaleMultiplier = 0.65;
        var offsetMultiplier = 0.8;
        var rotationDivider = 0.0175;
        images.push({
            image: mainImage,
            alpha: option.alpha
        });

        var materialClone = script.imageMaterial.clone();

        mainImage.mainMaterial = materialClone;

        if( option.texture )
        {
            mainImage.mainPass.baseTex = option.texture;
        }

        mainImage.mainPass.baseColor = setAlpha( mainImage.mainPass.baseColor , option.alpha );

        var screenTransform = option.transformObject;
        var anchors = screenTransform.anchors;

        anchors.left = -option.scale * scaleMultiplier;
        anchors.right = option.scale * scaleMultiplier;

        anchors.top = option.scale * scaleMultiplier;
        anchors.bottom = -option.scale * scaleMultiplier;

        var offsetVec = new vec3(option.offsetX, option.offsetY, 0).uniformScale(offsetMultiplier);

        anchors.left += offsetVec.x;
        anchors.right += offsetVec.x;
        anchors.top += offsetVec.y;
        anchors.bottom += offsetVec.y;

        var rotateTo = screenTransform.rotation.multiply(
            quat.angleAxis( ( option.rotation * rotationDivider ), vec3.forward() )
        );

        screenTransform.rotation = rotateTo ;
    }
}

function initRotator()
{
    headTrackerTransform = getParentScreenTransform( script.headTransform );
    headRotateToward = getParentScreenTransform( getTransformDirection( script.headRotateTo ) );

    neckTrackerTransform = getParentScreenTransform( script.neckTransform );
    neckRotateToward = getParentScreenTransform( getTransformDirection( script.neckRotateTo ) );


    leftShoulderTrackerTransform = getParentScreenTransform( script.leftShoulderTransform );
    leftShoulderRotateToward = getParentScreenTransform( getTransformDirection( script.leftShoulderRotateTo ) );

    leftElbowTrackerTransform = getParentScreenTransform( script.leftElbowTransform );
    leftElbowRotateToward = getParentScreenTransform( getTransformDirection( script.leftElbowRotateTo ) );

    leftHandTrackerTransform = getParentScreenTransform( script.leftHandTransform );
    leftHandRotateToward = getParentScreenTransform( getTransformDirection( script.leftHandRotateTo ) );


    rightShoulderTrackerTransform = getParentScreenTransform( script.rightShoulderTransform );
    rightShoulderRotateToward = getParentScreenTransform( getTransformDirection( script.rightShoulderRotateTo ) );

    rightElbowTrackerTransform = getParentScreenTransform( script.rightElbowTransform );
    rightElbowRotateToward = getParentScreenTransform( getTransformDirection( script.rightElbowRotateTo ) );

    rightHandTrackerTransform = getParentScreenTransform( script.rightHandTransform );
    rightHandRotateToward = getParentScreenTransform( getTransformDirection( script.rightHandRotateTo ) );
}

function rotateBodyAnchors()
{
    setAutoRotation( headTrackerTransform, headRotateToward );
    setAutoRotation( neckTrackerTransform, neckRotateToward );

    setAutoRotation( leftShoulderTrackerTransform, leftShoulderRotateToward );
    setAutoRotation( leftElbowTrackerTransform, leftElbowRotateToward );
    setAutoRotation( leftHandTrackerTransform, leftHandRotateToward );

    setAutoRotation( rightShoulderTrackerTransform, rightShoulderRotateToward );
    setAutoRotation( rightElbowTrackerTransform, rightElbowRotateToward );
    setAutoRotation( rightHandTrackerTransform, rightHandRotateToward );
}

function setAutoRotation( imageTransform, rotateToward )
{
    if( !rotateToward )
    {
        return;
    }
    var rotateTo = getRotation( imageTransform, rotateToward );
    imageTransform.rotation = rotateTo;
}

function getTransformDirection( inputName )
{
    switch( inputName )
    {
        case "RightShoulder":
            return script.rightShoulderTransform;
        case "RightElbow":
            return script.rightElbowTransform;
        case "RightHand":
            return script.rightHandTransform;
        case "LeftShoulder":
            return script.leftShoulderTransform;
        case "LeftElbow":
            return script.leftElbowTransform;
        case "LeftHand":
            return script.leftHandTransform;
        case "Head":
            return script.headTransform;
        case "Neck":
            return script.neckTransform;
        case "None":
            return;
    }
}

function getRotation( screenTransformA, screenTransformB )
{
    var firstPointPos = screenTransformA.position;
    var secondPointPos = screenTransformB.position;
    var angle = getAngle( firstPointPos, secondPointPos );
    var rot = quat.angleAxis( angle, vec3.back() );
    return rot;
}

function getAngle( a, b )
{
    var offset = b.sub( a );
    return Math.atan2( -offset.y, offset.x );
}

function getParentScreenTransform( obj )
{
    if( !isNull( obj ) )
    {
        return obj.getSceneObject().getParent().getFirstComponent( "Component.ScreenTransform" );
    }
    else
    {
        return null;
    }
}

function toggleAllImages( isEnabled )
{
    for(var i = 0; i < images.length; i++)
    {
        images[i].image.enabled = isEnabled;
    }
}

function setAllImagesTransparency( alpha )
{
    for(var i = 0; i < images.length; i++)
    {
        images[i].image.mainPass.baseColor = setMultipliedAlpha( images[i].image.mainPass.baseColor, images[i].alpha, alpha );
    }
}

function showHint( status )
{
    if( script.hintControllerScript )
    {
        if( script.hintControllerScript.api.show && script.hintControllerScript.api.hide )
        {
            if( status == true )
            {
                script.hintControllerScript.api.show();
            }
            else
            {
                script.hintControllerScript.api.hide();
            }
        }
    }
}

function setAlpha( color, alpha )
{
    return new vec4( color.r, color.g, color.b, alpha );
}

function setMultipliedAlpha( color, startingAlpha, alpha )
{
    return new vec4( color.r, color.g, color.b, startingAlpha * alpha);
}

function checkInputValues()
{
    if( !script.headTransform )
    {
        print( "SkeletalController, ERROR: Please assign Head Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.neckTransform )
    {
        print( "SkeletalController, ERROR: Please assign Neck Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.rightShoulderTransform )
    {
        print( "SkeletalController, ERROR: Please assign Right Shoulder Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.rightElbowTransform )
    {
        print( "SkeletalController, ERROR: Please assign Right Elbow Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.rightHandTransform )
    {
        print( "SkeletalController, ERROR: Please assign Right Hand Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.leftShoulderTransform )
    {
        print( "SkeletalController, ERROR: Please assign Left Shoulder Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.leftElbowTransform )
    {
        print( "SkeletalController, ERROR: Please assign Left Elbow Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.leftHandTransform )
    {
        print( "SkeletalController, ERROR: Please assign Left Hand Image object tracker under the advanced checkbox" );
        return false;
    }

    if( !script.imageMaterial )
    {
        print( "SkeletalController, ERROR: Please assign sprite_material from resources panel to the script under the advanced checkbox" );
        return false;
    }

    if( !script.hintControllerScript )
    {
        print( "SkeletalController, WARNING: Please assign Object Tracking Hint Controller object to the script under the advanced checkbox" );
    }

    if( !script.skeletalHintScript )
    {
        print( "SkeletalController, WARNING: Please assign Skeletal Hint Controller object to the script under the advanced checkbox. Skeletal hint will not work until the Skeletal Hint Controller object gets assigned to the script" );
    }

    return true;
}

initialize();

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn );
