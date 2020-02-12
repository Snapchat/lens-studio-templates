// TweenChain.js
// Version: 0.0.5
// Event: Any Event
// Description: Chains multiple tween scripts attached to single object together
// ----- USAGE -----
// Attach all of the Tween Types to be chained together on a single scene object.
//
// Ensure that all of the Tween Types on this scene object are assigned unique Tween Names.
//
// Assign this scene object to the "Scene Object" variable of this Tween Chain in the Inspector.
//
// Under the "Tween Names" section, input the names of the Tweens that you would like to run
//
// Tweens will be run in the order that they are named under "Tween Names"
// -----------------

//@input string tweenName
//@input bool playAutomatically = true
//@input int loopType = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Loop", "value":1}, {"label":"Ping Pong", "value":2}, {"label":"Ping Pong Once", "value":3}]}
//@ui {"widget":"separator"}
//@input SceneObject sceneObject
//@input bool playAll = false {"label": "All At Once"}
//@input bool recursive
//@input string[] tweenNames

if (!script.sceneObject){
	script.sceneObject = script.getSceneObject();
}

// Setup the external API.
script.api.tweenObject = script.getSceneObject();
script.api.tweenType = "chain";
script.api.tweenName = script.tweenName;
script.api.startTween = startTween;
script.api.resetObject = resetObject;
script.api.tween = null;
script.api.currentTweenName = null;
script.api.firstTween = null;
script.api.lastTween = null;
script.api.allTweens = null;
script.api.longestTween = null;
script.api.backwards = false;
script.api.setupTween = setupTween;
script.api.chainTweensInOrder = chainTweensInOrder;
script.api.chainTweensBackwards = chainTweensBackwards;
script.api.sceneObject = script.sceneObject;
script.api.updateToStart = updateToStart;
script.api.updateToEnd = updateToEnd;
script.api.chainTweensPingPongOnce = chainTweensPingPongOnce;
script.api.loopType = script.loopType;
script.api.playAll = script.playAll;
script.api.playAutomatically = script.playAutomatically;

if ( global.tweenManager && global.tweenManager.addToRegistry )
{
    global.tweenManager.addToRegistry(script);
}

// Update the tween to its start
function updateToStart()
{
		// Reset components to their start states
		for ( var i = script.tweenNames.length - 1; i >= 0; i-- )
		{
				var scriptComponent = ( script.recursive ) ? global.tweenManager.findTweenRecursive( script.api.sceneObject, script.tweenNames[i]) : global.tweenManager.findTween( script.api.sceneObject, script.tweenNames[i] );

				if ( scriptComponent )
				{
						if ( scriptComponent.api.updateToStart )
						{
								scriptComponent.api.updateToStart();
						}
				}
		}
}

// Update the tween to its end
function updateToEnd()
{
    for ( var i = 0; i < script.tweenNames.length; i++ )
		{
				var scriptComponent = ( script.recursive ) ? global.tweenManager.findTweenRecursive( script.api.sceneObject, script.tweenNames[i]) : global.tweenManager.findTween( script.api.sceneObject, script.tweenNames[i] );

				if ( scriptComponent )
				{
						if ( scriptComponent.api.updateToEnd )
						{
								scriptComponent.api.updateToEnd();
						}
				}
				else
				{
						return;
				}
		}
}

// Play it automatically if specified
if( script.playAutomatically )
{
    // Start the tween
    startTween();
}

