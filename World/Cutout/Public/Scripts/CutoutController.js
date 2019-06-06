// -----JS CODE-----
// Version: 0.0.1
// Event: Initialized
// Description: The primary script that drives the cut out template.

// @input Asset.Texture mainTexture {"label":"Texture"}
// @input float yOffset = 0.0 {"label":"Ground Offset", "widget":"slider", "min":-1.0, "max":1.0, "step":0.01}
// @input bool shadow
// @input bool lookAtCamera
// @input bool flip
// @input bool advanced = false
// @input SceneObject cutoutObject {"showIf": "advanced"}
// @input Asset.Material spriteMaterial {"showIf": "advanced"}
// @input SceneObject camera {"showIf": "advanced"}

var anchorTransform = script.cutoutObject.getParent().getTransform();

function onLensTurnOn()
{
    if( checkProperties() )
    {
        configureCutout();
    }
}
var turnOnEvent = script.createEvent( "TurnOnEvent" );
turnOnEvent.bind( onLensTurnOn ); 


function onUpdateEvent(eventData)
{
    if( script.lookAtCamera )
    {
        lookOnXYPlane( script.camera );
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent); 


function configureCutout()
{
    var offsetMultiplier = 50;

    var mainMeshVisual = script.cutoutObject.getFirstComponent( "Component.MeshVisual" );

    var textureWidth = script.mainTexture.getWidth();
    var textureHeight = script.mainTexture.getHeight()
    var textureAspect  = textureWidth / textureHeight;

    var OffsetTo = new vec3(
        anchorTransform.getLocalPosition().x,
        anchorTransform.getLocalPosition().y + ( script.yOffset * offsetMultiplier ),
        anchorTransform.getLocalPosition().z
    );

    var ScaleTo = new vec3(
        anchorTransform.getLocalScale().x * textureAspect,
        anchorTransform.getLocalScale().y,
        anchorTransform.getLocalScale().z
    );

    if( script.flip )
    {
        ScaleTo.x = -ScaleTo.x;
    }

    anchorTransform.setLocalPosition( OffsetTo );
    anchorTransform.setLocalScale( ScaleTo );

    var materialClone = script.spriteMaterial.clone();
    mainMeshVisual.mainMaterial = materialClone;

    mainMeshVisual.mainPass.baseTex = script.mainTexture;

    mainMeshVisual.meshShadowMode = script.shadow ? 1 : 0;

}


function lookOnXYPlane( objectToLookAt )
{
    var offset = objectToLookAt.getTransform().getWorldPosition().sub( anchorTransform.getWorldPosition() );
    offset.y = 0;
    offset = offset.normalize();
    var rotationToApply = quat.lookAt( offset, vec3.up() );
    anchorTransform.setWorldRotation( rotationToApply );
}


function checkProperties()
{
    if( !script.mainTexture )
    {
        print( "CutoutController, ERROR: Please assign cutout texture to the Texture input." );
        return false;
    }

    if( !script.cutoutObject )
    {
        print( "CutoutController, ERROR: Please assign cutout object under the advanced checkbox to the Cutout Object input." );
        return false;
    }

    if( !script.spriteMaterial )
    {
        print( "CutoutController, ERROR: Please assign sprite material under the advanced checkbox to the Sprite Material input." );
        return false;
    }

    if( !script.camera )
    {
        print( "CutoutController, ERROR: Please assign camera under the advanced checkbox to the Camera input." );
        return false;
    }

    return true;
}