// ExternalTimeController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Allows a particle to be controlled by device time for start and stop simulation



function update()
{
	global.animTime = global.controlTime - getTime();
	var positiveTime = -animTime * 0.5;
	
	if(positiveTime > 0.01)
	{
		if(script.getSceneObject().getComponentCount("Component.MeshVisual") > 0)
		{
			var meshVis = script.getSceneObject().getFirstComponent("Component.MeshVisual");
			if(meshVis.getMaterialsCount() > 0)
			{
				meshVis.getMaterial(0).mainPass.externalTimeInput = positiveTime-0.01;
			}
		}
	}

	resetTime();
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function resetTime(time)
{
	if(global.animTime * 0.5 <= -15.0)
	{
		global.controlTime =  getTime();
	}
}


