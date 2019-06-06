// @ui {"widget":"group_start", "label":"Textures"}
// @input Asset.Texture idleTexture
// @input Asset.Texture runTexture
// @input Asset.Texture jumpRiseTexture
// @input Asset.Texture jumpFallTexture
// @input Asset.Texture jumpFlutterTexture
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Sounds"}
// @input Asset.AudioTrackAsset jumpSound
// @input Asset.AudioTrackAsset pointSound
// @input Asset.AudioTrackAsset flapSound
// @input Asset.AudioTrackAsset deadSound
// @ui {"widget":"group_end"}

// @ui {"widget":"separator"}

// @input bool showAdvanced = false

// @ui {"widget":"group_start", "label":"Movement Variables", "showIf":"showAdvanced"}
// @input float groundY = 0
// @input float gravity = -250

// @input bool allowFlutter = true
// @input float flutterGravity = -100
// @input float flutterTerminalVelocity = -50

// @input int extraJumps = 0
// @input float jumpVelocity = 180
// @input float shortJumpVelocity = 70
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Object Refs", "showIf":"showAdvanced"}
// @input Component.ScriptComponent collider
// @input SceneObject visualRoot
// @input Component.MeshVisual meshVisual
// @input Component.MeshVisual runningEffectVisual
// @input Component.MeshVisual deathEffectVisual
// @input SceneObject ghostEffect
// @ui {"widget":"group_end"}


// Constants
const groundY = script.groundY;
const gravity = script.gravity;

const allowFlutter = script.allowFlutter;
const flutterGravity = script.flutterGravity;
const flutterTerminalVelocity = script.flutterTerminalVelocity;

const jumpsPerLand = 1 + script.extraJumps;
const jumpVelocity = script.jumpVelocity;
const shortJumpVelocity = script.shortJumpVelocity;

const runningEffectPass = (script.runningEffectVisual ? script.runningEffectVisual.mainPass : null);
const runningEffectFadeSpeed = 4.0;

const visualRootTransform = script.visualRoot.getTransform();

const collider = script.collider.api.collider;

// Inputs
var touchJustStarted = false;
var touchJustEnded = false;
var touchBeingHeld = false;

// Movement state
var vertVelocity = 0;
var isJumping = false;
var isFluttering = false;
var currentTexture = null;
var jumpsLeft = 0;

// Audio channels
var audioChannels = {};

// State Machine
var stateMachine = new global.StateMachine("CharacterState", script);

var idleState = stateMachine.addState({
    name: "Idle",
    onEnter: function() {
        script.deathEffectVisual.enabled = false;
        script.ghostEffect.enabled = false;
        script.runningEffectVisual.enabled = false;
        setTexture(script.idleTexture);
        
        // Make sure character is at ground level
        var visualPos = visualRootTransform.getLocalPosition();
        visualPos.y = groundY;
        visualRootTransform.setLocalPosition(visualPos);
    },
});
idleState.addSimpleSignalTransition("Game", "gameStarted");

var states = {};

states.game = stateMachine.addState({
    name: "Game",
    onEnter: function() {
        script.runningEffectVisual.enabled = true;
        setTexture(script.runTexture);
        touchJustStarted = false;
        touchJustEnded = false;
        jumpsLeft = jumpsPerLand;
        isJumping = false;
    },
    onUpdate: gameUpdate,
    onSignal: {
        "hitObstacle": function(collider) {
            global.gameController.sendSignal("gameOver");
            
            var otherPos = collider.getCenter();

            var deathEffectPos = script.deathEffectVisual.getTransform().getWorldPosition();
            deathEffectPos.x = otherPos.x;
            script.deathEffectVisual.getTransform().setWorldPosition(deathEffectPos);
            
            var ghostPos = script.ghostEffect.getTransform().getWorldPosition();
            ghostPos.x = otherPos.x;
            script.ghostEffect.getTransform().setWorldPosition(ghostPos);
        },
        "hitCollectible": function(collider) {
            var otherObject = collider.sceneObject;
            if (!global.isNull(otherObject)) {
                playSound(script.pointSound);
                global.gameController.sendSignal("addPoints", 1);
                otherObject.destroy();
            }
        },
    }
});


states.dead = stateMachine.addState({
    name: "Dead",
    onEnter: function() {
        script.deathEffectVisual.enabled = true;
        var deathEffectTex = script.deathEffectVisual.mainPass.baseTex;
        if (deathEffectTex && deathEffectTex.control.play) {
            deathEffectTex.control.play(1, 0);
        }
        script.ghostEffect.enabled = true;
        global.tweenManager.startTween(script.ghostEffect, "play_ghost");
        script.runningEffectVisual.enabled = false;
        setTexture(null);
        stopSound(script.flapSound);
        playSound(script.deadSound);
    }
});

stateMachine.enterState("Idle");

function sendStateSignal(signal, data) {
    stateMachine.sendSignal(signal, data);
}

