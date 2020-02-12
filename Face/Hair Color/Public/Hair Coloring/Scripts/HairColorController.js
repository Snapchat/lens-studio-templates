//@input vec3 colorVal1 = {0.94, 0.2, 0.1} {"widget":"color", "label":"Base color"}
//@input int mode = 0 {"widget":"combobox", "values":[{"label":"Full head", "value":0}, {"label":"Ends", "value":1}, {"label":"Roots", "value":2}]}

//@input bool secondColor = false
//@ui {"widget":"group_start", "label":"Additional color", "showIf":"secondColor"}

//@input vec3 colorVal2 = {0.2, 0.5, 0.96} {"label":"Secondary color", "widget":"color"}
//@input int gradientMode = 0 {"widget":"combobox", "values":[ {"label":"Ombre", "value":0}, {"label":"Split", "value":1}], "showIf":"mode", "showIfValue":0} 
//@input bool swapColors = false

//@ui {"widget":"group_end"}

//@input bool advanced = false
//@ui {"widget":"group_start", "showIf":"advanced"}
//@input Component.PostEffectVisual hairColorEffect {"showIf":"advanced"}
//@input Component.Camera camera {"showIf":"advanced"}
//@ui {"widget":"group_end"}

var sceneObject = scene.createSceneObject("");
var head = sceneObject.createComponent("Head");
head.faceIndex = 0;
head.setAttachmentPointType(AttachmentPointType.CandideCenter);

var pass = script.hairColorEffect.mainPass
var gradientMode = script.gradientMode

if(script.mode == 0 && !script.secondColor) {
    //single color full 0
    gradientMode = 0;
}
if(script.mode == 1 && !script.secondColor) {
    //single color ends 2
    gradientMode = 2;
}
if(script.mode == 2 && !script.secondColor) {
    //singles color roots 3
    gradientMode = 3;
}
if(script.mode == 0 && script.secondColor) {
    if (script.gradientMode == 0){
        //double color full 1
        gradientMode = 1;
    }
    if (script.gradientMode == 1){
        //double split full 4
        gradientMode = 4;
    }
}
if(script.mode == 1 && script.secondColor) {
    //double split ends 5
    gradientMode = 5;
}
if(script.mode == 2 && script.secondColor) {
    //double split roots 6
    gradientMode = 6;
}

var colorVal1 = script.colorVal1,
    colorVal2 = script.colorVal1;

if (script.secondColor) {
    colorVal2 = script.colorVal2;
}

if (script.swapColors) {
    var tmp = colorVal1;
    colorVal1 = colorVal2;
    colorVal2 = tmp;
}

pass.useGradient = gradientMode + 0.0;
pass.facea = new vec4(0.5,0.5,0.5,0);
pass.facedir = new vec2(-1.0, 0.0);
pass.baseColor1 = colorVal1;
if (script.secondColor) {
    pass.baseColor2 = colorVal2;
}

function update(eventData) {
    if (head.getFacesCount() > 0) {
        var transform = head.getTransform();
        var center1 = transform.getWorldPosition();        
        var center2 = center1;
        center2.y += 20.0;

        var projectedCenter1 = script.camera.project(center1);
        var projectedCenter2 = script.camera.project(center2);
        projectedCenter2 = projectedCenter2.sub(projectedCenter1);
        var size = 1.7 * projectedCenter2.y * projectedCenter2.y;

        var eulerAngles = transform.getLocalRotation().toEulerAngles();
        pass.facea = new vec4(0.5 + projectedCenter1.x, 0.5 + projectedCenter1.y, size, Math.sin(eulerAngles.x));
        var vectorFace = new vec2(transform.left.x, transform.left.y);
        pass.facedir = vectorFace.normalize();
    }
}
script.createEvent("UpdateEvent").bind(update);
