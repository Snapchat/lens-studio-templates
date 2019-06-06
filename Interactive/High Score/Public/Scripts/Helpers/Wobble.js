// @input vec3 range
// @input vec3 speed
// @input vec3 offset

var transform = script.getTransform();

var startPosition = transform.getLocalPosition();

var timeElapsed = 0;

var tempOffset = new vec3(0, 0, 0);

script.createEvent("UpdateEvent").bind(function(eventData) {
    timeElapsed += global.getDeltaTime();

    tempOffset.x = Math.sin(script.offset.x + timeElapsed * script.speed.x) * script.range.x;
    tempOffset.y = Math.sin(script.offset.y + timeElapsed * script.speed.y) * script.range.y;
    tempOffset.z = Math.sin(script.offset.z + timeElapsed * script.speed.z) * script.range.z;

    var newPosition = startPosition.add(tempOffset);
    transform.setLocalPosition(newPosition);
});
