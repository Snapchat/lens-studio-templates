// -----JS CODE-----
// PetTrackingController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the pet template.

// @input int trackingType = 0 {"widget": "combobox", "values":[{"label": "Cat", "value": 0}, {"label": "Dog", "value": 1}, {"label": "Cat or Dog", "value": 2}]}

// @ui {"widget":"separator"}

// @input bool isRightEyeTracking = false {"label":"Right Eye Tracking"}
// @ui {"widget":"group_start", "label":"Right Eye Customize", "showIf": "isRightEyeTracking"}
// @input Asset.Texture rightEyeTexture { "label":"Right Eye" }
// @input float rightEyeSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float rightEyeOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightEyeOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightEyeRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightEyeAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool isLeftEyeTracking = false {"label":"Left Eye Tracking"}
// @ui {"widget":"group_start", "label":"Left Eye Customize", "showIf": "isLeftEyeTracking"}
// @input Asset.Texture leftEyeTexture { "label":"Left Eye" }
// @input float leftEyeSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float leftEyeOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftEyeOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftEyeRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftEyeAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool isNoseTracking = false {"label":"Nose Tracking"}
// @ui {"widget":"group_start", "label":"Nose Customize", "showIf": "isNoseTracking"}
// @input Asset.Texture noseTexture { "label":"Nose" }
// @input float noseSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float noseOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float noseOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float noseRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float noseAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool isCenterTracking = false {"label":"Center Tracking"}
// @ui {"widget":"group_start", "label":"Center Customize", "showIf": "isCenterTracking"}
// @input Asset.Texture centerTexture { "label":"Center" }
// @input float centerSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float centerOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float centerOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float centerRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float centerAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool advanced = false 
// @input SceneObject orthographicCamera {"showIf": "advanced"}
// @input Asset.Material spriteMaterial {"showIf": "advanced"}
// @input Component.ScriptComponent hintControllerScript {"showIf": "advanced"}
// @input Asset.ObjectPrefab[] trackingObjectsPrefabs {"showIf": "advanced"}

var rightEyeTracker;
var leftEyeTracker;
var noseTracker;
var centerTracker;
var trackersRoot;
var frameDelay = 1;
var trackingCount = 0;
var initialized = false;

function onLensTurnOn()
{
    if( initialize() )
    {
        initialized = true;
    }
}

function onUpdate()
{
    if( initialized )
    {
        // we need to wait a frame to make sure the prefab api is available and then configuring it.
        if ( frameDelay > 0 )
        {
            frameDelay--;
            return;
        }
        else if ( frameDelay == 0 )
        {
            configureObjects();
            frameDelay = -1;
        }
    }
}

function initialize()
{
    if( !script.orthographicCamera )
    {
        print( "PetTrackingController, ERROR: Please assign Orthographic Camera scene object under the advanced checkbox" );
        return false;
    }

    if( !script.spriteMaterial )
    {
        print( "PetTrackingController, ERROR: Please assign sprite_material from resources panel to the script under the advanced checkbox" );
        return false;
    }

    if( !script.hintControllerScript )
    {
        print( "PetTrackingController, WARNING: Please assign Object Tracking Hint Controller object to the script under the advanced checkbox" );
    }

    if( script.trackingObjectsPrefabs )
    {
        if( script.trackingObjectsPrefabs[script.trackingType] )
        {
            trackersRoot = script.trackingObjectsPrefabs[script.trackingType].instantiate( script.orthographicCamera );

            // Make sure nothing is visible until we initialize the trackers
            setComponentEnabledRecursively( trackersRoot, "Component.Image" , false );
        }
        else
        {
            print( "PetTrackingController, ERROR: Please make sure" + trackingTypeToString() + "prefab is assigned under advanced checkbox at Tracking object and on value " + script.trackingType );
            return false;
        }
    }
    else
    {
        print( "PetTrackingController, ERROR: Please make sure tracking prefab exist under the advanced checkbox" );
        return false;
    }

    return true;
}

function configureObjects()
{
    if( setTracker( trackersRoot ) )
    {
        configureTrackingVisual();
        configureTrackingCallback();
        setHintText();
        script.removeEvent(updateEvent);
    }
}

