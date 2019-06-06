// TeamCelebrateController.js
// Version: 0.0.2
// Event: Lens Turned On
// Description: The primary script that drives the team celebrate template. Has
// a large assortment of exposed inputs and the logic to actually modify the 
// template content based on these inputs

//@input vec4 primaryColor = {1, 1, 1, 1} {"widget":"color"}
//@input vec4 secondaryColor = {1, 1, 1, 1} {"widget":"color"}
//@input bool useTertiaryColor = false
//@input vec4 tertiaryColor = {1, 1, 1, 1} {"showIf":"useTertiaryColor", "widget":"color"}
//@input Asset.Texture teamLogo

//@ui {"widget":"group_start", "label":"Confetti"}
//@input bool showConfetti = true
//@input float confettiIntensity = 0.5 {"showIf":"showConfetti", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@input bool customColorConfetti = false {"showIf":"showConfetti"}
//@input vec4 primaryConfettiColor = {1, 1, 1, 1} {"showIf":"customColorConfetti", "widget":"color"}
//@input vec4 secondaryConfettiColor = {1, 1, 1, 1} {"showIf":"customColorConfetti", "widget":"color"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Face Paint"}
//@input bool showFacePaint = true
//@input int facePaintType = 0 {"showIf":"showFacePaint", "widget": "combobox", "values":[{"label": "Lines", "value": 0}, {"label": "Swirls", "value": 1}, {"label": "Half", "value": 2}, {"label": "Quarter", "value": 3}, {"label": "Vertical Three", "value": 4}, {"label": "Horizontal Three", "value": 5}]}
//@input float facePaintAlpha = 0.6 {"showIf":"showFacePaint", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@input bool customColorFacePaint = false {"showIf":"showFacePaint"}
//@input vec4 primaryFacePaintColor = {1, 1, 1, 1} {"showIf":"customColorFacePaint", "widget":"color"}
//@input vec4 secondaryFacePaintColor = {1, 1, 1, 1} {"showIf":"customColorFacePaint", "widget":"color"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Face Logo"}
//@input bool showFaceLogo = true
//@input int faceLogoType = 0 {"showIf":"showFaceLogo", "widget": "combobox", "values":[{"label": "Left Eye", "value": 0}, {"label": "Right Eye", "value": 1}, {"label": "Full Face", "value": 2}, {"label": "Left Cheek", "value": 3}, {"label": "Right Cheek", "value": 4}, {"label": "Both Cheeks", "value": 5}]}
//@input float faceLogoAlpha = 0.6 {"showIf":"showFaceLogo", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Screen Logo"}
//@input bool showScreenLogo = true
//@input int logoPosition = 2 {"showIf":"showScreenLogo", "widget": "combobox", "values":[{"label": "Top Right", "value": 0}, {"label": "Top Left", "value": 1}, {"label": "Top Middle", "value": 2}, {"label": "Bottom Right", "value": 3}, {"label": "Bottom Left", "value": 4}, {"label": "Bottom Middle", "value": 5}]}
//@input float logoAlpha = 0.8 {"showIf":"showScreenLogo", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@input float logoSize = 0.3 {"showIf":"showScreenLogo", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@input float logoOffsetX = 0.0 {"showIf":"showScreenLogo", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
//@input float logoOffsetY = 0.0 {"showIf":"showScreenLogo", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Screen Banner"}
//@input bool showBanner = true
//@input Asset.Texture teamBanner {"showIf":"showBanner"}
//@input float teamBannerAlpha = 0.8 {"showIf":"showBanner", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@input float bannerOffsetY = 0.0 {"showIf":"showBanner", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Audio"}
//@input bool audio = false
//@input Asset.AudioTrackAsset audioTrack {"showIf":"audio"}
//@input bool looping = true {"showIf":"audio"}
//@input float volume = 1.0 {"showIf":"audio", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"DO NOT EDIT", "showIf": "hideMe", "showIfValue": true}
//@input bool hideMe = false {"showIf": "hideMe"}
//@input Component.ScriptComponent properties
//@ui {"widget":"group_end"}

init();

function init()
{
	configureConfetti();
	configureFacePaint();
	configureFaceLogos();
	configureScreenLogo();
	configureScreenBanner();
	configureAudio();
}

