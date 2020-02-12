// RainController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls parameters on the rain effect material

// @input Asset.Material rainMaterial
// @input Asset.Material splashMaterial
//@ui {"widget":"group_start", "label":"RainController"}
    // @input float rainIntensity = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

var startColorMin = script.ColorMin;
var startColorMax = script.ColorMax;

function update(eventData)
{
   if(script.rainMaterial != null)
   {
        script.rainMaterial.mainPass.spawnMaxParticles = lerp(0.0, 1000.0, script.rainIntensity);
        script.rainMaterial.mainPass.lifeTimeMinMax = vec2.lerp(new vec2(0.5,1.5), new vec2(1.5,1.5), script.rainIntensity);
   }

   if(script.splashMaterial != null)
   {
        script.splashMaterial.mainPass.spawnMaxParticles = lerp(0.0, 1000.0, script.rainIntensity);
        script.splashMaterial.mainPass.lifeTimeMinMax = vec2.lerp(new vec2(0.5,1.5), new vec2(0.5,0.5), script.rainIntensity);
   }    
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}