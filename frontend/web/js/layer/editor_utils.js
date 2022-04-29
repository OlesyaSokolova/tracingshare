function drawBackground(elementId, originalImage) {
    var canvas = document.getElementById(elementId)
    var ratio = originalImage.width/originalImage.height
    var constWidth = 1000
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

//todo: эта функция действительно используется??
function redrawBackground(originalImage, newAlpha) {
    var canvas = document.getElementById('background')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 1000
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.globalAlpha = newAlpha;

    originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
    originalImageCtx.globalCompositeOperation = "source-in";
    originalImageCtx.fillRect(0, 0, canvas.width, canvas.height);
    originalImageCtx.globalCompositeOperation = "source-over";

    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function drawLayer(imageWithSettings, contextToDrawOn) {
    if (imageWithSettings.image.complete && imageWithSettings.image.naturalHeight !== 0) {


        //2. set size of contextToDrawOn for the canvas
        var width = contextToDrawOn.canvas.width
        var height = contextToDrawOn.canvas.height

        //3. set alpha channel for current image
        contextToDrawOn.globalAlpha = imageWithSettings.alpha;

        //4. fill the context with color of current image
        contextToDrawOn.clearRect(0, 0, width, height);
        contextToDrawOn.drawImage(imageWithSettings.image, 0, 0, width, height)
        contextToDrawOn.fillStyle = imageWithSettings.color;
        contextToDrawOn.globalCompositeOperation = "source-in";
        contextToDrawOn.fillRect(0, 0, width, height);
        contextToDrawOn.globalCompositeOperation = "source-over";

        //contextToDrawOn.drawImage(imageWithSettings.image, 0, 0, width,  height);
    }
}

function redrawLayer(context, newAlpha) {

    var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    //context.globalAlpha = newAlpha;

    //var imageData = context.getImageData(0, 0, width, height);

    for (let i = 0; i < imageData.length; i += 4) { // red, green, blue, and alpha
        imageData[i] = 0;//r
        imageData[i + 1] = 0;//g
        imageData[i + 2] = 0;//b
        console.log("before: " + imageData[i + 3])
        imageData[i + 3] = 255;//a
        console.log("after: " + imageData[i + 3])
    }
    context.putImageData(imageData, 0, 0);
    //context.putImageData(imageData, 0, 0);

    /*context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.globalCompositeOperation = "source-in";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.globalCompositeOperation = "source-over";*/
    //context.fillStyle = "rgba(255, 255, 255, 100)";
    //context.putImageData(imageData, 0, 0);
    //context.restore();

    return context;
}

function drawOriginalImageLayerThumbnail(elementId, originalImage) {

    var canvas = document.getElementById(elementId)
    var ratio = originalImage.width/originalImage.height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function createCanvasToDrawOn(canvasId, width, height, x, y) {

    //var canvas = document.getElementById("layerToDrawOn");
    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height

    canvas.style.position = "absolute";
    canvas.style.left = x + 'px';
    canvas.style.top = y + 'px';

    return canvas;
}

function drawNewLayerThumbnail(elementId, width, height) {
    var canvas = document.getElementById(elementId)
    var ratio = width/height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(new Image(), 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function drawExistingLayerThumbnail(elementId, layerImage, color, width, height) {

    var canvas = document.getElementById(elementId)
    //add element as child to id = otherLayersThumbnails
    var ratio = width / height
    var constWidth = 200
    var correspondingHeight = constWidth / ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight
    var newLayerCtx = canvas.getContext('2d');

    newLayerCtx.clearRect(0, 0, canvas.width, canvas.height);
    newLayerCtx.drawImage(layerImage, 0, 0, canvas.width, canvas.height)
    newLayerCtx.fillStyle = color;
    newLayerCtx.globalCompositeOperation = "source-in";
    newLayerCtx.fillRect(0, 0, canvas.width, canvas.height);
    newLayerCtx.globalCompositeOperation = "source-over";

    //newLayerCtx.drawImage(layerImage, 0, 0, canvas.width,  canvas.height);

    return newLayerCtx
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
            if(data[i + 3] > 0) {
                data[i + 3] = 255;
            }
        }
        context.putImageData(image, 0, 0);
    }
}

function colorToRGBAString(color) {
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a +")";
}

function colorToHEXString(color) {
        var red = color.r.toString(16);
        if(red.length === 1) {
            red = "0" + red;
        }
        var green = color.g.toString(16);
        if(green.length === 1) {
            green = "0" + green;
        }
        var blue = color.b.toString(16);
        if(blue.length === 1) {
            blue = "0" + blue;
        }
        return "#" + red + green + blue;
}

