// -----JS CODE-----
// FaceInVideoController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the face in video template.

// @ui {"widget":"group_start", "label":"Video Control"}
// @input bool showVideo = true
// @input Asset.Texture movie { "label":"Background Video" }
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

// @ui {"widget":"group_start", "label":"Tracked Image Control"}
// @input Asset.Texture mainImage { "label":"Image" }
// @input Asset.Texture opacityTexture { "label":"Opacity Image" }
// @input float imageSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float imageOffsetX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float imageOffsetY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float imageRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float imageAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input int imageSort {"widget":"combobox", "values":[{"label":"In Front of Video", "value":0}, {"label":"Behind Video", "value":1}, {"label":"Manual Sorting", "value":2}]}
// @ui {"widget":"group_end"}

//@ui {"widget":"label"}

//@ui {"widget":"separator"}

// @input bool advanced
// @ui {"widget":"group_start", "label":"Tracking Control", "showIf": "advanced"}
// @input bool trackPosition = true {"label":"Position"}
// @input bool trackScale = true {"label":"Scale"}
// @input bool trackRotation = true {"label":"Rotation"}
//@ui {"widget":"group_end"}

//@ui {"widget":"separator", "showIf": "advanced"}

// @input Component.ScreenTransform trackedImageTransform {"showIf": "advanced"}
// @input Component.Image movieImage {"showIf": "advanced"}
// @input Component.ScreenTransform extentsTarget {"showIf": "advanced"}
// @input Component.Image backgroundImage {"showIf": "advanced"}
// @input Component.Image errorImage {"showIf": "advanced"}

var animData;
var provider;
var timer = 0;
var timeLimit;
var startTime = 0;
var startingPositionOffset;
var startingScaleOffset;
var startingRotationOffset;
var animatedTextureInitialized = false;

initialized();

function initialized(){
    findTrackingData();

    if( checkProperties() ){
        setupTracking();
        configureImageTransform({
            texture: script.mainImage,
            opacityTexture: script.opacityTexture,
            objectsToTransform: script.trackedImageTransform,
            scaleToAdd: script.imageSize,
            xOffsetToAdd: script.imageOffsetX,
            yOffsetToAdd: script.imageOffsetY,
            rotationToAdd: script.imageRotation,
            imageAlpha: script.imageAlpha
        });
    }
}

function configureImageTransform( option ){
    var scaleMultiplier = 20;
    var degToRad = 0.0175;
    var screenTransform = option.objectsToTransform;

    var trackedImageComp = getImageComponent( screenTransform );
    trackedImageComp.mainPass.baseTex = option.texture;

    if( option.opacityTexture ){
        trackedImageComp.mainPass.opacityTex = option.opacityTexture;
    }

    trackedImageComp.mainPass.baseColor = 
        setAlpha( trackedImageComp.mainPass.baseColor , option.imageAlpha );

    var anchors = screenTransform.anchors;
    var offsets = screenTransform.offsets;

    var aspectScaling = new vec2(1,1);
    var aspect = option.texture.control.getAspect();
    if(aspect > 1){
        aspectScaling.x *= aspect;
    } else {
        aspectScaling.y /= aspect;
    }

    offsets.setSize( aspectScaling.uniformScale( option.scaleToAdd * scaleMultiplier ) );

    var offsetVec = new vec3( option.xOffsetToAdd, option.yOffsetToAdd, 0 );

    anchors.left += offsetVec.x;
    anchors.right += offsetVec.x;
    anchors.top += offsetVec.y;
    anchors.bottom += offsetVec.y;

    var rotateTo = screenTransform.rotation.multiply(
        quat.angleAxis( ( option.rotationToAdd * degToRad ), vec3.forward() )
    );

    screenTransform.rotation = rotateTo ;

    startingPositionOffset = screenTransform.anchors.getCenter();
    startingScaleOffset = screenTransform.offsets.getSize();
    startingRotationOffset = screenTransform.rotation;
}

function setupTracking(){
    if( !script.showVideo ){
        script.movieImage.enabled = false;

        if( script.movie ){
            print( "WARNING: Please remove Background Video texture from the script component to save memory." )
        }
    }
    else{
        script.movieImage.mainPass.baseTex = script.movie;
    }

    script.errorImage.enabled = false;
    script.movieImage.extentsTarget = script.extentsTarget;

    if( script.imageSort == 0 ){
        var trackedImageMesh = getImageComponent( script.trackedImageTransform );
        var moveImageMesh = getImageComponent( script.movieImage );
        trackedImageMesh.setRenderOrder( moveImageMesh.getRenderOrder() + 1 );

        if( script.backgroundImage ){
            script.backgroundImage.setRenderOrder( moveImageMesh.getRenderOrder() - 1 );
        }
    }
    else if( script.imageSort == 1 ){
        var trackedImageMesh = getImageComponent( script.trackedImageTransform );
        var moveImageMesh = getImageComponent( script.movieImage );
        trackedImageMesh.setRenderOrder( moveImageMesh.getRenderOrder() - 1 );

        if( script.backgroundImage ){
            script.backgroundImage.setRenderOrder( trackedImageMesh.getRenderOrder() - 1 );
        }
    }

    if( !script.showVideo ){
        animatedTextureInitialized = true;
    }
    else{
        playAnimatedTexture();
    }

    setAnimatedTextureTime(0);
}

