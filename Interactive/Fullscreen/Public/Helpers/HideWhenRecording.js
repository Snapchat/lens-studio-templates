// HideWhenRecording.js
// Version: 0.0.1
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
    var componentNames = ["Component.MeshVisual", "Component.SpriteVisual"];

    for (var i = 0; i < componentNames.length; i++)
    {
        for (var j = 0; j < script.getSceneObject().getComponentCount(componentNames[i]); j++)
        {
            script.getSceneObject().getComponentByIndex(componentNames[i], j).enabled = status;
        }   
    }

    script.isVisible = status;
}