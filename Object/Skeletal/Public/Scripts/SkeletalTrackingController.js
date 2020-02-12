// -----JS CODE-----
// SkeletalTrackingController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that control the skeletal tracking behavior.

// @input string trackingType {"widget":"combobox", "values":[{"label":"Smooth", "value":"Smooth"}, {"label":"Precise", "value":"Precise"}]}
// @input float smoothMultiplier {"label":"Smoothness","widget":"slider", "min":0.1, "max":1.0, "step":0.1, "showIf": "trackingType", "showIfValue": "Smooth"}

// @input bool advanced = false
// @input Component.ObjectTracking headTracker {"showIf": "advanced"}
// @input Component.ObjectTracking neckTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightElbowTracker {"showIf": "advanced"}
// @input Component.ObjectTracking rightHandTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftShoulderTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftElbowTracker {"showIf": "advanced"}
// @input Component.ObjectTracking leftHandTracker {"showIf": "advanced"}

var trackingCount = 0;
var frameDelay = 1;
var initialized = false;
var delayedInitialized = false;
var isObjectTracking = false;
var trackingItems = [];
var originalsTracker = [];
var configLookup = {};
var missingFrameWindowSize = 1;
var adjustedFrameWindowSize = 1;
var HEAD_ID = "Head";
var NECK_ID = "Neck";
var LEFT_SHOULDER_ID = "LeftShoulder";
var LEFT_ELBOW_ID = "LeftElbow";
var LEFT_HAND_ID = "LeftHand";
var RIGHT_SHOULDER_ID = "RightShoulder";
var RIGHT_ELBOW_ID = "RightElbow";
var RIGHT_HAND_ID = "RightHand";
var MIN_NUMBER_OF_TRACKED_POINTS = 4;
var LOW_FPS_THRESHOLD = 1/27.0;
var avgFrameTime = 0;
var lastDeltaTimes = [];

script.api.skeletalStatus = skeletalStatus;

function onLensTurnOn()
{
    configureTrackingCallback();
    configureTrackers();
}

function onUpdate( eventData )
{
    lastDeltaTimes.push(getDeltaTime());
    while (lastDeltaTimes.length > missingFrameWindowSize) {
        lastDeltaTimes.shift();
    }
    avgFrameTime = 0;

    for (var i=0; i < lastDeltaTimes.length; i++) {
        avgFrameTime += lastDeltaTimes[i];
    }
    avgFrameTime /= lastDeltaTimes.length;

    if( initialized )
    {
        for(var i = 0; i < trackingItems.length; i++)
        {
            updateTrackerScore( trackingItems[i] );
        }

        if( script.trackingType == "Smooth" )
        {
            for(var i = 0; i < trackingItems.length; i++)
            {
                smoothFollow( trackingItems[i] );
            }
        }

        estimateWrists();

        if ( frameDelay > 0 )
        {
            frameDelay--;
            return;
        }
        else if ( frameDelay == 0 )
        {
            missingFrameWindowSize = 10;
            frameDelay = -1;
        }
        else if ( lastDeltaTimes.length >= missingFrameWindowSize )
        {
            adjustedFrameWindowSize = Math.min( missingFrameWindowSize, ( Math.ceil( missingFrameWindowSize * ( ( 1/30 ) / avgFrameTime ) ) ) );
            delayedInitialized = true;
        }
    }
}

function smoothFollow( trackerItems )
{
    var smoothing = getDeltaTime() * 0.9;

    var desiredWorldPosition = trackerItems.original.localPointToWorldPoint(new vec2(0, 0));
    var desiredSize = trackerItems.original.anchors.getSize();

    var currentWorldPosition= trackerItems.smoothObject.localPointToWorldPoint(new vec2(0, 0));
    var currentSize = trackerItems.smoothObject.anchors.getSize();

    // convert the smoothingMultiplier to be a number between 15 to 20 which are the best values for smooth tracking.
    var invertSmoothMultiplier = Math.abs( script.smoothMultiplier - 1 );
    var smoothRatio = ( invertSmoothMultiplier - ( -3.0 ) ) / ( ( -2.8 ) - ( -3.0 ) );
    smoothRatio = Math.max( 15, Math.min( smoothRatio, 20 ) );

    var t = Math.min( smoothing * smoothRatio, 1.0 );
    var sizeT = Math.min( smoothing * ( smoothRatio + 5 ), 0.9 );

    // Calculate the next position
    var newWorldPosition = vec3.lerp(currentWorldPosition, desiredWorldPosition, t);
    var newSize = vec2.lerp(currentSize, desiredSize, sizeT);

    // Apply next position
    var newAnchorCenter = trackerItems.smoothObject.worldPointToParentPoint(newWorldPosition);
    trackerItems.smoothObject.anchors.setCenter(newAnchorCenter);
    trackerItems.smoothObject.anchors.setSize(newSize);
}

