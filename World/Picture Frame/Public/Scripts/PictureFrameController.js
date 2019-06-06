//  PictureFrameController.js
//  Version: 0.0.3
//  Event: Lens Initialized
//  Description: Positions the frame and sets the image's picture

//  @ui {"widget": "group_start", "label": "Frame Settings"}
//    @input Asset.Texture picture
//    @input float pictureScale
//    @input float pictureGroundOffset
//    @input vec4 frameColor = {1,1,1,1} {"widget":"color"}
//    @input float frameStyle = 0 {"widget":"combobox", "values":[{"label":"Frame A", "value": 0}, {"label":"Frame B", "value": 1 }, {"label":"Frame C", "value": 2 }]}
//    @input float material = 0 {"widget":"combobox", "values":[{"label":"Glossy", "value": 0 }, {"label":"Matte", "value": 1}]}
//    @input float frameScale
//    @input float shadowDensity
//  @ui {"widget": "group_end"}

//  @input bool showAdvanced = false

//  @ui {"widget": "group_start", "label": "Object Links", "showIf":"showAdvanced"}
//    @input SceneObject pictureScalar
//    @input SceneObject frameAPieces
//    @input SceneObject frameBPieces
//    @input SceneObject frameCPieces
//    @input Component.Image pictureImage

//  @ui {"widget": "group_start", "label": "Frame A"}
//    @input SceneObject cornerTopLeft_a 
//    @input SceneObject cornerTopRight_a 
//    @input SceneObject cornerBottomLeft_a
//    @input SceneObject cornerBottomRight_a
//    @input SceneObject frameTop_a
//    @input SceneObject frameBottom_a
//    @input SceneObject frameLeft_a
//    @input SceneObject frameRight_a
//  @ui {"widget": "group_end"}

//  @ui {"widget": "group_start", "label": "Frame B"}
//    @input SceneObject cornerTopLeft_b
//    @input SceneObject cornerTopRight_b
//    @input SceneObject cornerBottomLeft_b
//    @input SceneObject cornerBottomRight_b
//    @input SceneObject frameTop_b
//    @input SceneObject frameBottom_b
//    @input SceneObject frameLeft_b
//    @input SceneObject frameRight_b
//  @ui {"widget": "group_end"}

//  @ui {"widget": "group_start", "label": "Frame C"}
//    @input SceneObject cornerTopLeft_c
//    @input SceneObject cornerTopRight_c
//    @input SceneObject cornerBottomLeft_c
//    @input SceneObject cornerBottomRight_c
//    @input SceneObject frameTop_c
//    @input SceneObject frameBottom_c
//    @input SceneObject frameLeft_c
//    @input SceneObject frameRight_c
//  @ui {"widget": "group_end"}

//	  @input SceneObject pictureCollisionAndCaster
//    @input Asset.Material glossy
//    @input Asset.Material matte
//  @ui {"widget": "group_end"}

// Init frame vars 
var frames = [script.frameAPieces, script.frameBPieces, script.frameCPieces];
var frameIndex = script.frameStyle;
var cornersTopRight = [script.cornerTopRight_a, script.cornerTopRight_b, script.cornerTopRight_c];
var cornersTopLeft = [script.cornerTopLeft_a, script.cornerTopLeft_b, script.cornerTopLeft_c];
var cornersBottomLeft = [script.cornerBottomLeft_a, script.cornerBottomLeft_b, script.cornerBottomLeft_c];
var cornersBottomRight = [script.cornerBottomRight_a, script.cornerBottomRight_b, script.cornerBottomRight_c];
var framesBottom = [script.frameBottom_a, script.frameBottom_b, script.frameBottom_c];
var framesTop = [script.frameTop_a, script.frameTop_b, script.frameTop_c];
var framesRight = [script.frameRight_a, script.frameRight_b, script.frameRight_c];
var framesLeft = [script.frameLeft_a, script.frameLeft_b, script.frameLeft_c];

// Setup local script vars
var cornerTopRight = cornersTopRight[frameIndex];
var cornerTopLeft = cornersTopLeft[frameIndex];
var cornerBottomLeft = cornersBottomLeft[frameIndex];
var cornerBottomRight = cornersBottomRight[frameIndex];
var frameTop = framesTop[frameIndex];
var frameBottom = framesBottom[frameIndex];
var frameLeft = framesLeft[frameIndex];
var frameRight = framesRight[frameIndex];
var framePieces = [ cornerTopRight, cornerTopLeft, cornerBottomLeft, cornerBottomRight, frameTop, frameBottom, frameLeft, frameRight, script.pictureCollisionAndCaster];
var materials = [script.glossy, script.matte];

// Enable the frame style based on user defined choice
for (var i = 0; i < frames.length; i++){
    if (i != parseInt(script.frameStyle)){
        frames[i].enabled = false;
    } else {
        frames[i].enabled = true;
    }
}

//Set frame Material 
var frameMaterial = materials[script.material];
for (var i = 0; i < framePieces.length; i++){
    framePieces[i].getFirstComponent("Component.MeshVisual").mainMaterial = frameMaterial;
}

// Set frame color
frameMaterial.mainPass.baseColor = script.frameColor;

// Set scales and positions
script.pictureScalar.getTransform().setLocalScale( new vec3( script.pictureScale, script.pictureScale, script.pictureScale ) );
script.pictureScalar.getTransform().setLocalPosition( new vec3( 0.0, script.pictureGroundOffset, 0.0 ) );

