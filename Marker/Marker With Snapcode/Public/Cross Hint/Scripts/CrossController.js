// CrossController.js
// Version: 0.0.3
// Event: Lens Initialized
// Description: Play a concentric animation of a cross to show a marker has been found.

// @input Component.MarkerTrackingComponent markerComponent

//@ui {"widget":"separator"}
// @input bool advanced = false
// @input Asset.Material baseMaterial {"showIf":"advanced"}
// @input Asset.Textures[] textures {"showIf":"advanced"}

var initialized;
var started;
var frame;
var callback;
var crossController;
var textures;

function checkInputValues() {
	if (!script.markerComponent) {
		print("ERROR: CrossController: MarkerComponent is not set");
		return false;
	}
	if (!script.baseMaterial) {
		print("ERROR: CrossController: BaseMaterial is not set");
		return false;
	}
	var numTex = 0;
	for (var i = 0; i < script.textures.length; i++) {
		if (script.textures[i]) {
			numTex++;
		}
	}
	if (numTex == 0) {
		print("WARNING: CrossController: Textures are not set under the advanced tab");
		return false;
	}
	return true;
}

function initializeMesh() {

	var w = script.markerComponent.marker.height * script.markerComponent.marker.getAspectRatio() * 1.01;
	var h = script.markerComponent.marker.height * 1.01;

	textures = [];
	for (var i = 0; i < script.textures.length; i++) {
		if (script.textures[i]) {
			textures.push(script.textures[i]);
		}
	}

	var count = textures.length;

	var localPos = script.getSceneObject().getTransform().getLocalPosition();// local position of Cross Controller sceneObject 

	var offset = new vec3(localPos.x, localPos.y, 0.0);// Cross Controller mesh pivot offset, to make it aligned to the marker

	if (count > 1) {
		offset = offset.add(new vec3(w / 2, h / 2, 0.0));//offset of a Cross Controller mesh pivot point in case there is more than one cross
	}
	var startFrom = new vec2(getRelativePos(offset.x, 0, w), getRelativePos(offset.y, 0, h)); //relative coordinate of a point, where animation starts from. 

	var options = {
		count: count,
		start: startFrom,
		offset: offset,
		meshHalfSize: w / 50,
		dx: w / (count - 1),
		dy: h / (count - 1),
		animationFinishedCallback: onCrossAnimationFinished,
	}

	crossController = new CrossGenerator(options);
}

function onUpdate() {
	if (started && crossController) {
		crossController.update(frame);
		frame++;
	}
}

function startCrossAnimation(cb) {
	started = true;
	frame = 0;
	callback = cb;
}

function onCrossAnimationFinished() {
	started = false;
	frame = 0;

	if (callback) {
		callback();
		script.removeEvent(updateEvent);
	}
}

