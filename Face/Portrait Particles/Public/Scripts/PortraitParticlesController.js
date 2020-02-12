// -----JS CODE-----
// PortraitParticlesController.js
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the portrait particles template. Has
// a large assortment of exposed inputs and the logic to actually modify the 
// template content based on these inputs

// @input bool addHeader {"label":"Header"}
// @ui {"widget":"group_start", "label":"Header Properties", "showIf":"addHeader"}
// @input Asset.Texture headerTexture {"label":"Texture"}
// @input int headerBlendMode = 0 {"widget": "combobox", "values":[{"label": "Normal", "value": 0}, {"label": "Multiply", "value": 10}, {"label": "Screen", "value": 3}], "label":"Blend mode"}
// @input float headerAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "label":"Alpha"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addFooter {"label":"Footer"}
// @ui {"widget":"group_start", "label":"Footer Properties", "showIf":"addFooter"}
// @input Asset.Texture footerTexture {"label":"Texture"}
// @input int footerBlendMode = 0 {"widget": "combobox", "values":[{"label": "Normal", "value": 0}, {"label": "Multiply", "value": 10}, {"label": "Screen", "value": 3}], "label":"Blend mode"}
// @input float footerAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01, "label":"Alpha"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addParticles {"label":"Particles"}
// @ui {"widget":"group_start", "label":"Particles Properties", "showIf":"addParticles"}
// @input int particleIndex {"label": "Particle", "widget":"combobox", "values":[{"label":"Bokeh", "value":0}, {"label":"Confetti", "value":1}, {"label":"Flower Petals", "value":2}, {"label":"Fireworks", "value":3}, {"label":"Balloons", "value":4}, {"label":"Custom", "value":5}]}
// @input Asset.Material customParticleMaterial {"label":"Custom Particle", "showIf": "particleIndex", "showIfValue": 5}
// @input float particleAmount = 500.0 {"widget":"slider", "min":0.0, "max":1000.0, "step":1.0, "label":"Amount"}
// @input vec3 emitterColorMin {"widget":"color", "label":"Color A"}
// @input vec3 emitterColorMax {"widget":"color", "label":"Color B"}
// @input float emitterAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.1, "label":"Alpha"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addText {"label":"Text"}
// @ui {"widget":"group_start", "label":"Text Properties", "showIf":"addText"}
// @input string customText {"label":"Text"}
// @input int textSize = 50 {"label":"Size"}
// @input float textYOffset {"widget":"slider", "min":-1.0, "max":1.0, "step":0.01, "label":"Offset"}
// @input vec4 textColor {"widget":"color", "label":"Color"}
// @input bool addOutline {"label": "Outline"}
// @input vec4 outlineColor {"widget":"color", "label": "Outline Color", "showIf":"addOutline"}
// @input bool addDropShadow {"label": "Drop Shadow"}
// @input vec4 dropShadowColor {"widget":"color", "label": "Shadow Color", "showIf":"addDropShadow"}
// @input bool addCustomFont {"label": "Custom Font"}
// @input Asset.Font customFont {"label": "Font", "showIf":"addCustomFont"}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool addPostEffect {"label":"Post Effect"}
// @ui {"widget":"group_start", "label":"Post Effect Properties", "showIf":"addPostEffect"}
// @input Asset.Texture postEffectTexture {"label": "Texture"}
// @input float postEffectAlpha = 1.0 {"label": "Alpha", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @ui {"widget":"group_end"}

//@ui {"widget":"separator"}

// @input bool hideMe {"label": "Advanced"}
// @input SceneObject[] particles {"label":"Particles", "showIf": "hideMe"}
// @input Component.Image header {"label":"Header Image", "showIf": "hideMe"}
// @input Component.Image footer {"label":"Footer Image", "showIf": "hideMe"}
// @input Component.Text textComponent {"label":"Text", "showIf": "hideMe"}
// @input Component.MeshVisual customParticleMesh {"label":"Text", "showIf": "hideMe"}
// @input Component.PostEffectVisual postEffect {"label":"Post Effect", "showIf": "hideMe"}

configureFooter();
configureHeader();
configureParticles();
configureText();
configurePostEffect();

function configureHeader(){
    if (!script.header){
        print( "PartyTimeController, ERROR: Please assign header image object" );
        return;
    }
    if (script.addHeader){
        script.header.enabled = true; 
        if (!script.headerTexture){
            print( "PartyTimeController, WARNING: Please assign header texture" );
            return;
        }
        script.header.mainPass.baseTex = script.headerTexture;
        script.header.mainPass.blendMode = script.headerBlendMode;
        setAlpha( script.header, script.headerAlpha);
    } 
    else{
        script.header.enabled = false;
    }
}