// Dynamically create chain of callback functions for each tween
function startTween()
{
		if ( !global.tweenManager )
		{
				print( "Tween Chain: Tween Manager not initialized. Try moving the TweenManager script to the top of the Objects Panel or changing the event on this TweenType to \"Lens Turned On\"." );
				return;
		}

		setupTween();

		// Setup callback functions based on loop type
		if ( script.api.lastTween )
		{
				switch ( script.loopType )
				{
						case 1:
								setupLoop();
								break;
						case 2:
								setupPingPong(script.playAll, script);
								break;
						case 3:
								setupPingPongOnce(script.playAll, script);
								break;
				}
		}

		// Start the first tween if it exists
		if ( script.api.firstTween )
		{
				if ( script.playAll )
				{
						for ( var i = 0; i < script.api.allTweens.length; i++ )
						{
								script.api.allTweens[i].start();
						}
				}
				else
				{
						if ( Array.isArray(script.api.firstTween) )
						{
								for ( var i = 0; i < script.api.firstTween.length; i++)
								{
										script.api.firstTween[i].start();
								}
						}
						else
						{
								script.api.firstTween.start();
						}
				}
		}

}

// Chain the tweens in order that they are defined in tweenNames.
function setupTween()
{
		var result = chainTweensInOrder(script.playAll, script);

		if ( !result )
		{
				return;
		}

		updateToStart();

		script.api.firstTween = result.firstTween;
		script.api.lastTween = result.lastTween;
		script.api.allTweens = result.allTweens;
		script.api.longestTween = result.longestTween;
}

// Chain tweens in order that they are specified in the inspector
function chainTweensInOrder(playAll, originalScript)
{
		return chainTweens("forwards", playAll, originalScript);
}

// Chain tweens in backwards order that they are defined in the Inspector
function chainTweensBackwards(playAll, originalScript)
{
		return chainTweens("backwards", playAll, originalScript);
}

// Main body for chaining tweens either forwards or backwards
function chainTweens(order, playAll, originalScript)
{
		var tween = null;
		var allTweens = [];
		var firstTween = null;
		var lastTween = null;
		var resultTween = null;
		var longestTween = null;
		var firstTweenFound = false;
		var orderCondition = (order == "forwards");
		var tweenNames = script.tweenNames.slice();
		if ( !orderCondition )
		{
				tweenNames.reverse();
		}
		// Tweens are created in order specified by the parameter
		for ( var i = 0; i < tweenNames.length; i++)
		{
				var scriptComponent = ( script.recursive ) ? global.tweenManager.findTweenRecursive( script.api.sceneObject, tweenNames[i]) : global.tweenManager.findTween( script.api.sceneObject, tweenNames[i] );

				var result = null;

				var newTween = null;

				var newTweenName = null;

				if ( scriptComponent ) // Found Tween
				{
						if ( (scriptComponent.api.sceneObject == script.api.sceneObject) && (scriptComponent.api.tweenName == script.tweenName ) )
						{
								print ( "Tween Chain: You are trying to invoke an instance of a TweenChain within itself. This is not allowed. Ensure that the Tween names declared under " + script.tweenName + " are correct." );
								return;
						}
						else
						{
								if ( scriptComponent.api.tweenType == "chain")
								{
										if ( scriptComponent.api.loopType == 3 && !playAll )
										{
												result = scriptComponent.api.chainTweensPingPongOnce(originalScript);
										}
										else if ( orderCondition )
										{
												result = scriptComponent.api.chainTweensInOrder(playAll, originalScript);
										}
										else
										{
												result = scriptComponent.api.chainTweensBackwards(playAll, originalScript);
										}

										allTweens = allTweens.concat(result.allTweens);

										longestTween = (longestTween) ? ((result.longestTween._duration >= longestTween._duration) ? result.longestTween : longestTween) : result.longestTween;

										if ( tween )
										{
												if ( !playAll)
												{
														// Chain the start of this TweenChain to the most recently created Tween
														tween._chainedTweens = tween._chainedTweens.concat( result.firstTween );
												}
										}

										// Update first, last, and current tweens on this TweenChain
										if ( Array.isArray(result.lastTween))
										{
												tween = result.lastTween[result.lastTween.length - 1];
										}
										else
										{
												tween = result.lastTween;
										}

										if (!firstTweenFound)
										{
												firstTween = result.firstTween;
												firstTweenFound = true;
										}
										lastTween = result.lastTween;
								}
								else
								{
										newTween = orderCondition ? scriptComponent.api.setupTween() : scriptComponent.api.setupTweenBackwards();

										newTweenName = scriptComponent.api.tweenName;

										if ( newTween )
										{

												allTweens = allTweens.concat(newTween);

												if ( tween )
												{
														if (!playAll)
														{
																// Chain this Tween to the most recently created Tween
																tween._chainedTweens = tween._chainedTweens.concat(newTween);
														}
												}

												if ( order == "forwards" && !playAll)
												{
														scriptComponent.api.updateToEnd();
												}

												// Update first, last, and current tweens on this TweenChain
												if (Array.isArray(newTween))
												{
														tween = newTween[newTween.length - 1];
														newTween[0].onStart(updateCurrentTween(newTween, originalScript));

												}
												else
												{
														tween = newTween;
														newTween.onStart(updateCurrentTween(newTween, originalScript));
												}

												longestTween = (longestTween) ? ((tween._duration >= longestTween._duration) ? tween : longestTween) : tween;

												if ( !firstTweenFound )
												{
														firstTween = newTween;
														firstTweenFound = true;
												}

												lastTween = newTween;

										}
								}
						}
				}
				else
				{
						print ( "Tween Chain: " + tweenNames[i] + ", specified under " + script.tweenName + ", is not found. Ensure that the Scene Object contains a TweenType or TweenChain script called " + tweenNames[i]);
						return;
				}
		}

		resultTween = {
				"firstTween": firstTween,
				"lastTween": lastTween,
				"allTweens": allTweens,
				"longestTween": longestTween
		};

		return resultTween;
}

