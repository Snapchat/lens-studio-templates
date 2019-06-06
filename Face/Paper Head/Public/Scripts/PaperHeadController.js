// -----JS CODE-----
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the paper head template. Has
// a large assortment of exposed inputs and the logic to actually modify the 
// template content based on these inputs

// @input bool addMouth {"label":"Mouth"}
// @ui {"widget":"group_start", "label":"Mouth", "showIf":"addMouth"}
// @input int mouthType = 0 {"widget": "combobox", "values":[{"label": "Texture Sequence", "value": 0}, {"label": "Animated Texture", "value": 1}, {"label": "Sliding Mouth", "value": 2}]}
// @input Asset.Texture[] mouthTextures {"showIf": "mouthType", "showIfValue": "0"}
// @input Asset.Texture mouthAnimatedTexture {"label":"Animated Texture","showIf": "mouthType", "showIfValue": "1"}
// @input Asset.Texture slideHeadTexture {"label":"Head Texture","showIf": "mouthType", "showIfValue": "2"}
// @input Asset.Texture slideMouthTexture {"label":"Mouth Texture","showIf": "mouthType", "showIfValue": "2"}
// @input bool mouthReverseAnimate {"label":"Reverse Animate","showIf": "mouthType", "showIfValue": "1"}
// @input float mouthSize = 0.5 {"label":"Size", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float offsetMouthX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float offsetMouthY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float offsetSlide = 0.0 {"label":"Mouth Offset", "widget":"slider", "min":-5.0, "max":5.0, "step":0.01 , "showIf": "mouthType", "showIfValue": "2"}
// @input float slideAmount = 1.0 {"label":"Slide Amount", "widget":"slider", "min":-5.0, "max":5.0, "step":0.01 , "showIf": "mouthType", "showIfValue": "2"}
// @input float mouthRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float mouthAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input bool flipNowMouth {"label":"Flip Image"}
// @input bool autoFlipMouth {"label":"Flip With Head"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addNose {"label":"Nose"}
// @ui {"widget":"group_start", "label":"Nose", "showIf":"addNose"}
// @input Asset.Texture noseTexture
// @input float noseSize = 0.5 {"label":"Size","widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float offsetNoseX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float offsetNoseY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float noseRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float noseAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input bool flipNowNose {"label":"Flip Image"}
// @input bool autoFlipNose {"label":"Flip With Head"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addLeftEye {"label":"Left Eye"}
// @ui {"widget":"group_start", "label":"Left Eye", "showIf":"addLeftEye"}
// @input int leftEyeType = 0 {"widget": "combobox", "values":[{"label": "Texture Sequence", "value": 0}, {"label": "Animated Texture", "value": 1}], "label":"Eye Type"}
// @input Asset.Texture[] leftEyeTextures {"showIf": "leftEyeType", "showIfValue": "0"}
// @input Asset.Texture leftEyeAnimatedTexture {"showIf": "leftEyeType", "showIfValue": "1"}
// @input bool leftEyeReverseAnimate {"label":"Reverse Animate","showIf": "leftEyeType", "showIfValue": "1"}
// @input float leftEyeSize = 0.5 {"label":"Size","widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float offsetLeftEyeX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float offsetLeftEyeY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float leftEyeRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float leftEyeAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input bool flipNowLeftEye {"label":"Flip Image"}
// @input bool autoFlipLeftEye {"label":"Flip With Head"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addRightEye {"label":"Right Eye"}
// @ui {"widget":"group_start", "label":"Right Eye", "showIf":"addRightEye"}
// @input int rightEyeType = 0 {"widget": "combobox", "values":[{"label": "Texture Sequence", "value": 0}, {"label": "Animated Texture", "value": 1}], "label":"Eye Type"}
// @input Asset.Texture[] rightEyeTextures {"showIf": "rightEyeType", "showIfValue": "0"}
// @input Asset.Texture rightEyeAnimatedTexture {"showIf": "rightEyeType", "showIfValue": "1"}
// @input bool rightEyeReverseAnimate {"label":"Reverse Animate","showIf": "rightEyeType", "showIfValue": "1"}
// @input float rightEyeSize = 0.5 {"label":"Size","widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input float offsetRightEyeX = 0.0 {"label":"Offset X","widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float offsetRightEyeY = 0.0 {"label":"Offset Y", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input float rightEyeRotation = 0.0 {"label":"Rotate","widget":"slider", "min":0.0, "max":360.0, "step":0.5}
// @input float rightEyeAlpha = 1.0 {"label":"Alpha","widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input bool flipNowRightEye {"label":"Flip Image"}
// @input bool autoFlipRightEye {"label":"Flip With Head"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"DO NOT EDIT", "showIf": "hideMe", "showIfValue": true}
// @input bool hideMe = false {"showIf": "hideMe"}
// @input Component.ScriptComponent properties
// @ui {"widget":"group_end"}

