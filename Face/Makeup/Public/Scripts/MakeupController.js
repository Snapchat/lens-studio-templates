

//@input int faceIndex = 0 {"widget":"combobox", "values":[{"label":"First", "value":0}, {"label":"Second", "value":1} ]}
//@ui {"widget":"separator"}

//@input bool enableLips = true {"label": "Lips Tint"}
//@ui {"widget":"group_start", "label": "Lips Tint Properties",  "showIf" : "enableLips"}
//@input vec3 colorLips = {1.0,0.0,0.0} {"widget":"color", "showIf" : "enableLips", "label":"Color"}
//@input float alphaLips = 0.45 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableLips", "label": "Intensity"}
//@ui {"widget":"group_end"}

//@input bool enableLipgloss = true {"label": "Lip Gloss"}
//@ui {"widget":"group_start", "label": "Lip Gloss Properties",  "showIf" : "enableLipgloss"}
//@input vec3 colorLipgloss = {1.0,1.0,1.0} {"widget":"color", "showIf" : "enableLipgloss", "label":"Color"}
//@input float alphaLipgloss = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableLipgloss", "label": "Intensity"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}

//@input bool enableBlush = true {"label": "Blush"}
//@ui {"widget":"group_start", "label": "Blush Properties",  "showIf" : "enableBlush"}
//@input vec3 colorBlush = {0.92,0.65,0.68} {"widget":"color", "showIf" : "enableBlush", "label":"Color"}
//@input float alphaBlush = 0.5 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableBlush", "label": "Intensity"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}


//@input bool enableEyeliner = true {"label": "Eyeliner"}
//@ui {"widget":"group_start", "label": "Eyeliner Properties",  "showIf" : "enableEyeliner"}
//@input vec3 colorEyeliner = {0.2,0.2,0.2} {"widget":"color", "showIf" : "enableEyeliner", "label":"Color"}
//@input float alphaEyeliner = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableEyeliner", "label": "Intensity"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}

//@input bool enableEyeshadow = true {"label": "Eyeshadow"}
//@ui {"widget":"group_start", "label": "Eyeshadow Properties",  "showIf" : "enableEyeshadow"}
//@input int eyeshadowType = 1 {"widget":"combobox", "values":[{"label":"Single color", "value":0}, {"label":"Two colors", "value":1}, {"label":"Single color heavy", "value":2}, {"label":"Two colors heavy", "value":3}], "showIf" : "enableEyeshadow", "label":"Type"}

//@ui {"widget":"group_start", "label": "First Color"}
//@input vec3 colorEyeshadow1 = {1.0,0.0,0.0} {"widget":"color", "showIf" : "enableEyeshadow", "label":"Color"}
//@input float alphaEyeshadow1 = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf":"enableEyeshadow", "label": "Intensity"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label": "Second Color", "showIf" : "eyeshadowType", "showIfValue" : 1}
//@input vec3 colorEyeshadow2 = {0.0,1.0,0.0} {"widget":"color", "label":"Color 2"}
//@input float alphaEyeshadow2 = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "label": "Intensity 2"}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label": "Second Color", "showIf" : "eyeshadowType", "showIfValue" : 3}
//@input vec3 colorEyeshadow3 = {0.0,0.0,1.0} {"widget":"color", "label":"Color 2"}
//@input float alphaEyeshadow3 = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "label": "Intensity 2"}
//@ui {"widget":"group_end"}
//@ui {"widget":"group_end"}


//@ui {"widget":"separator"}

//@input bool enableMascara = true {"label": "Mascara"}
//@ui {"widget":"group_start", "label": "Mascara Properties",  "showIf" : "enableMascara"}
//@input vec3 colorMascara = {1.0,0.0,0.0} {"widget":"color", "showIf" : "enableMascara", "label":"Color"}
//@input float alphaMascara = 0.8 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableMascara", "label": "Intensity"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}