function updateTrackerScore( trackerItem )
{
    var worldPosition = trackerItem.smoothObject.localPointToWorldPoint( new vec2( 0, 0 ) );
    var currentSize = trackerItem.smoothObject.anchors.getSize();

    trackerItem.tracker.lastTrackingPositions.push(worldPosition);
    trackerItem.tracker.lastTrackingSizes.push(currentSize);

    while (trackerItem.tracker.lastTrackingPositions.length >= missingFrameWindowSize)
    {
        trackerItem.tracker.lastTrackingPositions.shift();
        trackerItem.tracker.lastTrackingSizes.shift();
    }

    if ( trackerItem.isTracking() && isShaky( trackerItem ) )
    {
        trackerItem.tracker.trackingScore++;
    }
    else
    {
        trackerItem.tracker.trackingScore = 0;
    }

    var lastEnabled = trackerItem.tracker.isStable;
    trackerItem.tracker.isStable = trackerItem.tracker.trackingScore >= adjustedFrameWindowSize;

    if ( lastEnabled != trackerItem.tracker.isStable )
    {
        if ( lastEnabled )
        {
            onTrackingLost();
        }
        else
        {
            onTrackingFound();
            trackerItem.tracker.trackingStartTime = getTime();
        }
    }

    for( var i = 0; i < trackerItem.image.length; i++ )
    {
        if( !isNull( trackerItem.image[i] ) )
        {
            trackerItem.image[i].enabled = trackerItem.tracker.isStable && trackingCount >= MIN_NUMBER_OF_TRACKED_POINTS;
        }
    }
}

function isShaky( trackedItem )
{
    if ( trackedItem.tracker.lastTrackingSizes.length == 0)
    {
        return false;
    }

    var mean = new vec3(0,0,0);
    var variance = 0;
    var meanSize = new vec2(0,0);
    var sizeVariance = 0;
    var lastTrackedSizes = trackedItem.tracker.lastTrackingSizes;
    var lastTrackedPosition = trackedItem.tracker.lastTrackingPositions;

    for ( var i = 0; i < lastTrackedPosition.length; i++ )
    {
        meanSize = meanSize.add( lastTrackedSizes[i] );
    }
    
    meanSize = meanSize.uniformScale( 1 / lastTrackedPosition.length );
    for ( var i = 0; i < lastTrackedPosition.length; i++ )
    {
        sizeVariance += ( meanSize.x - lastTrackedSizes[i].x ) * ( meanSize.x - lastTrackedSizes[i].x );
    }

    if ( lastTrackedPosition.length > 1 )
    {
        mean = ( lastTrackedPosition[1].sub( lastTrackedPosition[0] ) );
        if (mean.length < 0.01) 
        {
            variance = 0;
        }
        else
        {
            mean = mean.normalize();
            for ( var i = 2; i < lastTrackedPosition.length; i++ )
            {
                var cur = ( lastTrackedPosition[i].sub( lastTrackedPosition[i-1] ) ).normalize();
                variance += mean.dot( cur );
                mean = cur;
            }
        }
    }

    variance /= lastTrackedPosition.length;
    sizeVariance /= lastTrackedPosition.length;

    // ignore spatial variance on low fps since singal doesn't support it well.
    if (avgFrameTime > LOW_FPS_THRESHOLD)
    {
        return sizeVariance < 0.15;
    }

    return variance < 0.8 && sizeVariance < 0.15;
}

function configureTracker(shouldTrack, tracker)
{
    if (shouldTrack)
    {
        tracker.trackingScore = 0;
        tracker.isStable = false;
        tracker.lastTrackingPositions = [];
        tracker.lastTrackingSizes = [];
        tracker.trackingStartTime = 0;
    }
}

function onTrackingFound()
{
    trackingCount++;
    if (trackingCount >= MIN_NUMBER_OF_TRACKED_POINTS)
    {
        isObjectTracking = true;
    }
}

function onTrackingLost()
{
    trackingCount--;
    if (trackingCount < MIN_NUMBER_OF_TRACKED_POINTS)
    {
        isObjectTracking = false;
    }
}

function configureTrackingCallback()
{
    configureTracker( script.headTracker.enabled, script.headTracker );
    configureTracker( script.neckTracker.enabled, script.neckTracker );

    configureTracker( script.rightHandTracker.enabled, script.rightHandTracker );
    configureTracker( script.rightElbowTracker.enabled, script.rightElbowTracker );
    configureTracker( script.rightShoulderTracker.enabled, script.rightShoulderTracker );

    configureTracker( script.leftHandTracker.enabled, script.leftHandTracker );
    configureTracker( script.leftElbowTracker.enabled, script.leftElbowTracker );
    configureTracker( script.leftShoulderTracker.enabled, script.leftShoulderTracker );
}

