// -----JS CODE-----
// SegmentationController.js
// Version: 0.0.1
// Event: Initialized
// Description: A controller script that allows you to set a segmented background image 
// or color effect masked by a segmentation mask texture

// @input Asset.Texture segmentationTexture

// @input bool useBackgroundColor = false { "label":"Use Background Color" }
// @ui {"widget": "group_start", "label": "Background Color", "showIf":"useBackgroundColor"}
// @input vec3 color {"widget":"color"}
// @input float colorAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @ui {"widget": "group_end"}

// @input bool useImage = true
// @ui {"widget": "group_start", "label": "Image", "showIf":"useImage"}
// @input Asset.Texture imageTexture
// @input float imageAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input int imageBlendMode = 0 {"widget":"combobox", "values":[{"label":"Normal", "value":0}, {"label": "Screen", "value": 3}, {"label": "Multiply", "value": 10} ]}

// @input bool tiled = false
// @input int fillMode = 1 {"widget":"combobox", "values":[{"label":"Fit", "value":0}, {"label":"Fill", "value":1}, {"label":"Stretch", "value":2}],  "showIf":"tiled", "showIfValue":"false"}
// @ui {"widget": "group_start", "label": "Tiled Settings", "showIf":"tiled", "showIfValue":"true"}
// @input float tileDensity = 1.0 {"widget":"slider", "min":1.0, "max":20.0, "step":1.0}
// @input bool scrolling = false
// @input float scrollSpeedX = -0.2 {"widget":"slider", "min":-5.0, "max":5.0, "step":0.1, "showIf":"scrolling"}
// @input float scrollSpeedY = -0.2 {"widget":"slider", "min":-5.0, "max":5.0, "step":0.1, "showIf":"scrolling"}
// @ui {"widget": "group_end"}
// @ui {"widget": "group_end"}

// @input bool usePostEffect = true
// @ui {"widget": "group_start", "label": "Post Effect", "showIf":"usePostEffect"}
// @input Asset.Texture postEffectTexture
// @input float postEffectAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @ui {"widget": "group_end"}

// @input bool advanced = true
// @ui {"widget": "group_start", "label": "Advanced", "showIf":"advanced"}
// @input SceneObject[] enableOnSegmentation
// @input Component.Camera cameraMasked
// @input Component.Camera orthographicCameraMasked
// @input Component.Image backgroundColorBillboard
// @input Component.Image imageBillboard
// @input Asset.Texture deviceCameraTexture
// @input Asset.Material tileMat
// @input Asset.Material tileScrollingMat
// @input Asset.Material fillMat
// @input Component.PostEffectVisual postEffect
// @ui {"widget": "group_end"}

var segmentationTextureReady = false;
var fillModeEnums = [ StretchMode.Fit, StretchMode.Fill, StretchMode.Stretch ];

function turnOn( eventData )
{
	configureSegmentationMasks();
	configureBackgroundColor();
	configureImage();
	configurePostEffect();
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind( turnOn );

function update( eventData )
{
	if( !script.segmentationTexture )
	{
		print( "SegmentationController, ERROR: Make sure to set the segmentation texture");
		return;
	}

	if( !segmentationTextureReady )
	{
		segmentationTextureReady = script.segmentationTexture.control.getWidth() > 1;
		
		for( var i = 0; i < script.enableOnSegmentation.length; i++ )
		{
			if( script.enableOnSegmentation[i] )
			{
				script.enableOnSegmentation[i].enabled = segmentationTextureReady;
			}
		}
	}
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind( update );

function configureSegmentationMasks()
{
	if( !script.segmentationTexture )
	{
		print( "SegmentationController, ERROR: Make sure to set the segmentation texture");
		return;
	}

	if( !script.cameraMasked )
	{
		print( "SegmentationController, ERROR: Camera Masked is not set");
		return;
	}

	if( !script.orthographicCameraMasked )
	{
		print( "SegmentationController, ERROR: Orthographic Camera Masked is not set");
		return;
	}

	script.cameraMasked.maskTexture = script.segmentationTexture;
	script.orthographicCameraMasked.maskTexture = script.segmentationTexture;
}

function configureBackgroundColor()
{
	if( !script.backgroundColorBillboard )
	{
		print( "SegmentationController, ERROR: Background color billboard is not set");
		return;
	}

	if( script.useBackgroundColor )
	{
		script.backgroundColorBillboard.mainPass.baseColor = new vec4( script.color.r, script.color.g, script.color.b, script.colorAlpha );
	}
	else
	{
		script.backgroundColorBillboard.enabled = false;
	}
}

function configureImage()
{
	if( script.useImage )
	{
		if( imageSafetyCheck() )
		{
			if( script.tiled )
			{
				configureTileImage();
			}
			else
			{
				configureFillImage();
			}
	
			script.imageBillboard.mainPass.blendMode = script.imageBlendMode;
			script.imageBillboard.mainPass.baseColor = new vec4( 1.0, 1.0, 1.0, script.imageAlpha );
		}
	}
	else
	{
		if(script.imageBillboard){
			script.imageBillboard.enabled = false;
		}
	}
}

function imageSafetyCheck()
{
	if( !script.imageBillboard )
	{
		print( "SegmentationController, ERROR: Make sure the image Billboard is set");
		return false;
	}

	if( !script.tileMat || !script.tileScrollingMat || !script.fillMat )
	{
		print( "SegmentationController, ERROR: Materials are not set");
		return false;
	}

	if( !script.imageTexture )
	{
		print( "SegmentationController, ERROR: No image texture set");
		return false;
	}

	return true;
}

function configureFillImage()
{
	script.imageBillboard.mainMaterial = script.fillMat;
	script.imageBillboard.mainPass.baseTex = script.imageTexture;
	script.imageBillboard.stretchMode = fillModeEnums[ script.fillMode ];
}

function configureTileImage()
{
	if( script.scrolling )
	{
		script.imageBillboard.mainMaterial = script.tileScrollingMat;
	}
	else
	{
		script.imageBillboard.mainMaterial = script.tileMat;
	}

	script.imageBillboard.mainPass.baseTex = script.imageTexture;

	var billboardImage = script.imageBillboard.mainPass.baseTex;
	var imageSize = new vec2( billboardImage.getWidth(), billboardImage.getHeight() );
	var deviceSize = new vec2( script.deviceCameraTexture.getWidth(), script.deviceCameraTexture.getHeight() );
	var imageAspect = imageSize.x / imageSize.y;
	var deviceAspect = deviceSize.x / deviceSize.y;

	script.imageBillboard.mainPass.uv2Scale = new vec2( script.tileDensity * deviceAspect, script.tileDensity * imageAspect );
	
	if( script.scrolling )
	{
		script.imageBillboard.mainPass.uv2Offset = new vec2( script.scrollSpeedX, script.scrollSpeedY );
	}
	else
	{
		script.imageBillboard.mainPass.uv2Offset = new vec2( -script.tileDensity * deviceAspect / 2.0, 0.0 );
	}
}

function configurePostEffect()
{
	if( !script.postEffect )
	{
		print( "SegmentationController, ERROR: Make sure the Post Effect is set");
		return false;
	}

	if( script.usePostEffect )
	{
		script.postEffect.enabled = true;

		if( script.postEffectTexture )
		{
			script.postEffect.mainPass.baseTex = script.postEffectTexture;
		}

		script.postEffect.mainPass.baseColor = new vec4( 1.0, 1.0, 1.0, script.postEffectAlpha );
	}
	else
	{
		script.postEffect.enabled = false;
	}
}
