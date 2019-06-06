// FreezeOnstart.js
// Version: 0.0.1
// Event: Initialized
// Description: Disables attached camera so that last frame is kept in texture.

// @input Component.Camera FreezeCamera

script.api.onStart = function ()
{
    script.FreezeCamera.enabled = false;
}

script.api.onEnd = function ()
{
    script.FreezeCamera.enabled = true;
}