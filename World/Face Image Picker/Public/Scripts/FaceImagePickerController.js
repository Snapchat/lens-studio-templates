// FaceImagePickerController.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Creates a callback to change the original face to the face image picker texture

// @input Asset.Material faceMaterial
// @input Asset.Texture loadingFaceTexture
// @input Asset.Texture faceImagePickerTexture

var showImagePickerDelay = 1;

function onLensTurnOn()
{
    if(script.loadingFaceTexture)
    {
        if(script.faceMaterial)
        {
            script.faceMaterial.mainPass.baseTex = script.loadingFaceTexture;
        }
    }

	showImagePickerEvent.reset(showImagePickerDelay);
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOn);   

var showImagePickerEvent = script.createEvent("DelayedCallbackEvent");
showImagePickerEvent.bind(showImagePicker);

function externalImageCallback() 
{
    if(script.faceImagePickerTexture)
    {
        if(script.faceMaterial)
        {
            script.faceMaterial.mainPass.baseTex = script.faceImagePickerTexture;
        }
        else
        {
            print("FaceImagePickerController: Make sure to set the Face Material");
        }
    }
    else
    {
        print("FaceImagePickerController: Make sure to set the Face Image Picker Texture");
    }
}

function showImagePicker()
{
    if(script.faceImagePickerTexture)
    {
        if(script.faceImagePickerTexture.control.showImagePicker)
        {
            script.faceImagePickerTexture.control.showImagePicker();
            script.faceImagePickerTexture.control.setImageChangedCallback(externalImageCallback);
        }
    }
    else
    {
        print("FaceImagePickerController: Make sure to set the Face Image Picker Texture");
    }
}