function configureTrackers()
{
    addToOriginalTracker(
        {
            id: HEAD_ID,
            trackerObject: script.headTracker,
        }
    );

    addToOriginalTracker(
        {
            id: NECK_ID,
            trackerObject: script.neckTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_HAND_ID,
            trackerObject: script.rightHandTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_ELBOW_ID,
            trackerObject: script.rightElbowTracker,
        }
    );

    addToOriginalTracker(
        {
            id: RIGHT_SHOULDER_ID,
            trackerObject: script.rightShoulderTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_HAND_ID,
            trackerObject: script.leftHandTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_ELBOW_ID,
            trackerObject: script.leftElbowTracker,
        }
    );

    addToOriginalTracker(
        {
            id: LEFT_SHOULDER_ID,
            trackerObject: script.leftShoulderTracker,
        }
    );

    var useSmoothing = (script.trackingType == "Smooth");
    for(var i = 0; i < originalsTracker.length; i++)
    {
        var config = initObjectConfig(originalsTracker[i], useSmoothing);
        trackingItems.push(config);
        configLookup[originalsTracker[i].id] = config;
        config.id = originalsTracker[i].id;
    }

    configLookup["LeftHand"].isTracking = function() {
        return (configLookup["LeftHand"].tracker.isTracking() || (configLookup["LeftElbow"].isTracking() && configLookup["LeftShoulder"].isTracking()))
    };
    configLookup["RightHand"].isTracking = function() {
        return (configLookup["RightHand"].tracker.isTracking() || (configLookup["RightElbow"].isTracking() && configLookup["RightShoulder"].isTracking()))
    };

    initialized = true;
}

function addToOriginalTracker( option )
{
    originalsTracker.push(option);
}

function initObjectConfig(data, useSmoothing)
{
    var tracker = data.trackerObject;
    var originalScreenTransform = getScreenTransform( tracker );
    var smoothObject = originalScreenTransform;

    var trackerSceneObject = tracker.getSceneObject();
    var childImages = [];
    var childCount = trackerSceneObject.getChildrenCount();
    for( var i = 0; i < childCount; i++ )
    {
        childImages[i] = trackerSceneObject.getChild( i );
    }

    if (useSmoothing)
    {
        var newObject = global.scene.createSceneObject( "SmoothFollower" );
        newObject.setParent( script.getSceneObject() );
        var targetScreenTransform = newObject.createComponent( "Component.ScreenTransform" );

        for( var i = 0; i < childImages.length; i++ )
        {
            childImages[i].setParent( newObject );
        }
        targetScreenTransform.scale = originalScreenTransform.scale;

        smoothObject = targetScreenTransform;
    }

    var config =
    {
        original: originalScreenTransform,
        smoothObject: smoothObject,
        tracker: tracker,
        image: childImages,
        isTracking: function(){return tracker.isTracking()},
    };

    return config;
}

function estimateHandPosition(wrist, elbow, shoulder)
{
    if ( wrist.tracker.isTracking() )
    {
        return wrist.original.localPointToWorldPoint( new vec2( 0, 0 ) );
    }
    
    if ( elbow.tracker.isTracking() && shoulder.tracker.isTracking() )
    {
        var armDir = ( elbow.original.localPointToWorldPoint( new vec2( 0, 0 )).sub(
            shoulder.original.localPointToWorldPoint( new vec2( 0, 0 ) ) ) ).uniformScale( 1.1 );

        return ( elbow.original.localPointToWorldPoint( new vec2( 0, 0 ) ).add( armDir ) );
    }

    return false;
}

function estimateWrists()
{
    var estimationLeft = estimateHandPosition( configLookup["LeftHand"], configLookup["LeftElbow"], configLookup["LeftShoulder"] );
    
    if ( estimationLeft )
    {
        var newAnchorCenter = configLookup["LeftHand"].smoothObject.worldPointToParentPoint( estimationLeft );
        configLookup["LeftHand"].original.anchors.setCenter( newAnchorCenter );
    }

    var estimationRight = estimateHandPosition( configLookup["RightHand"], configLookup["RightElbow"], configLookup["RightShoulder"] );

    if ( estimationRight )
    {
        var newAnchorCenter = configLookup["RightHand"].smoothObject.worldPointToParentPoint( estimationRight );
        configLookup["RightHand"].original.anchors.setCenter( newAnchorCenter );
    }
}

function getScreenTransform( obj )
{
    return obj.getSceneObject().getFirstComponent( "Component.ScreenTransform" );
}

function skeletalStatus()
{
    var status =
    {
        isObjectTracking: isObjectTracking,
        fpsStatus: avgFrameTime > LOW_FPS_THRESHOLD,
        isDelayedInitialized: delayedInitialized
    };

    return status;
}

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn );

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);