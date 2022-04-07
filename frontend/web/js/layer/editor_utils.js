function drawBackground(originalImage) {
    var canvas = document.getElementById('background')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 1000
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function drawOriginalImageLayerThumbnail(originalImage) {

    var canvas = document.getElementById('originalImageThumbnail')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function createCanvasToDrawOn(width, height, x, y) {

    var canvas = document.getElementById("layerToDrawOn");
    canvas.width = width;
    canvas.height = height

    canvas.style.position = "absolute";
    canvas.style.left = x + 'px';
    canvas.style.top = y + 'px';

    return canvas;
}

function drawNewLayerThumbnail(width, height) {

    var canvas = document.getElementById('newLayerThumbnail')
    var ratio = width/height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(new Image(), 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateRandomImageTitle(prefix, index) {
    const length = 5;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return prefix + result + ".png";
    //return prefix + index + ".png";
}

//https://stackoverflow.com/questions/12992681/html-5-canvas-get-color-of-an-image-and-then-change-the-pixels-with-that-color
function changeImageColor(context, width, height) {
    {
        const image = context.getImageData(0, 0, width, height);
        const {data} = image;
        const {length} = data;

        for (let i = 0; i < length; i += 4) { // red, green, blue, and alpha
            data[i] = 0;//r
            data[i + 1] = 0;//g
            data[i + 2] = 0;//b
        }
        context.putImageData(image, 0, 0);
    }
}