//@input bool enableEyebrows = true {"label": "Eyebrows"}
//@ui {"widget":"group_start", "label": "Eyebrows Properties",  "showIf" : "enableEyebrows"}
//@input vec3 colorEyebrows = {0.0,0.0,0.0} {"widget":"color", "showIf" : "enableEyebrows", "label":"Color"}
//@input float alphaEyebrows = 0.4 {"widget":"slider", "min": 0.0, "max": 1.0, "step": 0.01, "showIf" : "enableEyebrows", "label": "Intensity"}
//@ui {"widget":"group_end"}
//@ui {"widget":"separator"}

//@input bool advanced = false
//@input Component.FaceMaskVisual lips {"showIf" : "advanced"}
//@input Component.FaceMaskVisual lipgloss {"showIf" : "advanced"}
//@input Component.FaceMaskVisual blush {"showIf" : "advanced"}
//@input Component.FaceMaskVisual eyeliner {"showIf" : "advanced"}
//@input Component.FaceMaskVisual[] eyeshadow {"showIf" : "advanced"}
//@input Component.FaceMaskVisual mascara {"showIf" : "advanced"}
//@input Component.FaceMaskVisual eyebrows {"showIf" : "advanced"}



function setColor (_component, _color, alpha) {
    var pass = _component.mainPass
    pass.baseColor = new vec4(_color.x, _color.y, _color.z, alpha)
}

if (script.lips) {
    script.lips.enabled = script.enableLips
    script.lips.faceIndex = script.faceIndex
    setColor(script.lips, script.colorLips, script.alphaLips)
}

if (script.lipgloss) {
    script.lipgloss.enabled = script.enableLipgloss
    script.lipgloss.faceIndex = script.faceIndex
    setColor(script.lipgloss, script.colorLipgloss, script.alphaLipgloss)
}

if (script.blush) {
    script.blush.enabled = script.enableBlush
    script.blush.faceIndex = script.faceIndex
    setColor(script.blush, script.colorBlush, script.alphaBlush)
}

if (script.eyeliner) {
    script.eyeliner.enabled = script.enableEyeliner
    script.eyeliner.faceIndex = script.faceIndex
    setColor(script.eyeliner, script.colorEyeliner, script.alphaEyeliner)
}


if (script.enableEyeshadow && script.eyeshadow && script.eyeshadow.length > 2){
    script.eyeshadow[0].faceIndex = script.faceIndex
    script.eyeshadow[1].faceIndex = script.faceIndex
    script.eyeshadow[2].faceIndex = script.faceIndex
  
    if (script.eyeshadowType == 0) {
        script.eyeshadow[0].enabled = false
        script.eyeshadow[1].enabled = true
        setColor(script.eyeshadow[1], script.colorEyeshadow1, script.alphaEyeshadow1)

        script.eyeshadow[2].enabled = false
    }

    if (script.eyeshadowType == 1) {
        script.eyeshadow[0].enabled = true
        setColor(script.eyeshadow[0], script.colorEyeshadow1, script.alphaEyeshadow1)

        script.eyeshadow[1].enabled = true
        setColor(script.eyeshadow[1], script.colorEyeshadow2, script.alphaEyeshadow2)
        
        script.eyeshadow[2].enabled = false
    }

    if (script.eyeshadowType == 2) {
        script.eyeshadow[0].enabled = false
        script.eyeshadow[1].enabled = false
        script.eyeshadow[2].enabled = true
        setColor(script.eyeshadow[2], script.colorEyeshadow1, script.alphaEyeshadow1)
    }

    if (script.eyeshadowType == 3) {
        script.eyeshadow[0].enabled = true
        script.eyeshadow[1].enabled = false
        script.eyeshadow[2].enabled = true
        setColor(script.eyeshadow[0], script.colorEyeshadow1, script.alphaEyeshadow1)
        setColor(script.eyeshadow[2], script.colorEyeshadow3, script.alphaEyeshadow3)
    }
}

if (script.mascara) {
    script.mascara.enabled = script.enableMascara
    script.mascara.faceIndex = script.faceIndex
    setColor(script.mascara, script.colorMascara, script.alphaMascara)
}


if (script.eyebrows) {
    script.eyebrows.enabled = script.enableEyebrows
    script.eyebrows.faceIndex = script.faceIndex
    setColor(script.eyebrows, script.colorEyebrows, script.alphaEyebrows)
}