// Update the current tween when it plays
function updateCurrentTween(nextTween, originalScript)
{
		return function(){
				originalScript.api.tween = nextTween;
		};
}

// Chain tweens once forwards and once backwards
function chainTweensPingPongOnce(originalScript)
{
		// Clear recorded Tweens
		var tween = null;

		var firstTween = null;

		var lastTween = null;

		var resultTween = null;

		// Get forwards and backwards chained tweens
		var forwardsResult = chainTweensInOrder(false, originalScript);
		updateToStart();
		var backwardsResult = chainTweensBackwards(false, originalScript);

		// Chain forwards and backwards tweens together
		if ( Array.isArray (forwardsResult.lastTween ))
		{
				forwardsResult.lastTween[forwardsResult.lastTween.length - 1]._chainedTweens = forwardsResult.lastTween[forwardsResult.lastTween.length - 1]._chainedTweens.concat( backwardsResult.firstTween );
		}
		else
		{
				forwardsResult.lastTween._chainedTweens = forwardsResult.lastTween._chainedTweens.concat( backwardsResult.firstTween );
		}

		firstTween = forwardsResult.firstTween;
		lastTween = backwardsResult.lastTween;

		// Return chained forwards and backwards tweens
		resultTween = {
				"firstTween": firstTween,
				"lastTween": lastTween,
				"longestTween": backwardsResult.longestTween
		};

		return resultTween;
}

// Reset all Tweens to the start of the TweenChain
function resetObject()
{
		for ( var i = script.tweenNames.length - 1; i >= 0 ; i-- )
		{
				var scriptComponent = ( script.recursive ) ? global.tweenManager.findTweenRecursive( script.api.sceneObject, script.tweenNames[i]) : global.tweenManager.findTween( script.api.sceneObject, script.tweenNames[i] );

				if ( scriptComponent )
				{
						if ( scriptComponent.api.resetObject )
						{
								scriptComponent.api.resetObject();
						}
				}
		}
}

