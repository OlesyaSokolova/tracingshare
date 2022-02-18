function updateAllLayers(drawingsImages) {
    var originalImageCtx = drawOriginalImage(originalImage)
    addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = originalImageCtx)
}

function drawImage(imageWithSettings, contextToDrawOn) {
    if (imageWithSettings.image.complete && imageWithSettings.image.naturalHeight !== 0) {

        //1. create virtual canvas and context for current image
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        //2. set size of contextToDrawOn for the canvas
        canvas.width = contextToDrawOn.canvas.width
        canvas.height = contextToDrawOn.canvas.height

        //3. set alpha channel for current image

        context.globalAlpha = imageWithSettings.alpha;

        //4. fill the context with color of current image
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageWithSettings.image, 0, 0, canvas.width, canvas.height)
        context.fillStyle = imageWithSettings.color;
        context.globalCompositeOperation = "source-in";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = "source-over";

        //5. render virtual canvase with image on contextToDrawOn
        contextToDrawOn.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
}
function initDrawingsArray(jsonSettings) {

    var drawingsJson = jsonSettings.drawings;
    var drawingsImages = []
    for (let i = 0; i < drawingsJson.length; i++) {
        drawingImage = new Image();
        drawingImage.src = drawingPathPrefix + drawingsJson[i].image;
        alpha = parseFloat(drawingsJson[i].layerParams.alpha)
        color = drawingsJson[i].layerParams.color

        drawingsImages.push({"image": drawingImage, "alpha": alpha, "color": color});
    }
    return drawingsImages
}

function drawOriginalImage(originalImage) {

    var canvas = document.getElementById('petroglyphCanvas')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 700
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function addImagesToContext(imagesArray, contextToDrawOn) {
    for (let i = 0; i < imagesArray.length; i++) {
        drawImage(imagesArray[i], contextToDrawOn)
    }
}
