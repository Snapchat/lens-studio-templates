// MeshFadeController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Fade in and out the 3D meshes using fizzle.

// @input bool fadeEffect = false
// @input string fadeType = "startFadeIn" {"widget":"combobox", "values":[{"label":"Fade In", "value":"startFadeIn"}, {"label":"Fade Out", "value":"startFadeOut"}], "showIf": "fadeEffect"} 
// @input float fadingDuration = 1.0 {"widget":"slider", "min":0.1, "max":5.0, "step":0.01 , "showIf": "fadeEffect"} 
// @input Asset.Material[] fadeMaterials {"showIf": "fadeEffect"}

var isFading = false;
var timeStartedFading = 0;

var startingValue = 1;
var endingValue = 0;

function onUpdateEvent(eventData)
{
    if(isFading && script.fadeMaterials)
    { 
        var timeSinceStarted = getTime() - timeStartedFading;
        var percentageComplete = timeSinceStarted / script.fadingDuration;
        var transition = lerp(startingValue,endingValue,percentageComplete);
        for(var i = 0; i < script.fadeMaterials.length; i++)
        {
            if (script.fadeMaterials[i]) {
                script.fadeMaterials[i].mainPass.transition =  transition;
            }
        }
        if(percentageComplete >= 1.0)
        {
            isFading = false;
        }
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent); 


script.api.resetFadeEffect = function()
{
    if(script.fadeMaterials)
    {
        for(var i = 0; i < script.fadeMaterials.length; i++)
        {
            if (script.fadeMaterials[i]) {
                script.fadeMaterials[i].mainPass.transition = 1;
            }
        }
    }
}

script.api.startFade = function()
{
    switch(script.fadeType)
    {
        case "startFadeIn":
        script.api.startFadeIn();
        break;

        case "startFadeOut":
        script.api.startFadeOut();
        break;

    }
}

script.api.startFadeOut = function()
{
    if(script.fadeMaterials)
    {
        for(var i = 0; i < script.fadeMaterials.length; i++)
        {
            if (script.fadeMaterials[i]) {
                script.fadeMaterials[i].mainPass.transition = 0;
            }
        }

        startingValue = 0;
        endingValue = 1;
        timeStartedFading = getTime();
        isFading = true;
    } 
}

script.api.startFadeIn = function()
{
    if(script.fadeMaterials)
    {
        for(var i = 0; i < script.fadeMaterials.length; i++)
        {
            if (script.fadeMaterials[i]) {
                script.fadeMaterials[i].mainPass.transition = 1;
            }
        }
        
        startingValue = 1;
        endingValue = 0;
        timeStartedFading = getTime();
        isFading = true;
    }   
}


function lerp(a, b, t)
{
    return a + t * (b - a);
}