function configureConfetti()
{
	if( script.properties.api.confetti )
	{
		// Set Confetti Enabled
		script.properties.api.confetti.enabled = script.showConfetti;

		// Use default or custom colors
		var primaryConfettiColor = script.primaryColor;
		var secondaryConfettiColor = script.secondaryColor;
		var tertiaryConfettiColor = script.tertiaryColor;
		if( script.customColorConfetti )
		{
			primaryConfettiColor = script.primaryConfettiColor;
			secondaryConfettiColor = script.secondaryConfettiColor;
		}

		// Set Primary Confetti Color
		if(script.properties.api.confettiPrimaryMaterial)
		{
			primaryConfettiColor.a = 1;
			script.properties.api.confettiPrimaryMaterial.mainPass.colorStart = new vec3( primaryConfettiColor.r, primaryConfettiColor.g, primaryConfettiColor.b );
			script.properties.api.confettiPrimaryMaterial.mainPass.colorEnd = new vec3( primaryConfettiColor.r, primaryConfettiColor.g, primaryConfettiColor.b );

			script.properties.api.confettiPrimaryMaterial.mainPass.spawnMaxParticles = lerp(10.0, 600.0, script.confettiIntensity);
		}

		// Set Secondary Confetti Color
		if(script.properties.api.confettiSecondaryMaterial)
		{
			secondaryConfettiColor.a = 1;
			script.properties.api.confettiSecondaryMaterial.mainPass.colorStart = new vec3( secondaryConfettiColor.r, secondaryConfettiColor.g, secondaryConfettiColor.b );
			script.properties.api.confettiSecondaryMaterial.mainPass.colorEnd = new vec3( secondaryConfettiColor.r, secondaryConfettiColor.g, secondaryConfettiColor.b );

			script.properties.api.confettiSecondaryMaterial.mainPass.spawnMaxParticles = lerp(10.0, 600.0, script.confettiIntensity);
		}

		// Set Tertiary Confetti Color
		if( script.properties.api.tertiaryConfetti )
		{
			if(script.useTertiaryColor && script.properties.api.confettiTertiaryMaterial)
			{
				tertiaryConfettiColor.a = 1;
				script.properties.api.tertiaryConfetti.enabled = true;
				script.properties.api.confettiTertiaryMaterial.mainPass.colorStart = new vec3( tertiaryConfettiColor.r, tertiaryConfettiColor.g, tertiaryConfettiColor.b );
				script.properties.api.confettiTertiaryMaterial.mainPass.colorEnd = new vec3( tertiaryConfettiColor.r, tertiaryConfettiColor.g, tertiaryConfettiColor.b );
	
				script.properties.api.confettiTertiaryMaterial.mainPass.spawnMaxParticles = lerp(10.0, 600.0, script.confettiIntensity);
			}
			else
			{
				script.properties.api.tertiaryConfetti.enabled = false;
			}
		}
	}
}

function configureFacePaint()
{
	// Use default or custom colors
	var primaryFacePaintColor = script.primaryColor;
	var secondaryFacePaintColor = script.secondaryColor;
	var tertiaryFacePaintColor = script.tertiaryColor;
	if( script.customColorFacePaint )
	{
		primaryFacePaintColor = script.primaryFacePaintColor;
		secondaryFacePaintColor = script.secondaryFacePaintColor;
	}
	
	// Set tertiary to default if we aren't using the tertiary color
	if( !script.useTertiaryColor )
	{
		tertiaryFacePaintColor = primaryFacePaintColor;
	}

	// Set the colors if active, else disable
	for( var i = 0; i < script.properties.api.facePaintTypes.length; i++ )
	{
		if( script.properties.api.facePaintTypes[i] )
		{
			if( script.facePaintType == i && script.showFacePaint )
			{
				script.properties.api.facePaintTypes[i].enabled = true;
				for( var j = 0; j < script.properties.api.facePaintTypes[i].getChildrenCount(); j++ )
				{
					var child = script.properties.api.facePaintTypes[i].getChild(j);
					var faceMaskVisual = child.getFirstComponent( "Component.FaceMaskVisual" );
		
					if( j == 0 )
					{
						faceMaskVisual.mainPass.baseColor = getColorWithAlpha( primaryFacePaintColor, script.facePaintAlpha );
					}
					else if ( j == 1 )
					{
						faceMaskVisual.mainPass.baseColor = getColorWithAlpha( secondaryFacePaintColor, script.facePaintAlpha );
					}
					else if ( j == 2 )
					{
						faceMaskVisual.mainPass.baseColor = getColorWithAlpha( tertiaryFacePaintColor, script.facePaintAlpha );
					}
				}
			}
			else
			{
				script.properties.api.facePaintTypes[i].enabled = false;
			}
		}
	}
}