var headTransform;
var headForward = vec3.forward();
var mouthTextureProvider;
var rightEyeTextureProvider;
var leftEyeTextureProvider;
var mouthOpenValue = 3.7;
var mouthCloseValue = 2.7;
var eyeOpenValue = 1.7;
var eyeCloseValue = 1.0;
var noseConfigured = false;
var leftEyeConfigured = false;
var rightEyeConfigured = false;
var mouthConfigured = false;
var isFaceFlipped = false;

function onLensTurnOn()
{
    configureNose();
    configureLeftEye();
    configureRightEye();
    configureMouth();
}
var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn ); 

function onUpdateEvent( eventData )
{
    calculateHeadFlip();
    controlNose();
    controlLeftEye();
    controlRightEye();
    controlMouth();
}
var updateEvent = script.createEvent( "UpdateEvent" );
updateEvent.bind( onUpdateEvent ); 

function configureNose()
{
    if( script.addNose == false )
    {
        script.properties.api.noseBinding.getSceneObject().enabled = script.addNose;
        return;
    }

    if( !script.properties.api.noseImage )
    {
        print( "PaperHeadController, ERROR: Please assign nose image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.noseBinding )
    {
        print( "PaperHeadController, ERROR: Please assign nose binding to PaperHeadProperties script." );
        return;
    }

    if( !script.noseTexture )
    {
        print( "PaperHeadController, ERROR: Please assign nose texture to the script." );
        return;
    }

    script.properties.api.noseImage.mainPass.baseTex = script.noseTexture;

    setAlpha( script.properties.api.noseImage, script.noseAlpha );

    configureParentTransform({
        objectToTransform: script.properties.api.noseImage.getSceneObject().getTransform(),
        scaleToAdd: script.noseSize,
        xOffsetToAdd: script.offsetNoseX,
        yOffsetToAdd: script.offsetNoseY,
        rotationToAdd: script.noseRotation
    });

    flipLookAt( script.properties.api.noseImage, script.flipNowNose );

    noseConfigured = true;
}

function controlNose()
{
    if( noseConfigured )
    {
        autoFlipImage( script.autoFlipNose, script.properties.api.noseImage );
    }
}

function configureLeftEye()
{
    if( script.addLeftEye == false )
    {
        script.properties.api.leftEyeImage.getSceneObject().enabled = script.addLeftEye;
        return;
    }

    if( !script.properties.api.leftEyeImage )
    {
        print( "PaperHeadController, ERROR: Please assign left eye image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.leftEyeTrackerBottom )
    {
        print( "PaperHeadController, ERROR: Please assign left eye bottom tracker image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.leftEyeTrackerTop )
    {
        print( "PaperHeadController, ERROR: Please assign left eye top tracker image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.leftEyeBinding )
    {
        print( "PaperHeadController, ERROR: Please assign left eye binding to PaperHeadProperties script." );
        return;
    }

    if( script.leftEyeType == 0 )
    {
        if( script.leftEyeTextures[0] )
        {
            script.properties.api.leftEyeImage.mainPass.baseTex = script.leftEyeTextures[0];
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign left eye texture sequence" );
            return;
        }
    }
    else
    {
        if( script.leftEyeAnimatedTexture )
        {
            var isAnimated = !!script.leftEyeAnimatedTexture.control.getDuration;
            if( isAnimated )
            {
                leftEyeTextureProvider = script.leftEyeAnimatedTexture.control;
                leftEyeTextureProvider.isAutoplay = false;
                script.properties.api.leftEyeImage.mainPass.baseTex = script.leftEyeAnimatedTexture;
            }
            else
            {
                print( "PaperHeadController, ERROR: Please assign a 2D Animated Texture file in the left eye's texture input" );
                return;
            }
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign animated left eye texture" );
            return;
        }
    }

    setAlpha( script.properties.api.leftEyeImage, script.leftEyeAlpha );

    configureParentTransform({
        objectToTransform: script.properties.api.leftEyeImage.getSceneObject().getTransform(),
        scaleToAdd: script.leftEyeSize,
        xOffsetToAdd: script.offsetLeftEyeX,
        yOffsetToAdd: script.offsetLeftEyeY,
        rotationToAdd: script.leftEyeRotation
    });

    flipLookAt( script.properties.api.leftEyeImage, script.flipNowLeftEye );

    leftEyeConfigured = true;
}

function controlLeftEye()
{
    if( leftEyeConfigured )
    {
        if( script.leftEyeType == 0 && script.leftEyeTextures[0] )
        {
            setCustomTexture({
                pointA: script.properties.api.leftEyeTrackerTop,
                pointB: script.properties.api.leftEyeTrackerBottom,
                minPoint: eyeCloseValue,
                maxPoint: eyeOpenValue,
                textureInput: script.leftEyeTextures,
                imageToSet: script.properties.api.leftEyeImage
            });
        }
        else if( script.leftEyeType == 1 && script.leftEyeAnimatedTexture )
        {
            setAnimatedTextures({
                pointA: script.properties.api.leftEyeTrackerTop,
                pointB: script.properties.api.leftEyeTrackerBottom,
                minPoint: eyeCloseValue,
                maxPoint: eyeOpenValue,
                animatedTextureInput: script.leftEyeAnimatedTexture,
                reverseAnimate: script.leftEyeReverseAnimate,
                provider: leftEyeTextureProvider
            });
        }

        autoFlipImage( script.autoFlipLeftEye, script.properties.api.leftEyeImage );

    }
}

function configureRightEye()
{
    if( script.addRightEye == false )
    {
        script.properties.api.rightEyeImage.getSceneObject().enabled = script.addRightEye;
        return;
    }

    if( !script.properties.api.rightEyeImage )
    {
        print( "PaperHeadController, ERROR: Please assign right eye image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.rightEyeTrackerBottom )
    {
        print( "PaperHeadController, ERROR: Please assign right eye bottom tracker image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.rightEyeTrackerTop )
    {
        print( "PaperHeadController, ERROR: Please assign right eye top tracker image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.rightEyeBinding )
    {
        print( "PaperHeadController, ERROR: Please assign right eye binding to PaperHeadProperties script." );
        return;
    }

    if( script.rightEyeType == 0 )
    {
        if( script.rightEyeTextures[0] )
        {
            script.properties.api.rightEyeImage.mainPass.baseTex = script.rightEyeTextures[0];
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign right eye texture sequence" );
            return;
        }
    }
    else
    {
        if( script.rightEyeAnimatedTexture )
        {
            var isAnimated = !!script.rightEyeAnimatedTexture.control.getDuration;
            if( isAnimated )
            {
                rightEyeTextureProvider = script.rightEyeAnimatedTexture.control;
                rightEyeTextureProvider.isAutoplay = false;
                script.properties.api.rightEyeImage.mainPass.baseTex = script.rightEyeAnimatedTexture;
            }
            else
            {
                print( "PaperHeadController, ERROR: Please assign a 2D Animated Texture file in the right eye's texture input" );
                return;
            }
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign animated right eye texture" );
            return;
        }
    }

    setAlpha( script.properties.api.rightEyeImage, script.rightEyeAlpha );

    configureParentTransform({
        objectToTransform: script.properties.api.rightEyeImage.getSceneObject().getTransform(),
        scaleToAdd: script.rightEyeSize,
        xOffsetToAdd: script.offsetRightEyeX,
        yOffsetToAdd: script.offsetRightEyeY,
        rotationToAdd: script.rightEyeRotation
    });

    flipLookAt( script.properties.api.rightEyeImage, script.flipNowRightEye );

    rightEyeConfigured = true;
}

function controlRightEye()
{
    if( rightEyeConfigured )
    {
        if( script.rightEyeType == 0 && script.rightEyeTextures[0] )
        {
            setCustomTexture({
                pointA: script.properties.api.rightEyeTrackerTop,
                pointB: script.properties.api.rightEyeTrackerBottom,
                minPoint: eyeCloseValue,
                maxPoint: eyeOpenValue,
                textureInput: script.rightEyeTextures,
                imageToSet: script.properties.api.rightEyeImage
            });
        }
        else if( script.rightEyeType == 1 && script.rightEyeAnimatedTexture )
        {
            setAnimatedTextures({
                pointA: script.properties.api.rightEyeTrackerTop,
                pointB: script.properties.api.rightEyeTrackerBottom,
                minPoint: eyeCloseValue,
                maxPoint: eyeOpenValue,
                animatedTextureInput: script.rightEyeAnimatedTexture,
                reverseAnimate: script.rightEyeReverseAnimate,
                provider: rightEyeTextureProvider
            });
        }
        autoFlipImage( script.autoFlipRightEye, script.properties.api.rightEyeImage );
    }
}

function configureMouth()
{
    if( script.addMouth == false )
    {
        script.properties.api.slidingMouthImage.getSceneObject().enabled = script.addMouth;
        script.properties.api.headImage.getSceneObject().enabled = script.addMouth;
        script.properties.api.mouthImage.getSceneObject().enabled = script.addMouth;
        return;
    }

    if( !script.properties.api.mouthTrackerBottom )
    {
        print( "PaperHeadController, ERROR: Please assign mouth bottom tracker image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.mouthTrackerTop )
    {
        print( "PaperHeadController, ERROR: Please assign mouth top tracker image to PaperHeadProperties script." );
        return;
    }

    if( script.mouthType <= 1 )
    {
        configureAnimatedMouth();
    }
    else
    {
        configureSlidingMouth();
    }
}

function configureAnimatedMouth()
{
    if( !script.properties.api.mouthImage )
    {
        print( "PaperHeadController, ERROR: Please assign mouth image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.mouthBinding )
    {
        print( "PaperHeadController, ERROR: Please assign mouth binding to PaperHeadProperties script." );
        return;
    }

    if( script.mouthType == 0 )
    {
        if( script.mouthTextures[0] )
        {
            script.properties.api.mouthImage.mainPass.baseTex = script.mouthTextures[0];
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign mouth texture sequence" );
            return;
        }
    }
    else
    {
        if( script.mouthAnimatedTexture )
        {
            var isAnimated = !!script.mouthAnimatedTexture.control.getDuration;
            if( isAnimated )
            {
                mouthTextureProvider = script.mouthAnimatedTexture.control;
                mouthTextureProvider.isAutoplay = false;
                script.properties.api.mouthImage.mainPass.baseTex = script.mouthAnimatedTexture;
            }
            else
            {
                print( "PaperHeadController,  ERROR: Please assign a 2D Animated Texture file in the mouth  's texture input" );
                return;
            }
        }
        else
        {
            print( "PaperHeadController, ERROR: Please assign animated mouth texture" );
            return;
        }
    }

    script.properties.api.slidingMouthImage.getSceneObject().enabled = false;
    script.properties.api.headImage.getSceneObject().enabled = false;

    setAlpha( script.properties.api.mouthImage, script.mouthAlpha );

    configureParentTransform({
        objectToTransform: script.properties.api.mouthImage.getSceneObject().getTransform(),
        scaleToAdd: script.mouthSize,
        xOffsetToAdd: script.offsetMouthX,
        yOffsetToAdd: script.offsetMouthY,
        rotationToAdd: script.mouthRotation
    });

    flipLookAt( script.properties.api.mouthImage, script.flipNowMouth );
    mouthConfigured = true;
}

function configureSlidingMouth()
{
    if( !script.properties.api.slidingMouthImage )
    {
        print( "PaperHeadController, ERROR: Please assign sliding mouth image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.headImage )
    {
        print( "PaperHeadController, ERROR: Please assign head image to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.slidingMouthBinding )
    {
        print( "PaperHeadController, ERROR: Please assign sliding mouth binding to PaperHeadProperties script." );
        return;
    }

    if( !script.properties.api.headCenter )
    {
        print( "PaperHeadController, ERROR: Please assign head center image to PaperHeadProperties script." );
        return;
    }

    if( script.slideMouthTexture && script.slideHeadTexture )
    {
        script.properties.api.slidingMouthImage.mainPass.baseTex = script.slideMouthTexture;

        script.properties.api.headImage.mainPass.baseTex = script.slideHeadTexture;

        checkTextureSize( script.slideMouthTexture, script.slideHeadTexture );
    }
    else
    {
        print( "PaperHeadController, ERROR: Please assign head and mouth textures" );
        return;
    }

    script.properties.api.mouthImage.getSceneObject().enabled = false;

    setAlpha( script.properties.api.slidingMouthImage, script.mouthAlpha );

    setAlpha( script.properties.api.headImage, script.mouthAlpha );


    configureParentTransform({
        objectToTransform: script.properties.api.headImage.getSceneObject().getTransform(),
        scaleToAdd: script.mouthSize,
        xOffsetToAdd: script.offsetMouthX,
        yOffsetToAdd: script.offsetMouthY,
        rotationToAdd: script.mouthRotation
    });

    configureParentTransform({
        objectToTransform: script.properties.api.slidingMouthImage.getSceneObject().getTransform(),
        scaleToAdd: script.mouthSize,
        xOffsetToAdd: script.offsetMouthX,
        yOffsetToAdd: script.offsetMouthY,
        rotationToAdd: script.mouthRotation
    });

    flipLookAt( script.properties.api.slidingMouthImage, script.flipNowMouth );
    flipLookAt( script.properties.api.headImage, script.flipNowMouth );
    mouthConfigured = true;
}

function controlMouth()
{
    if( mouthConfigured )
    {
        if( script.mouthType == 0 )
        {
            setCustomTexture({
                pointA: script.properties.api.mouthTrackerTop,
                pointB: script.properties.api.mouthTrackerBottom,
                minPoint: mouthCloseValue,
                maxPoint: mouthOpenValue,
                textureInput: script.mouthTextures,
                imageToSet: script.properties.api.mouthImage
            });

            autoFlipImage( script.autoFlipMouth, script.properties.api.mouthImage );
        }
        else if( script.mouthType == 1 )
        {
            setAnimatedTextures({
                pointA: script.properties.api.mouthTrackerTop,
                pointB: script.properties.api.mouthTrackerBottom,
                minPoint: mouthCloseValue,
                maxPoint: mouthOpenValue,
                animatedTextureInput: script.mouthAnimatedTexture,
                reverseAnimate: script.mouthReverseAnimate,
                provider: mouthTextureProvider
            });

            autoFlipImage( script.autoFlipMouth, script.properties.api.mouthImage );
        }
        else if( script.mouthType == 2 )
        {
            setSlidingTransform({
                pointA: script.properties.api.mouthTrackerTop,
                pointB: script.properties.api.mouthTrackerBottom,
                maxPoint: mouthCloseValue,
                minPoint: mouthOpenValue,
                imageToSlide: script.properties.api.slidingMouthImage,
                headTransform: script.properties.api.headImage.getTransform()
            });

            autoFlipImage( script.autoFlipMouth, script.properties.api.slidingMouthImage );
            autoFlipImage( script.autoFlipMouth, script.properties.api.headImage );
        }
    }
}

function setCustomTexture( option )
{
    var dist = getDistance( option.pointA, option.pointB );
    var ratio = ( dist - option.minPoint ) / ( option.maxPoint - option.minPoint );

    ratio = Math.max( 0, Math.min ( ratio, 1.0 ) );

    var numTextures = option.textureInput.length;
    var adjustedIndex = Math.min( Math.floor( ratio * numTextures ), numTextures - 1 );
    var tex = option.textureInput[ adjustedIndex ];

     if( !tex )
     {
        print( "PaperHeadController, WARNING: Missing texture, make sure to set all the image sequence");
     }

    option.imageToSet.mainPass.baseTex = tex;
}

function setAnimatedTextures ( option )
{
    var dist = getDistance( option.pointA, option.pointB );
    var ratio = ( dist - option.minPoint ) / ( option.maxPoint - option.minPoint );
    ratio = Math.max( 0, Math.min ( ratio, 1.0 ) );

    var isAnimated = !!option.animatedTextureInput.control.getDuration;

    if( isAnimated )
    {
        var numTextures = option.animatedTextureInput.control.getFramesCount();
        var adjustedIndex = Math.min( Math.floor( ratio * numTextures ), numTextures - 1 );

        if( option.reverseAnimate )
        {
            adjustedIndex = Math.abs ( adjustedIndex - numTextures ) - 1;
        }

        option.provider.pauseAtFrame ( adjustedIndex );
    }
    
}

function setSlidingTransform( option )
{
    var customSlideDistance = 0.45 * script.slideAmount;
    var headYPosition = option.headTransform.getLocalPosition().y;
    var dist = getDistance( option.pointA, option.pointB );
    var ratio = ( dist - option.minPoint ) / ( option.maxPoint - option.minPoint );

    ratio = Math.max( 0, Math.min ( ratio, 1 ) );

    var distanceToSlide = ( customSlideDistance * ratio ) - customSlideDistance;
    var imagePosition = option.imageToSlide.getTransform().getLocalPosition();

    option.imageToSlide.getTransform().setLocalPosition ( new vec3 (
        imagePosition.x,
        headYPosition + (distanceToSlide + script.offsetSlide),
        imagePosition.z )
    );
}

function getDistance( pointA, pointB )
{
    return pointA.getTransform().getWorldPosition().distance( pointB.getTransform().getWorldPosition() );
}

function autoFlipImage( shouldFlip, image )
{
    if ( shouldFlip )
    {
        image.flipX = isFaceFlipped;
    }
}

function calculateHeadFlip()
{
    var dot = 0;
    
    if( script.properties.api.headCenter )
    {
        headTransform = script.properties.api.headCenter.getTransform();
        headForward = headTransform.forward.projectOnPlane(vec3.up());
        dot = headForward.dot(vec3.right());
    }

    var padding = 0.1;

    if(isFaceFlipped)
    {
        if(dot >= padding)
        {
            isFaceFlipped = false;
        }
    }
    else
    {
        if(dot <= -padding)
        {
            isFaceFlipped = true;
        }
    }
}

function flipLookAt( objectToFlip, isFlipped )
{
    var lookAtFlipObject = objectToFlip.getSceneObject().getFirstComponent( "Component.LookAtComponent" );

    if( isFlipped )
    {
        lookAtFlipObject.aimVectors = LookAtComponent.AimVectors.NegativeZAimYUp;
    }
    else
    {
        lookAtFlipObject.aimVectors = LookAtComponent.AimVectors.ZAimYUp;
    }
}

function configureParentTransform( option )
{
    var scaleMultiplier = 35;
    var offsetMultiplier = 10;
    var rotationDivider = 0.0175;

    var parentTransform = option.objectToTransform.getSceneObject().getParent().getTransform();

    var scaleTo = new vec3(
        parentTransform.getLocalScale().x + ( option.scaleToAdd * scaleMultiplier ),
        parentTransform.getLocalScale().y + ( option.scaleToAdd * scaleMultiplier ),
        parentTransform.getLocalScale().z + ( option.scaleToAdd * scaleMultiplier )
    );

    var offsetTo = new vec3(
        parentTransform.getLocalPosition().x + ( option.xOffsetToAdd * offsetMultiplier ),
        parentTransform.getLocalPosition().y + ( option.yOffsetToAdd * offsetMultiplier ),
        parentTransform.getLocalPosition().z
    );

    var rotateTo = parentTransform.getLocalRotation().multiply(
        quat.angleAxis( ( option.rotationToAdd * rotationDivider ), vec3.forward() )
    );

    parentTransform.setLocalScale( scaleTo );
    parentTransform.setLocalPosition( offsetTo );
    parentTransform.setLocalRotation( rotateTo );
}

function setAlpha( image, alpha )
{
    image.mainPass.baseColor = new vec4( image.mainPass.baseColor.r, image.mainPass.baseColor.g, image.mainPass.baseColor.b, alpha );
}

function checkTextureSize( textureOne, textureTwo )
{
    if( textureOne.getHeight() ==  textureTwo.getHeight() && textureOne.getWidth() == textureTwo.getWidth() )
    {
        return true;
    }
    else
    {
        print( "PaperHeadController, WARNING: Please make sure head and mouth texture size is the same" );
        return false;
    }
}