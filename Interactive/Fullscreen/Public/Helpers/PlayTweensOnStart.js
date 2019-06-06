// PlayAllTweenOnObject.js
// Version: 0.0.1
// Event: Initialized
// Description: Runs all tween on this object in a series.
// @input string[] tweenNames
// @input bool resetOnEnd = true
// @input SceneObject sceneObject

script.obj = script.sceneObject ? script.sceneObject : script.getSceneObject();

script.api.onStart = function () 
{
    (playNextTween(0))();
}

script.api.onEnd = function () 
{
    if (script.resetOnEnd)
    {
        for (var i = script.tweenNames.length - 1; i > -1; i--)
        {
            global.tweenManager.stopTween(script.obj, script.tweenNames[i]);
            global.tweenManager.resetObject(script.obj, script.tweenNames[i]);
        }
    }
}

function playNextTween (index) {
    var callback = index < script.tweenNames.length - 1 ? playNextTween(index + 1) : undefined;

    return function () {
        global.tweenManager.startTween(script.obj, script.tweenNames[index], callback);
    }
}