function configureFaceLogos()
{
	for( var i = 0; i < script.properties.api.faceLogoTypes.length; i++ )
	{
		if( script.properties.api.faceLogoTypes[i] )
		{
			if( script.teamLogo && script.showFaceLogo && i == script.faceLogoType )
			{
				script.properties.api.faceLogoTypes[i].enabled = true;
		
				for( var j = 0; j < script.properties.api.faceLogoTypes[i].getChildrenCount(); j++ )
				{
					var child = script.properties.api.faceLogoTypes[i].getChild(j);
					var faceMaskVisual = child.getFirstComponent( "Component.FaceMaskVisual" );
					faceMaskVisual.mainPass.baseTex = script.teamLogo;
					faceMaskVisual.mainPass.baseColor = new vec4( 1.0, 1.0, 1.0, script.faceLogoAlpha );
				}
			}
			else
			{
				script.properties.api.faceLogoTypes[i].enabled = false;
			}
		}
	}
}

function configureScreenLogo()
{
	if(script.properties.api.screenLogo && script.teamLogo)
	{
		script.properties.api.screenLogo.enabled = script.showScreenLogo;
		script.properties.api.screenLogo.mainPass.baseTex = script.teamLogo;
		script.properties.api.screenLogo.mainPass.baseColor = new vec4( 1.0, 1.0, 1.0, script.logoAlpha );

		var screenTransform = script.properties.api.screenLogo.getSceneObject().getFirstComponent("Component.ScreenTransform");
		var bindingPointPositions = [ new vec2(0.60, 0.70), 
									  new vec2(-0.60, 0.70), 
									  new vec2(0, 0.70), 
									  new vec2(0.60, -0.70), 
									  new vec2(-0.60, -0.70), 
									  new vec2(0, -0.70) ];

		if(script.showScreenLogo)
		{
			var bindingPoint = bindingPointPositions[script.logoPosition];
			bindingPoint = new vec2( bindingPoint.x + script.logoOffsetX, bindingPoint.y + script.logoOffsetY );
			setRectCenter(screenTransform.anchors, bindingPoint);
			
			var size = new vec2( script.logoSize, script.logoSize ).uniformScale(2.0);
			setRectSize(screenTransform.anchors, size);
		}
	}
}

function configureScreenBanner()
{
	if(script.properties.api.screenBanner && script.teamBanner)
	{
		script.properties.api.screenBanner.enabled = script.showBanner;
		script.properties.api.screenBanner.mainPass.baseTex = script.teamBanner;
		script.properties.api.screenBanner.mainPass.baseColor = new vec4( 1.0, 1.0, 1.0, script.teamBannerAlpha);

		var screenTransform = script.properties.api.screenBanner.getSceneObject().getFirstComponent("Component.ScreenTransform");
		var bindingPoint = screenTransform.anchors.getCenter();
		bindingPoint.y += script.bannerOffsetY;
		setRectCenter(screenTransform.anchors, bindingPoint);
	}
}

function configureAudio()
{
	if( script.audio )
	{
		var audioComponent = script.getSceneObject().createComponent("Component.AudioComponent");
		if( script.audioTrack )
		{
			audioComponent.audioTrack = script.audioTrack;
			audioComponent.volume = script.volume;
	
			if( script.looping )
			{
				audioComponent.play( -1 );
			}
			else
			{
				audioComponent.play( 1 );
			}
		}		
	}
}

function getColorWithAlpha( color, alpha )
{
	return new vec4( color.x, color.y, color.z, alpha )
}

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}

function setRectCenter(rect, center) {
    var offset = center.sub(rect.getCenter());
    rect.left += offset.x;
    rect.right += offset.x;
    rect.top += offset.y;
    rect.bottom += offset.y;
}

function setRectSize(rect, size) {
    var center = rect.getCenter();
    rect.left = center.x - size.x * 0.5;
    rect.right = center.x + size.x * 0.5;
    rect.top = center.y + size.y * 0.5;
    rect.bottom = center.y - size.y * 0.5;
}