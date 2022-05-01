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
    var drawingsImages = []
    if(typeof jsonSettings != "undefined"
        && jsonSettings !== ''
        && jsonSettings !== ""
        && jsonSettings.drawings.length > 0) {
        var drawingsJson = jsonSettings.drawings;
        for (let i = 0; i < drawingsJson.length; i++) {
            drawingImage = new Image();
            drawingImage.src = drawingPathPrefix + drawingsJson[i].image;
            alpha = parseFloat(drawingsJson[i].layerParams.alpha)
            color = drawingsJson[i].layerParams.color
            title = drawingsJson[i].layerParams.title
            //drawingImage.onload = function () {
            drawingsImages.push({"image": drawingImage, "alpha": alpha, "color": color, "title": title});
            // }
        }
    }
    return drawingsImages
}

function drawOriginalImage(originalImage) {

    var canvas = document.getElementById('publicationCanvas')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 1000
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}

function addImagesToContext(imagesArray, contextToDrawOn) {
    for (let i = 0; i < imagesArray.length; i++) {
        var currentImage = imagesArray[i].image;
        if (isImageOk(currentImage)) {
            drawImage(imagesArray[i], contextToDrawOn)
        } else {
            currentImage.onload = function () {
                drawImage(imagesArray[i], contextToDrawOn)
            }
        }
    }
}

//https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-with-jquery
function isImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.
    if (img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}