// Sets up callback functions for looping
function setupLoop()
{
		var repeatLoop = function(){

				resetObject();

				setupTween();

				if ( script.playAll )
				{
						script.api.longestTween._onCompleteCallback = repeatLoop;
						for ( var i = 0; i < script.api.allTweens.length; i++)
						{
								script.api.allTweens[i].start();
						}
				}
				else
				{
						if (Array.isArray(script.api.lastTween) )
						{
								script.api.lastTween[script.api.lastTween.length - 1]._onCompleteCallback = repeatLoop;
						}
						else
						{
								script.api.lastTween._onCompleteCallback = repeatLoop;
						}

						if (Array.isArray(script.api.firstTween))
						{
								for ( var i = 0; i < script.api.firstTween.length; i++)
								{
										script.api.firstTween[i].start();
								}
						}
						else
						{
								script.api.firstTween.start();
						}
				}

		}

		if ( script.playAll )
		{
				script.api.longestTween._onCompleteCallback = repeatLoop;
		}
		else
		{
				if ( Array.isArray(script.api.lastTween) )
				{
						script.api.lastTween[script.api.lastTween.length - 1]._onCompleteCallback = repeatLoop;

				}
				else
				{
						script.api.lastTween._onCompleteCallback = repeatLoop;
				}
		}


}

// Sets up callback functions for ping pong
function setupPingPong(playAll, originalScript)
{
		var repeatPingPong = function(){
				script.api.backwards = !script.api.backwards;
				if ( script.api.backwards )
				{
						var result = chainTweensBackwards(playAll, originalScript);
						script.api.firstTween = result.firstTween;
						script.api.lastTween = result.lastTween;
						script.api.allTweens = result.allTweens;
						script.api.longestTween = result.longestTween;
				}
				else
				{
						setupTween();
				}

				if ( playAll )
				{
						script.api.longestTween._onCompleteCallback = repeatPingPong;
						for ( var i = 0; i < script.api.allTweens.length; i++)
						{
								script.api.allTweens[i].start();
						}
				}
				else
				{
						if ( Array.isArray(script.api.lastTween) )
						{
								script.api.lastTween[script.api.lastTween.length - 1]._onCompleteCallback = repeatPingPong;
						}
						else
						{
								script.api.lastTween._onCompleteCallback = repeatPingPong;
						}

						if (Array.isArray(script.api.firstTween))
						{
								for ( var i = 0; i < script.api.firstTween.length; i++)
								{
										script.api.firstTween[i].start();
								}
						}
						else
						{
								script.api.firstTween.start();
						}
				}
		}

		if ( script.playAll )
		{
				script.api.longestTween._onCompleteCallback = repeatPingPong;
		}
		else
		{
				if ( Array.isArray(script.api.lastTween) )
				{
						script.api.lastTween[script.api.lastTween.length - 1]._onCompleteCallback = repeatPingPong;
				}
				else
				{
						script.api.lastTween._onCompleteCallback = repeatPingPong;
				}
		}

}

// Sets up callback functions for ping pong once
function setupPingPongOnce(playAll, originalScript)
{
		var repeatPingPongOnce = function(){
				script.api.backwards = !script.api.backwards;
				if ( script.api.backwards )
				{
						var result = chainTweensBackwards(playAll, originalScript);
						script.api.firstTween = result.firstTween;
						script.api.lastTween = result.lastTween;
						script.api.allTweens = result.allTweens;
						script.api.longestTween = result.longestTween;
				}

				if ( playAll )
				{
						for ( var i = 0; i < script.api.allTweens.length; i++)
						{
								script.api.allTweens[i].start();
						}
				}
				else
				{
						if (Array.isArray(script.api.firstTween))
						{
								for ( var i = 0; i < script.api.firstTween.length; i++)
								{
										script.api.firstTween[i].start();
								}
						}
						else
						{
								script.api.firstTween.start();
						}
				}
		}

		if ( script.playAll )
		{
				script.api.longestTween._onCompleteCallback = repeatPingPongOnce;
		}
		else
		{
				if ( Array.isArray(script.api.lastTween) )
				{
						script.api.lastTween[script.api.lastTween.length - 1]._onCompleteCallback = repeatPingPongOnce;

				}
				else
				{
						script.api.lastTween._onCompleteCallback = repeatPingPongOnce;
				}
		}

}
