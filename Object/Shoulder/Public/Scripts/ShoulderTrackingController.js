// -----JS CODE-----
// ShoulderTrackingController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the shoulder template.

// @input bool isCenterTracking = false {"label":"Center"}
// @ui {"widget":"group_start", "label":"Center Customization", "showIf": "isCenterTracking"}
// @input Asset.Texture centerTexture { "label":"Center" }
// @input float centerSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float centerOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float centerOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float centerRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float centerAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool isLeftShoulderTracking = false {"label":"Left Shoulder"}
// @ui {"widget":"group_start", "label":"Left Shoulder Customization", "showIf": "isLeftShoulderTracking"}
// @input Asset.Texture leftShoulderTexture { "label":"Left Shoulder" }
// @input float leftShoulderSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float leftShoulderOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftShoulderOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftShoulderRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftShoulderAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool isRightShoulderTracking = false {"label":"Right Shoulder"}
// @ui {"widget":"group_start", "label":"Right Shoulder Customization", "showIf": "isRightShoulderTracking"}
// @input Asset.Texture rightShoulderTexture { "label":"Right Shoulder" }
// @input float rightShoulderSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float rightShoulderOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightShoulderOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightShoulderRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightShoulderAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool advanced = false 
// @input SceneObject orthographicCamera {"showIf": "advanced"}
// @input Asset.Material spriteMaterial {"showIf": "advanced"}
// @input Component.ObjectTracking rightShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking centerTracker {"showIf": "advanced"}
// @input Component.ScriptComponent hintControllerScript {"showIf": "advanced"}

var trackingCount = 0;

// Object Tracking callbacks needs to be run before anything else.
configureTrackingCallback();

function onLensTurnOn()
{
    if( initialize() )
    {
        configureTrackingVisual();
    }
}

function initialize()
{
    if( !script.orthographicCamera )
    {
        print( "ShoulderTrackingController, ERROR: Please assign Orthographic Camera scene object under the advanced checkbox" );
        return false;
    }

    if( !script.spriteMaterial )
    {
        print( "ShoulderTrackingController, ERROR: Please assign sprite_material from resources panel to the script under the advanced checkbox" );
        return false;
    }

    if( !script.rightShoulderTracker )
    {
        print( "ShoulderTrackingController, ERROR: Please make sure Right Shoulder Tracker object exist and assign it to the script under advanced checkbox" );
        return false;
    }

    if( !script.leftShoulderTracker )
    {
        print( "ShoulderTrackingController, ERROR: Please make sure Left Shoulder Tracker object exist and assign it to the script under advanced checkbox" );
        return false;
    }

    if( !script.centerTracker )
    {
        print( "ShoulderTrackingController, ERROR: Please make sure Center Tracker object exist and assign it to the script under advanced checkbox" );
        return false;
    }

    if( !script.hintControllerScript )
    {
        print( "ShoulderTrackingController, WARNING: Please assign Object Tracking Hint Controller object to the script under the advanced checkbox" );
    }

    return true;
}

function configureTrackingVisual()
{
    // Configure right shoulder
    assignTexture({
        trackerObject: script.rightShoulderTracker,
        texture: script.rightShoulderTexture,
        alpha: script.rightShoulderAlpha,
        isEnabled: script.isRightShoulderTracking,
    });

    configureScreenTransform({
        objectsToTransform: script.rightShoulderTracker,
        scaleToAdd: script.rightShoulderSize,
        xOffsetToAdd: script.rightShoulderOffsetX,
        yOffsetToAdd: script.rightShoulderOffsetY,
        rotationToAdd: script.rightShoulderRotation
    });

    // Configure left shoulder
    assignTexture({
        trackerObject: script.leftShoulderTracker,
        texture: script.leftShoulderTexture,
        alpha: script.leftShoulderAlpha,
        isEnabled: script.isLeftShoulderTracking,
    });

    configureScreenTransform({
        objectsToTransform: script.leftShoulderTracker,
        scaleToAdd: script.leftShoulderSize,
        xOffsetToAdd: script.leftShoulderOffsetX,
        yOffsetToAdd: script.leftShoulderOffsetY,
        rotationToAdd: script.leftShoulderRotation
    });

    // Configure center
    assignTexture({
        trackerObject: script.centerTracker,
        texture: script.centerTexture,
        alpha: script.centerAlpha,
        isEnabled: script.isCenterTracking,
    });

    configureScreenTransform({
        objectsToTransform: script.centerTracker,
        scaleToAdd: script.centerSize,
        xOffsetToAdd: script.centerOffsetX,
        yOffsetToAdd: script.centerOffsetY,
        rotationToAdd: script.centerRotation
    });
}

function configureTrackingCallback()
{
    configureTracker( script.isRightShoulderTracking, script.rightShoulderTracker );
    configureTracker( script.isLeftShoulderTracking, script.leftShoulderTracker );
    configureTracker( script.isCenterTracking, script.centerTracker );
}

function configureTracker(shouldTrack, tracker)
{
    if (shouldTrack)
    {
        tracker.onObjectFound = onTrackingFound;
        tracker.onObjectLost = onTrackingLost;
    }
}

function onTrackingFound()
{
    trackingCount++;
    showHint(false);
}

function onTrackingLost()
{
    trackingCount--;
    if (trackingCount == 0)
    {
        showHint(true);
    }
}

function assignTexture( option )
{
    option.trackerObject.getSceneObject().enabled = option.isEnabled;

    if( option.isEnabled )
    {
        for( var i = 0; i < option.trackerObject.getSceneObject().getChildrenCount(); i++ )
        {
            var childObject = option.trackerObject.getSceneObject().getChild( i );
            var mainImage = childObject.getFirstComponent("Component.Image");
            var materialClone = script.spriteMaterial.clone();

            mainImage.mainMaterial = materialClone;
            mainImage.mainPass.baseColor = setAlpha( mainImage.mainPass.baseColor , option.alpha );

            if( option.texture )
            {
                mainImage.mainPass.baseTex = option.texture;
            }
            else
            {
                print("ShoulderTrackingController, ERROR: Please assign texture to the texture input");
            }
        }
    }
}

function configureScreenTransform( option )
{
    var scaleMultiplier = 1.5;
    var offsetMultiplier = 1.5;
    var rotationDivider = 0.0175;

    for( var i = 0; i < option.objectsToTransform.getSceneObject().getChildrenCount(); i++ )
    {
        var childObject = option.objectsToTransform.getSceneObject().getChild( i );
        var screenTransform = childObject.getFirstComponent("Component.ScreenTransform");
        var anchors = screenTransform.anchors;

        anchors.left = -option.scaleToAdd * scaleMultiplier;
        anchors.right = option.scaleToAdd * scaleMultiplier;

        anchors.top = option.scaleToAdd * scaleMultiplier;
        anchors.bottom = -option.scaleToAdd * scaleMultiplier;

        var offsetVec = new vec3(option.xOffsetToAdd, option.yOffsetToAdd, 0).uniformScale(offsetMultiplier);

        anchors.left += offsetVec.x;
        anchors.right += offsetVec.x;
        anchors.top += offsetVec.y;
        anchors.bottom += offsetVec.y;

        var rotateTo = screenTransform.rotation.multiply(
        quat.angleAxis( ( option.rotationToAdd * rotationDivider ), vec3.forward() )
        );

        screenTransform.rotation = rotateTo ;
    }
}

function setAlpha( color, alpha )
{
    return new vec4( color.r, color.g, color.b, alpha );
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

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn );