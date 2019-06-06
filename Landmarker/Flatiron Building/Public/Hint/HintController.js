// -----JS CODE-----
//@ui {"widget":"group_start","label":"Hint Textures"}
    // @input Asset.Texture landmarkerGraphicsTexture
    // @input Asset.Texture goToHintTexture
    // @input Asset.Texture pointAtHintTexture
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start","label":"Hint Text"}
    // @input string goToTextHint
    // @input string pointAtTextHint
//@ui {"widget":"group_end"}


//@ui {"widget":"separator"}
// @input bool advanced = false
// @input Component.Text hintText {"showIf":"advanced"}
// @input Component.Script landmarkerController {"showIf":"advanced"}
// @input Component.Image landmarkerGraphics {"showIf":"advanced"}
// @input Component.Image hintAnimation {"showIf":"advanced"}
// @input Component.Image landmarkerLoadingPreview {"showIf":"advanced"}
// @input SceneObject loadingRing {"showIf":"advanced"}
// @input SceneObject hintUI {"showIf":"advanced"}

if (!script.landmarkerGraphicsTexture) {
	print("HintController: Please add reference to the `Preview Texture` field to the texture you want to show in the hint.");
}

//Options
var waringHintDisplayTime = 3.0;

//States 
var warningHintOff = false;
var loadingHintOff = false;
var showHint = true;

//Initialize
initialize();

function initialize(){
    showPleaseBeAwareHint();
    script.api.show = show;
    script.api.hide = hide;
    script.api.changeToGoToHint = changeToGoToHint;
    script.api.changeToPointAtHint = changeToPointAtHint;
    script.api.hideLoadingHint = hideLoadingHint;
    script.api.warningHintDisplayTime = waringHintDisplayTime;
    script.landmarkerGraphics.mainPass.baseTex = script.landmarkerGraphicsTexture;
    script.landmarkerLoadingPreview.mainPass.baseTex = script.landmarkerGraphicsTexture;
    script.hintText.enabled = false;
}

function showPleaseBeAwareHint(){    
    print("HintController: showing hint please be aware of your surroundings");
    script.hintComponent = script.getSceneObject().createComponent( "Component.HintsComponent" );
    script.hintComponent.showHint("lens_hint_warning_please_be_aware_of_your_surroundings", waringHintDisplayTime);
    var event = script.createEvent("DelayedCallbackEvent");
    event.bind(function(eventData){
        warningHintOff = true;
    });
    event.reset(waringHintDisplayTime);
}

function show(){
    showHint = true;
    if (warningHintOff && loadingHintOff){
        showActionHint();
    }
}

function hide(){
    showHint = false;
    global.tweenManager.startTween(script.hintUI, "transition_out");
}

function changeToGoToHint(){
    script.hintAnimation.mainPass.baseTex = script.goToHintTexture;
    script.hintText.text = script.goToTextHint;
}

function changeToPointAtHint(){
    script.hintAnimation.mainPass.baseTex = script.pointAtHintTexture;
    script.hintText.text = script.pointAtTextHint;
}

function hideLoadingHint(){
    loadingHintOff = true;
    global.tweenManager.startTween(script.hintUI, "loading_graphics_out", disableLoadingHint);
    global.tweenManager.startTween(script.hintUI, "loading_ring_out");
    if (showHint){
        showActionHint();
    }
}

function showActionHint(){
    script.hintText.enabled = true;
    global.tweenManager.startTween(script.hintUI, "hint_animation_in");
    global.tweenManager.startTween(script.hintUI, "hint_text_in");
    global.tweenManager.startTween(script.hintUI, "landmarker_graphics_in");
}

function disableLoadingHint(){
    script.landmarkerLoadingPreview.enabled = false;
    script.loadingRing.enabled = false;
}

script.createEvent("UpdateEvent").bind(function(eventData){
	if(global.scene.isRecording()) {
		script.hintUI.enabled = false;
		return;
    }
    if (warningHintOff && script.landmarkerController.api.locationDataDownloaded &&!loadingHintOff){
        hideLoadingHint();
    }
});