// SparkleController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Controls parameters on the sparkle effect material

// @input Asset.Material sparkleMaterial
//@ui {"widget":"group_start", "label":"SparkleController"}
    // @input float sparkleIntensity = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
//@ui {"widget":"group_end"}

function update(eventData)
{
   if(script.sparkleMaterial != null)
   {
        script.sparkleMaterial.mainPass.spawnMaxParticles = lerp(0.0, 1000.0, script.sparkleIntensity);
   }   
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function lerp(a, b, t)
{
    return a * (1.0 - t) + b * t;
}