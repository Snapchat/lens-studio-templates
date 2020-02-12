// BokehController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls parameters on the bokeh effect material

// @input Asset.Material bokehMaterial
//@ui {"widget":"group_start", "label":"BokehController"}
    // @input float bokehIntensity = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

function update(eventData)
{
   if(script.bokehMaterial != null)
   {
        script.bokehMaterial.mainPass.lifeTimeMinMax = vec2.lerp(new vec2(2.0,10.0), new vec2(8.0,10.0), script.bokehIntensity);
        script.bokehMaterial.mainPass.spawnMaxParticles = lerp(0.0, 1000.0, script.bokehIntensity);
   }   
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}