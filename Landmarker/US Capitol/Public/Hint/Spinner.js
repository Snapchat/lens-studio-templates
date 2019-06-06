// @input SceneObject ring
// @input float speed

var rotation = 0;

const transform = script.ring.getTransform();
const speed = -script.speed;
const forward = vec3.forward();

script.createEvent("UpdateEvent").bind(function() {
    rotation += speed;
    transform.setLocalRotation(quat.angleAxis(rotation, forward));
});


