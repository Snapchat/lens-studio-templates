// SnowController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls parameters on the snow effect material

// @input Asset.Material snowMaterial
// @input Asset.Material groundSnowMaterial
//@ui {"widget":"group_start", "label":"SnowController"}
    // @input float snowIntensity = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

function update(eventData)
{
   if(script.snowMaterial != null)
   {
        script.snowMaterial.mainPass.spawnMaxParticles = lerp(0.0, 500.0, script.snowIntensity);
        script.snowMaterial.mainPass.lifeTimeMinMax = vec2.lerp(new vec2(1.0,5.0), new vec2(4.0,5.0), script.snowIntensity);
   }

   if(script.groundSnowMaterial != null)
   {
        script.groundSnowMaterial.mainPass.spawnMaxParticles = lerp(0.0, 500.0, script.snowIntensity);
   }    
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}