// Set the picture to be the image defined
script.pictureImage.mainPass.baseTex = script.picture;
script.pictureImage.mainPass.twoSided = true;

// Ge the width and height of the image
var scaledWidth = script.pictureImage.mainPass.baseTex.getWidth();
var scaledHeight = script.pictureImage.mainPass.baseTex.getHeight();

// Scale corners respectively 
var cornerScale = new vec3( script.frameScale, script.frameScale, script.frameScale );
cornerTopRight.getTransform().setLocalScale( cornerScale );
cornerTopLeft.getTransform().setLocalScale( cornerScale );
cornerBottomLeft.getTransform().setLocalScale( cornerScale );
cornerBottomRight.getTransform().setLocalScale( cornerScale );

// Set the shadow intensity
setShadowDensity();

// Position and scale frame pieces based on aspect ratio
adjustForAspectRatio();

// Adjustments for aspect ratio function
function adjustForAspectRatio()
{
	// Calculations for corners and edge pieces based on scaled width and height
	if( scaledWidth >= scaledHeight )
	{
		// Get wide aspect ratio
		var aspectRatio = scaledHeight / scaledWidth; 

		script.pictureImage.getTransform().setLocalPosition( new vec3( 0.0, aspectRatio / 2.0, 0.01 ) );
		
		cornerTopRight.getTransform().setLocalPosition( new vec3( 0.5, aspectRatio, 0.0 ) );
		cornerTopLeft.getTransform().setLocalPosition( new vec3( -0.5, aspectRatio, 0.0 ) );
		cornerBottomLeft.getTransform().setLocalPosition( new vec3( -0.5, 0.0, 0.0 ) );
		cornerBottomRight.getTransform().setLocalPosition( new vec3( 0.5, 0.0, 0.0 ) );

		frameTop.getTransform().setLocalPosition( new vec3( 0.0, aspectRatio, 0.0 ) );
		frameBottom.getTransform().setLocalPosition( new vec3( 0.0, 0.0, 0.0 ) );
		frameLeft.getTransform().setLocalPosition( new vec3( -0.5, aspectRatio/2.0, 0.0 ) );
		frameRight.getTransform().setLocalPosition( new vec3( 0.5, aspectRatio/2.0, 0.0 ) );

		frameTop.getTransform().setLocalScale( new vec3( 1.0, script.frameScale, script.frameScale ) );
		frameBottom.getTransform().setLocalScale( new vec3( 1.0, script.frameScale, script.frameScale ) );
		frameLeft.getTransform().setLocalScale( new vec3( aspectRatio, script.frameScale, script.frameScale ) );
		frameRight.getTransform().setLocalScale( new vec3( aspectRatio, script.frameScale, script.frameScale ) );

		script.pictureCollisionAndCaster.getTransform().setLocalScale( new vec3( 1.0, aspectRatio, 1.0 ) );
	}
	else
	{
		// Get tall aspect ratio
		var aspectRatio = scaledWidth / scaledHeight;

		script.pictureImage.getTransform().setLocalPosition( new vec3( 0.0, aspectRatio, 0.01 ) );
		
		cornerTopRight.getTransform().setLocalPosition( new vec3( aspectRatio / 2.0, 1.0, 0.0 ) );
		cornerTopLeft.getTransform().setLocalPosition( new vec3( -aspectRatio / 2.0, 1.0, 0.0 ) );
		cornerBottomLeft.getTransform().setLocalPosition( new vec3( -aspectRatio / 2.0, 0.0, 0.0 ) );
		cornerBottomRight.getTransform().setLocalPosition( new vec3( aspectRatio / 2.0, 0.0, 0.0 ) );

		frameTop.getTransform().setLocalPosition( new vec3( 0.0, 1.0, 0.0 ) );
		frameBottom.getTransform().setLocalPosition( new vec3( 0.0, 0.0, 0.0 ) );
		frameLeft.getTransform().setLocalPosition( new vec3( -aspectRatio / 2.0, 0.5, 0.0 ) );
		frameRight.getTransform().setLocalPosition( new vec3( aspectRatio / 2.0, 0.5, 0.0 ) );

		frameTop.getTransform().setLocalScale( new vec3( aspectRatio, script.frameScale, script.frameScale ) );
		frameBottom.getTransform().setLocalScale( new vec3( aspectRatio, script.frameScale, script.frameScale ) );
		frameLeft.getTransform().setLocalScale( new vec3( 1.0, script.frameScale, script.frameScale ) );
		frameRight.getTransform().setLocalScale( new vec3( 1.0, script.frameScale, script.frameScale ) );

		script.pictureCollisionAndCaster.getTransform().setLocalScale( new vec3( aspectRatio, 1.0, 1.0 ) );
	}
}


// Shadow density function
function setShadowDensity()
{
    setPartShadowDensity( cornerTopRight );
    setPartShadowDensity( cornerTopLeft );
    setPartShadowDensity( cornerBottomLeft );
    setPartShadowDensity( cornerBottomRight );

    setPartShadowDensity( frameTop );
    setPartShadowDensity( frameBottom );
    setPartShadowDensity( frameLeft );
    setPartShadowDensity( frameRight );

    setPartShadowDensity( script.pictureCollisionAndCaster );
}

// Sets the shadow density for each piece
function setPartShadowDensity( part ) 
{
    for( var i = 0; i < part.getComponentCount("Component.MeshVisual"); i++ ) {
        var mesh = part.getComponentByIndex( "Component.MeshVisual", i );
        mesh.shadowDensity = script.shadowDensity;
    }
}
