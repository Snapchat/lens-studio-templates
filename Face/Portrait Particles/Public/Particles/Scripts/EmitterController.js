// -----JS CODE-----
// EmitterController.js
// Version: 0.0.1
// Event: Initialized
// Description: The script that helps assigning the color and
// also add external time so you can see the particles on the start of the lens

// @input Asset.Material emitter
// @input vec3 emitterColorMin {"widget":"color"}
// @input vec3 emitterColorMax {"widget":"color"}
// @input float particleAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.1}
// @input float particleAmount = 500.0 {"widget":"slider", "min":0.0, "max":1000.0, "step":1.0}

var pass;

script.api.emitter = script.emitter;
script.api.emitterColorMin = script.emitterColorMin;
script.api.emitterColorMax = script.emitterColorMax;
script.api.particleAmount = script.particleAmount;
script.api.emitterAlpha = script.particleAlpha;

function onLensTurnOn(){
    pass = script.api.emitter.mainPass;
    pass.colorMinStart = script.api.emitterColorMin;
    pass.colorMaxStart = script.api.emitterColorMax;
    pass.spawnMaxParticles = script.api.particleAmount;
    pass.alphaStart = script.api.emitterAlpha;
}

function onUpdate(){
    if(pass){
        pass.externalTimeInput = getTime() + 25;
    }
}

var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind(onLensTurnOn); 

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);



