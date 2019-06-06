// BlizzardController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls parameters on the blizzard effect material

// @input Asset.Material snowMaterial
//@ui {"widget":"group_start", "label":"BlizzardController"}
    // @input float snowIntensity = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

function update(eventData)
{
   if(script.snowMaterial != null)
   {
        script.snowMaterial.mainPass.lifeTimeMinMax = vec2.lerp(new vec2(0.3,1.5), new vec2(1.5,1.75), script.snowIntensity);
   }   
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}