function playAnimatedTexture(){
    var isAnimated = !!script.movie.control.getDuration;
    if( isAnimated ){
        provider = script.movie.control;
        provider.pause();
        provider.isAutoplay = false;
        if( animData.duration + 1 != provider.getFramesCount() ){
            showError( "ERROR: Exported tracking data frame numbers don't match the animated texture duration. Make sure to export the whole comp in After Effects or trim your comp." );
            return;
        }
        var providerDurationCheck = roundToNearest( animData.duration / animData.frameRate );
        var providerDuration = roundToNearest( provider.getDuration() )
        if( providerDuration != providerDurationCheck ){
            showError( "ERROR: You need to set the duration on animated texture to: " + providerDurationCheck );
            return;
        }
        animatedTextureInitialized = true;
    }
    else{
        showError( "ERROR: Please assign a 2D Animated Texture file in the Video's texture input" );
        return;
    }
}

function setAnimatedTextureTime( overtime ){
    startTime = getTime() - (overtime || 0);
}

function positionImage(frame){
    if( animData.positions[frame] != null ){
        if( script.trackPosition ){
            var screenPos = animData.positions[frame];
            var offsetPos = startingPositionOffset.add( screenPos );
            var worldPoint = script.extentsTarget.localPointToWorldPoint( offsetPos );
            var parentPoint = script.trackedImageTransform.worldPointToParentPoint( worldPoint );
            script.trackedImageTransform.anchors.setCenter( parentPoint );
        }

        if( script.trackScale ){
            var trackedScale = animData.scales[frame];
            trackedScale = new vec2( trackedScale.x, trackedScale.y ).uniformScale( 1/100 );
            var newScale = startingScaleOffset.mult( trackedScale );
            script.trackedImageTransform.offsets.setSize( newScale );
        }

        if( script.trackRotation ){
            var rot = quat.fromEulerVec( animData.rotations[frame].uniformScale( -Math.PI/180 ) );
            var rotateTo = startingRotationOffset.multiply( rot );
            script.trackedImageTransform.rotation = rotateTo;
        }
    }
}


function trackAnimatedTexture(){
    if( animatedTextureInitialized ){
        var frameNumber = Math.floor( timer * animData.frameRate );
        if( frameNumber <= animData.duration ){
            positionImage( frameNumber );

            if( script.showVideo )
            {
                provider.playFromFrame( frameNumber, -1 );
            }
        }
    }
}

function onUpdate(){
    playBackTimer();
    trackAnimatedTexture();
}

function playBackTimer(){
    timer = ( getTime() - startTime );
    if( timer > timeLimit ){
        var overtime = timer - timeLimit;
        overtime = overtime % timeLimit;
        setAnimatedTextureTime(overtime);
    }
}

function findTrackingData(){
    var results = [];
    var allComponents = script.getSceneObject().getAllComponents();
    for( var i = 0; i < allComponents.length; i++ ){
        if( allComponents[i].api ){
            if( allComponents[i].api.animData ){
                results.push(allComponents[i].api.animData);
            }
        }
    }

    if (results.length < 1) {
        return;
    }

    if (results.length > 1) {
        showError( "WARNING: There are multiple Tracking Data scripts on the faceInVideoController [EDIT_ME] object. Please make sure to only have one" );
    }

    animData = results[results.length-1];
    timeLimit = animData.duration / animData.frameRate;
}

function roundToNearest( value ){
    return Math.round( value * 1000 ) / 1000;
}

function getImageComponent( obj ){
    return obj.getSceneObject().getFirstComponent( "Component.Image" );
}
function setAlpha( color, alpha ){
    return new vec4( color.r, color.g, color.b, alpha );
}

function checkProperties(){
    if (!animData) {
        showError( "ERROR: Tracking data not found. Please place the tracking data on the FaceInVideoController [EDIT_ME] object" );
        return false;
    }

    if( !script.mainImage ){
        showError( "ERROR: Please assign a texture to Image texture input on FaceInVideoController script." );
        return false;
    }

    if( !script.trackedImageTransform ){
        showError( "ERROR: Please make sure Tracked Image object exists and assign the Tracked Image object under the advanced checkbox" );
        return false;
    }

    if( !script.movieImage ){
        showError( "ERROR: Please make sure Movie Image object exists and assign the Movie Image object under the advanced checkbox" );
        return false;
    }

    if( !script.extentsTarget ){
        showError( "ERROR: Please make sure Movie Image object exists and assign the Movie Image object under the advanced checkbox" );
        return false;
    }

    if( !script.backgroundImage ){
        showError( "WARNING: Please make sure Background Image object exists and assigned under the advanced checkbox" );
    }

    if( !script.movie && script.showVideo ){
        showError( "ERROR: Please assign a video or animated texture to Video input on FaceInVideoController script." );
        return false;
    }
    return true;
}

function showError( message ){
    if( script.errorImage ){
        script.errorImage.enabled = true;
    }
    print( "FaceInVideoController, " + message );
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);