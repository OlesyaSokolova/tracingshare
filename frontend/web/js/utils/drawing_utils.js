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
    }
}
function createCanvasToDrawOn(canvasId, width, height, x, y) {

    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height

    canvas.style.position = "absolute";
    canvas.style.left = x + 'px';
    canvas.style.top = y + 'px';

    return canvas;
}

function drawExistingLayerThumbnail(elementId, layerImage, color, width, height) {
    var canvas = document.getElementById(elementId)
    var ratio = width / height
    var constWidth = 150
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
    return newLayerCtx
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

function generateNewName(prefix, drawings) {
    var newLayerIndex = 0;
    if(drawings.length > 0) {
        drawings.sort((a, b) => {
            var aiString = ((a.image).split('_')[2]).split('.')[0]
            let ai = parseInt(aiString)
            var biString = ((b.image).split('_')[2]).split('.')[0]
            bi = parseInt(biString);
            return ai - bi;
        })

        var lastDrawing = drawings[drawings.length - 1].image;
        var newLayerIndexString = ((lastDrawing).split('_')[2]).split('.')[0]
        newLayerIndex = parseInt(newLayerIndexString) + 1;
    }

    return prefix + newLayerIndex + ".png";
}

function matchClickedColor(drawingLayerData, currentPixelIndex, clickedColor)
{
    const IMAGE_DATA_RED_SHIFT = 0;
    const IMAGE_DATA_GREEN_SHIFT = 1;
    const IMAGE_DATA_BLUE_SHIFT = 2;
    const IMAGE_DATA_ALPHA_SHIFT = 3;

    var r = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_RED_SHIFT];
    var g = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_GREEN_SHIFT];
    var b = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_BLUE_SHIFT];
    var a = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_ALPHA_SHIFT];

    // If the current pixel matches the clicked color
    return r === clickedColor.r
        && g === clickedColor.g
        && b === clickedColor.b
        && a === clickedColor.a;
}

function colorPixel(drawingLayerData, currentPixelIndex, currentColor)
{
    const IMAGE_DATA_RED_SHIFT = 0;
    const IMAGE_DATA_GREEN_SHIFT = 1;
    const IMAGE_DATA_BLUE_SHIFT = 2;
    const IMAGE_DATA_ALPHA_SHIFT = 3;

    drawingLayerData.data[currentPixelIndex + IMAGE_DATA_RED_SHIFT] = currentColor.r;
    drawingLayerData.data[currentPixelIndex + IMAGE_DATA_GREEN_SHIFT] = currentColor.g;
    drawingLayerData.data[currentPixelIndex + IMAGE_DATA_BLUE_SHIFT] = currentColor.b;
    drawingLayerData.data[currentPixelIndex + IMAGE_DATA_ALPHA_SHIFT] = currentColor.a;
}

function getMaxImageName(jsonDrawings) {

    var maxImageName = prefix + 0 + ".png";
    var drawingsJson = jsonDrawings.drawings;
    for (let i = 0; i < drawingsJson.length; i++) {
        //todo: string comparison;
        if (drawingsJson[i].image > maxImageName) {
            maxImageName = drawingsJson[i].image;
        }
    }
    return maxImageName;
}