function CrossGenerator(options) {

	// const
	var animateSpeed = 1;
	var endFrame = 20;
	var colors = [
		[100.0, 80.0, 4.0],
		[94.0, 62.0, 64.0],
		[50.0, 6.0, 49.0],
		[98.0, 17.0, 57.0],
		[86.0, 21.0, 17.0],
		[9.0, 72.0, 85.0],
		[13.0, 71.0, 51.0],
		[57.0, 79.0, 32.0],
	];

	// options
	var count = options.count;
	var start = options.start;
	var offset = options.offset;

	var meshHalfSize = options.meshHalfSize;
	var dx = options.dx;
	var dy = options.dy;
	var animationFinishedCallback = options.animationFinishedCallback;

	// state
	var builders = [];
	var animationFinished = 0;

	function constructor() {
		generateMesh(start, offset);
		for (var i = 0; i < builders.length; i++) {
			var builder = builders[i];
			var textureIndex = i % textures.length;
			var texture = textures[textureIndex];
			texture.control.pauseAtFrame(0);
			texture.control.setOnFinish(generatePlayReverseOnDone(texture.control));
			buildMesh(builder, texture);
		}

		hasInitialized = true;
	}

	function generatePlayReverseOnDone(control) {
		return function () {
			control.isReversed = true;
			control.setOnFinish(function () {
				animationFinished++;
			});
			control.play(1, 0);
		}
	}

	function generateMesh(start, posOffset) {

		var startPos = new vec2(Math.round(start.x * (count - 1) * 2) / 2, Math.round(start.y * (count - 1) * 2) / 2);

		for (var i = 0; i < count; i++) {
			for (var j = 0; j < count; j++) {
				var currentRadius = Math.floor(Math.max(Math.abs(i - startPos.x), Math.abs(j - startPos.y)));
				if (currentRadius >= 0 && currentRadius < count) {
					var centerPos = new vec3(dx * i, dy * j, 0).sub(posOffset);
					if (!builders[currentRadius]) {
						builders[currentRadius] = createBuilder();
					}
					addQuad(builders[currentRadius], centerPos);
				}
			}
		}
	}

	function createBuilder() {
		var builder = new MeshBuilder([
			{ name: "position", components: 3 },
			{ name: "texture0", components: 2 },
			{ name: "color", components: 4 },
		]);

		builder.topology = MeshTopology.Triangles;
		builder.indexType = MeshIndexType.UInt16;

		return builder;
	}

	function addQuad(builder, pos) {
		var size = meshHalfSize;
		var startIndex = builder.getVerticesCount();

		var colorIndex = Math.floor(Math.random() * colors.length);
		var color = colors[colorIndex];
		var colorVal = new vec4(color[0] / 100, color[1] / 100, color[2] / 100, 1);

		var v1 = pos.add(vec3.up().uniformScale(size)).add(vec3.right().uniformScale(-size));
		var v2 = pos.add(vec3.up().uniformScale(-size)).add(vec3.right().uniformScale(-size));
		var v3 = pos.add(vec3.up().uniformScale(-size)).add(vec3.right().uniformScale(size));
		var v4 = pos.add(vec3.up().uniformScale(size)).add(vec3.right().uniformScale(size));

		builder.appendVerticesInterleaved([
			// Position                 UV     Color                                          Index
			v1.x, v1.y, pos.z, 0, 1, colorVal.r, colorVal.g, colorVal.b, colorVal.a,   // 0
			v2.x, v2.y, pos.z, 0, 0, colorVal.r, colorVal.g, colorVal.b, colorVal.a,   // 1   
			v3.x, v3.y, pos.z, 1, 0, colorVal.r, colorVal.g, colorVal.b, colorVal.a,   // 2
			v4.x, v4.y, pos.z, 1, 1, colorVal.r, colorVal.g, colorVal.b, colorVal.a,   // 3         
		]);

		builder.appendIndices([
			0 + startIndex, 1 + startIndex, 2 + startIndex, // First Triangle
			2 + startIndex, 3 + startIndex, 0 + startIndex, // Second Triangle
		]);
	}

	function buildMesh(builder, texture) {
		if (builder.isValid()) {
			var meshVisual = script.getSceneObject().createComponent("Component.MeshVisual");
			meshVisual.setRenderOrder(100);
			meshVisual.addMaterial(script.baseMaterial.clone());
			meshVisual.mainPass.baseTex = texture;
			meshVisual.mesh = builder.getMesh();

			builder.updateMesh();
		}
		else {
			print("Mesh data invalid!");
		}
	}

	this.update = function (frame) {

		var currentRadius = Math.floor(frame / animateSpeed);
		if (currentRadius < builders.length) {
			textures[currentRadius].control.play(1, 0);
		} else if (animationFinished >= builders.length) {
			if (animationFinishedCallback) {
				animationFinishedCallback();
			}
		}
	}

	constructor();
}

function getRelativePos(value, min, max) {
	return Math.min(Math.max(value, min), max) / (max - min);
}


var inputsValid = checkInputValues();

if (inputsValid) {

	initializeMesh();

	var updateEvent = script.createEvent("UpdateEvent");
	updateEvent.bind(onUpdate);

	script.api.startCrossAnimation = startCrossAnimation;
}