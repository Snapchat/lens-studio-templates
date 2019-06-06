// FullscreenTemplateManager.js
// Event: Lens Turned On
// Version: 0.01
// Description: Manages iterating through children states.

var states;
var currentStateIndex = 0;

// HELPERS

function setupStates () 
{
    states = collectStates(script.getSceneObject());

    for (var i = 0; i < states.length; i++) 
    {
        states[i].api.subscribeToStateEnd(onStateFinished);
        states[i].api.hideAttachedObjects();
        states[i].api.getSceneObject().enabled = false;
    }

    if (states.length > 0)
    {
        setStateEnabled(currentStateIndex, true);
        script.createEvent("UpdateEvent").bind(update);
        script.createEvent("LateUpdateEvent").bind(lateUpdate);
    }

    script.hasInitialized = true;
}

function update ()
{
    states[currentStateIndex].api.update();
}

function lateUpdate()
{
    states[currentStateIndex].api.lateUpdate();
}

function onStateFinished ()
{
    goToNextState();
}

function goToNextState () 
{
    setStateEnabled(currentStateIndex, false);
    incrementCurrentStateIndex();
    setStateEnabled(currentStateIndex, true);
}

function setStateEnabled (stateIndex, status) 
{
    var verb = status ? "Enable" : "Disable";
    var stateSceneObject = states[stateIndex].getSceneObject();

    print("Fullscreen Template Manager: " + verb + " State #" + stateIndex + ": \"" + stateSceneObject.name + "\"");
    stateSceneObject.enabled = status;

    if (status)
    {
        states[stateIndex].api.stateStart();
    }
}

function incrementCurrentStateIndex () 
{
    currentStateIndex = (currentStateIndex + 1) % states.length;
}

function collectStates ( sceneObject ) 
{
    var foundStates = [];

    for (var i = 0; i < sceneObject.getChildrenCount(); i++)
    {
        var child = sceneObject.getChild(i);
        var state = returnFirstStateInObject(child);
        if (state) foundStates.push(state);
    }

    return foundStates;
}

function returnFirstStateInObject ( sceneObject )
{
    if (!sceneObject.enabled) return;

    for( var i = 0; i < sceneObject.getComponentCount( "Component.ScriptComponent"); i++ )
    {
        var scriptComponent = sceneObject.getComponentByIndex( "Component.ScriptComponent", i );

        if( scriptComponent.api.subscribeToStateEnd ) 
        {
            return scriptComponent;
        }

    }
}

// INITIALIZE

if (!script.hasInitialized)
{
    setupStates();
}