function configureFooter(){
    if (!script.footer){
        print( "PartyTimeController, ERROR: Please assign footer image object" );
        return;
    }
    if (script.addFooter){
        script.footer.enabled = true; 
        if (!script.footerTexture){
            print( "PartyTimeController, WARNING: Please assign footer texture" );
            return;
        }
        script.footer.mainPass.baseTex = script.footerTexture;
        script.footer.mainPass.blendMode = script.footerBlendMode;
        setAlpha( script.footer, script.footerAlpha);
    } 
    else{
        script.footer.enabled = false;
    }
}

function configureText(){
    if (!script.textComponent){
        print( "PartyTimeController, ERROR: Please assign text object" );
        return;
    }
    if (script.addText){
        script.textComponent.size = script.textSize;

        var textScreenTransform = script.textComponent.getSceneObject().getFirstComponent( "Component.ScreenTransform" );
        textScreenTransform.anchors.top = script.textYOffset;

        script.textComponent.enabled = true; 
        script.textComponent.text = script.customText;
        script.textComponent.textFill.color = script.textColor;

        //outline settings 
        if (script.addOutline){
            script.textComponent.outlineSettings.enabled = true; 
            script.textComponent.outlineSettings.fill.color = script.outlineColor;
        } 
        else{
            script.textComponent.outlineSettings.enabled = false;
        }

        //drop shadow settings 
        if (script.addDropShadow){
            script.textComponent.dropshadowSettings.enabled = true; 
            script.textComponent.dropshadowSettings.fill.color = script.dropShadowColor;
        } 
        else{
            script.textComponent.dropshadowSettings.enabled = false;
        }

        //font settings 
        if (script.addCustomFont){
            if (!script.customFont){
                print( "PartyTimeController, ERROR: Please assign custom font" );
                return;
            }
            script.textComponent.font = script.customFont;
        }

    } 
    else{
        script.textComponent.enabled = false;
    }
}

function configureParticles(){
    if (script.addParticles){
        swapSet( script.particles, script.particleIndex);

        var particle = script.particles[script.particleIndex]; 
        for (var i = 0; i < particle.getComponentCount("Component.ScriptComponent");i++){
            var scriptComponent = particle.getComponentByIndex( "Component.ScriptComponent", i);
            scriptComponent.api.particleAmount = script.particleAmount;
            scriptComponent.api.emitterColorMin = script.emitterColorMin;
            scriptComponent.api.emitterColorMax = script.emitterColorMax;
            scriptComponent.api.emitterAlpha = script.emitterAlpha;
        }
    } 
    else{
        swapSet(script.particles);
    }
}

function configurePostEffect(){
    if (!script.postEffect){
        print( "PartyTimeController, ERROR: Please assign post effect object" );
        return;
    }
    if (script.addPostEffect){
        script.postEffect.enabled = true; 
        if (!script.postEffectTexture){
            print( "PartyTimeController, WARNING: Please assign post effect texture" );
            return;
        }
        script.postEffect.mainPass.baseTex = script.postEffectTexture; 
        setAlpha( script.postEffect, script.postEffectAlpha);
    } 
    else{
        script.postEffect.enabled = false;
    }
}

function setAlpha( image, alpha ){
    image.mainPass.baseColor = new vec4( image.mainPass.baseColor.r, image.mainPass.baseColor.g, image.mainPass.baseColor.b, alpha );
}

function swapSet( set, index ){
    for (var i = 0; i < set.length; i++){
        set[i].enabled = false; 
    }
    if (index != null){
        set[index].enabled = true;
        if(index == 5){
            if (!script.customParticleMesh){
                print( "PartyTimeController, ERROR: Please assign Custom Particle Mesh object" );
                return;
            }

            if (!script.customParticleMaterial){
                print( "PartyTimeController, WARNING: Please assign Custom Particle material" );
                return;
            }

            script.customParticleMesh.clearMaterials();
            script.customParticleMesh.addMaterial(script.customParticleMaterial);
            var particle = set[index];
            for (var i = 0; i < particle.getComponentCount("Component.ScriptComponent");i++){
                var scriptComponent = particle.getComponentByIndex( "Component.ScriptComponent", i);
                scriptComponent.api.emitter = script.customParticleMaterial;
            }
        }
    }
}