function onGameStateChanged(newStateName, oldStateName) {
    if (newStateName == "Intro") {
        stateMachine.enterState("Idle");
    }
    if (newStateName == "Game") {
        sendStateSignal("gameStarted");
    }
    if (newStateName == "GameOver") {
        stateMachine.enterState("Dead");
    }
}
global.gameController.addStateChangedCallback(onGameStateChanged);


function onObstacleCollision(otherCollider) {
    sendStateSignal("hitObstacle", otherCollider);
}
collider.addOnEnterCallback("obstacle", onObstacleCollision);

function onCollectibleCollision(otherCollider) {
    sendStateSignal("hitCollectible", otherCollider);
}
collider.addOnEnterCallback("collectible", onCollectibleCollision);

function onTouchStart(eventData) {
    touchJustStarted = true;
    touchBeingHeld = true;
}
script.createEvent("TouchStartEvent").bind(onTouchStart);

function onTouchEnd(eventData) {
    touchJustEnded = true;
    touchBeingHeld = false;
}
script.createEvent("TouchEndEvent").bind(onTouchEnd);

function gameUpdate(eventData) {
    var deltaTime = global.getDeltaTime();

    var wasFluttering = isFluttering;
    isFluttering = false;

    if (isJumping) {
        var pos = visualRootTransform.getLocalPosition();

        // Is falling
        if (vertVelocity <= 0) {
            if (touchBeingHeld && allowFlutter) {
                vertVelocity += flutterGravity * deltaTime;
                vertVelocity = Math.max(vertVelocity, flutterTerminalVelocity);
                isFluttering = true;
            } else {
                vertVelocity += gravity * deltaTime;
                isFluttering = false;
            }
            setTexture(isFluttering
                ? script.jumpFlutterTexture
                : script.jumpFallTexture);
        } else {
            vertVelocity += gravity * deltaTime;
        }

        // Cut off velocity if touch ended
        if (touchJustEnded && vertVelocity > shortJumpVelocity) {
            vertVelocity = shortJumpVelocity;
        }

        pos.y += vertVelocity * deltaTime;

        if (pos.y <= groundY) {
            pos.y = groundY;
            vertVelocity = 0;
            isJumping = false;
            isFluttering = false;
            jumpsLeft = jumpsPerLand;
            setTexture(script.runTexture);
        }

        visualRootTransform.setLocalPosition(pos);
    }

    if (touchJustStarted && jumpsLeft > 0) {
        vertVelocity = jumpVelocity;
        isJumping = true;
        jumpsLeft--;
        setTexture(script.jumpRiseTexture, true, true);
        playSound(script.jumpSound);
    }

    if (!wasFluttering && isFluttering) {
        playSound(script.flapSound, true);
    } else if (wasFluttering && !isFluttering) {
        stopSound(script.flapSound);
    }

    touchJustStarted = false;
    touchJustEnded = false;

    // Update run effect
    if (script.runningEffectVisual) {
        var showRunningEffect = !isJumping;
        var targetRunAlpha = showRunningEffect ? 1.0 : 0.0;
        var currentCol = runningEffectPass.baseColor;
        if (!approximately(currentCol.a, targetRunAlpha)) {
            currentCol.a = moveTowards(currentCol.a, targetRunAlpha, deltaTime * runningEffectFadeSpeed);
            runningEffectPass.baseColor = currentCol;
            script.runningEffectVisual.getSceneObject().enabled = currentCol.a > 0;
        }
    }
}

function setTexture(texture, dontLoop, forcePlay) {
    if (currentTexture != texture || forcePlay) {
        currentTexture = texture;
        script.meshVisual.mainPass.baseTex = texture;

        script.meshVisual.enabled = (texture != null);

        if (texture != null) {
            var aspectRatio = texture.control.getAspect();
            var meshScale = script.meshVisual.getTransform().getLocalScale();
            meshScale.x = sign(meshScale.x) * meshScale.y * aspectRatio;
            script.meshVisual.getTransform().setLocalScale(meshScale);
            
            if (texture.control.play && 
                (forcePlay || !texture.control.isPlaying())) {
                texture.control.play(dontLoop ? 1 : -1, 0);
            }
        }
    }
}

var nextAudioId = 0;
function getChannel(sound) {
    if (sound._id === undefined) {
        sound._id = nextAudioId;
        nextAudioId++;
        var channel = script.getSceneObject().createComponent("Component.AudioComponent");
        channel.audioTrack = sound;
        audioChannels[sound._id] = channel;
        return channel;
    }
    return audioChannels[sound._id];
}

function playSound(sound, loop) {
    if (!sound) {
        return;
    }
    var channel = getChannel(sound);
    channel.volume = 1.0;
    channel.play(loop ? -1 : 1);
}

function stopSound(sound) {
    if (!sound) {
        return;
    }
    var channel = getChannel(sound);
    if (channel.isPlaying()) {
        channel.stop(false);
    }
    channel.volume = 0;
}


function sign(x) {
    return ((x > 0) - (x < 0)) || +x;
}

function approximately(a, b) {
    return Math.abs(a-b) <= Number.EPSILON;
}

function moveTowards(current, target, max) {
    if (Math.abs(target - current) <= max) {
        return target;
    } 
    return current + sign(target - current) * max;
}