function setTracker( rootTrackerObject )
{
    var objectsScript = rootTrackerObject.getFirstComponent("Component.ScriptComponent");

    if(objectsScript.api)
    {
        if( !objectsScript.api.rightEyeTracker )
        {
            print( "PetTrackingController, ERROR: Please make sure right eye tracker is exist inside the trackers prefab" );
            return false;
        }

        if( !objectsScript.api.leftEyeTracker )
        {
            print( "PetTrackingController, ERROR: Please make sure left eye tracker is exist inside the trackers prefab" );
            return false;
        }

        if( !objectsScript.api.centerTracker )
        {
            print( "PetTrackingController, ERROR: Please make sure center tracker is exist inside the trackers prefab" );
            return false;
        }

        if( !objectsScript.api.noseTracker )
        {
            print( "PetTrackingController, ERROR: Please make sure nose tracker is exist inside the trackers prefab" );
            return false;
        }

        rightEyeTracker = objectsScript.api.rightEyeTracker;
        leftEyeTracker = objectsScript.api.leftEyeTracker;
        centerTracker = objectsScript.api.centerTracker;
        noseTracker = objectsScript.api.noseTracker;

        return true;
    }
    else
    {
        print( "PetTrackingController, ERROR: Please make sure ObjectTrackingProperties is attached to the trackers prefab" );
        return false;
    }
}

function configureTrackingVisual()
{
    // make sure the Object Tracking is not visible until we set the transform and texture
    setComponentEnabledRecursively( trackersRoot, "Component.ObjectTracking" , false );

    // Configure right eye
    assignTexture({
        trackerObject: rightEyeTracker,
        texture: script.rightEyeTexture,
        alpha: script.rightEyeAlpha,
        isEnabled: script.isRightEyeTracking,
    });

    configureScreenTransform({
        objectsToTransform: rightEyeTracker,
        scaleToAdd: script.rightEyeSize,
        xOffsetToAdd: script.rightEyeOffsetX,
        yOffsetToAdd: script.rightEyeOffsetY,
        rotationToAdd: script.rightEyeRotation
    });

    // Configure left eye
    assignTexture({
        trackerObject: leftEyeTracker,
        texture: script.leftEyeTexture,
        alpha: script.leftEyeAlpha,
        isEnabled: script.isLeftEyeTracking,
    });

    configureScreenTransform({
        objectsToTransform: leftEyeTracker,
        scaleToAdd: script.leftEyeSize,
        xOffsetToAdd: script.leftEyeOffsetX,
        yOffsetToAdd: script.leftEyeOffsetY,
        rotationToAdd: script.leftEyeRotation
    });

    // Configure nose
    assignTexture({
        trackerObject: noseTracker,
        texture: script.noseTexture,
        alpha: script.noseAlpha,
        isEnabled: script.isNoseTracking,
    });

    configureScreenTransform({
        objectsToTransform: noseTracker,
        scaleToAdd: script.noseSize,
        xOffsetToAdd: script.noseOffsetX,
        yOffsetToAdd: script.noseOffsetY,
        rotationToAdd: script.noseRotation
    });

    // Configure center
    assignTexture({
        trackerObject: centerTracker,
        texture: script.centerTexture,
        alpha: script.centerAlpha,
        isEnabled: script.isCenterTracking,
    });

    configureScreenTransform({
        objectsToTransform: centerTracker,
        scaleToAdd: script.centerSize,
        xOffsetToAdd: script.centerOffsetX,
        yOffsetToAdd: script.centerOffsetY,
        rotationToAdd: script.centerRotation
    });

    setComponentEnabledRecursively( trackersRoot, "Component.Image" , true );
    setComponentEnabledRecursively( trackersRoot, "Component.ObjectTracking" , true );

}

function configureTrackingCallback()
{
    configureTracker( script.isRightEyeTracking, rightEyeTracker );
    configureTracker( script.isLeftEyeTracking, leftEyeTracker );
    configureTracker( script.isCenterTracking, centerTracker );
    configureTracker( script.isNoseTracking, noseTracker );
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
                print("PetTrackingController, ERROR: Please assign texture to the texture input");
            }
        }
    }
}

function setComponentEnabledRecursively(obj, componentType, status) 
{
    var childCount = obj.getChildrenCount();
    for( var i = 0; i < childCount; i++ )
    {
        var childObject = obj.getChild( i );
        setComponentEnabledRecursively(childObject, componentType, status);
    }

    var componentCount = obj.getComponentCount(componentType);
    for( var i = 0; i < componentCount; i++ )
    {
        var component = obj.getComponentByIndex(componentType, i);
        component.enabled = status;
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

function trackingTypeToString()
{
    switch( script.trackingType )
    {
        case 0:
        return " cat tracking ";
        case 1:
        return " dog tracking ";
        case 2:
        return " pet tracking ";
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

function setHintText()
{
    if( script.hintControllerScript.api.updateHintText )
    {
        script.hintControllerScript.api.updateHintText( script.trackingType );
    }
}

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn ); 

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);