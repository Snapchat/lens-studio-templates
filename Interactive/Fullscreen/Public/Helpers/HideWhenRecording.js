// HideWhenRecording.js
// Version: 0.0.2
// Event: Frame Updated
// Description: Toggles visibility of Sprites and Visuals when recording. Useful for hints.

if (global.scene.isRecording()) 
{
    if (script.isVisible === undefined || script.isVisible === true)
    {
        setVisualsEnabled(false);
    }
}
else
{
    if (script.isVisible === undefined || script.isVisible === false)
    {
        setVisualsEnabled(true);
    }
}

function setVisualsEnabled (status) {
    var allComponents = script.getSceneObject().getAllComponents();

    for (var i = 0; i < allComponents.length; i++)
    {
        if (allComponents[i].mainPass) {
            allComponents[i].enabled = status;
        }
    }   

    script.isVisible = status;
}