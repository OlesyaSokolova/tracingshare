function prepareLayersToDraw() {

    var currentSettings = {
        drawings: Array()
    }

        originalImage = new Image();
        originalImage.src = originalImageSrc;
        var drawingsImages = [];
        originalImage.onload = function () {
            if (typeof settings != "undefined"
                && settings !== ''
                && settings !== "") {
                currentSettings = JSON.parse(JSON.stringify(settings));
                drawingsImages = initDrawingsArray(currentSettings);
            }
        //create context and thumbnail for background
        var backroundId = "layer_" + (drawingsImages.length + 1) + "_canvas";
        var originalImageCtx = drawBackground(backroundId, originalImage);
        var originalImageThumbnailId = "thumbnail_"+ (drawingsImages.length + 1);
        drawOriginalImageLayerThumbnail(originalImageThumbnailId, originalImage);

        //create thumbnail for new layer
        newLayerThumbnail = new Image();
        var newLayerThumbnailId = "thumbnail_" + (drawingsImages.length);
        drawNewLayerThumbnail(newLayerThumbnailId, originalImage.width, originalImage.height);

        //create thumbnails for existing layers
        drawExistingLayersThumbnails(drawingsImages);

        //create array of contexts and canvases for layers to draw on:
        var mutableCanvasesAndContexts = [];
        var backgroundElement = document.getElementById(backroundId);
        const backgroundX = backgroundElement.offsetLeft, backgroundY = backgroundElement.offsetTop;

        for (let i = 0; i < drawingsImages.length; i++) {
            var currentImage = drawingsImages[i].image;
            var canvasId = "layer_" + i + "_canvas";
            var currentCanvas;
            var currentContext;
            if (isImageOk(currentImage)) {
                currentCanvas = createCanvasToDrawOn(canvasId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                    backgroundX, backgroundY);
                    currentContext = currentCanvas.getContext('2d');
                    drawLayer(drawingsImages[i], currentContext);
                    mutableCanvasesAndContexts.push({"id": canvasId, "canvas": currentCanvas, "context": currentContext });

            } else {
                currentImage.onload = function () {
                    currentCanvas = createCanvasToDrawOn(canvasId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                        backgroundX, backgroundY);
                    currentContext = currentCanvas.getContext('2d');
                    drawLayer(drawingsImages[i], currentContext);
                    mutableCanvasesAndContexts.push({"id": canvasId, "canvas": currentCanvas, "context": currentContext });
                }
            }
            //currentContex = currentCanvas.getContext('2d');
            ///drawLayer(currentImage, currentContex);
        }

        const newLayerCanvasId = "layer_" + (drawingsImages.length) + "_canvas";
        var newLayerCanvas = createCanvasToDrawOn(newLayerCanvasId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
            backgroundX, backgroundY);
        var newLayerContext = newLayerCanvas.getContext("2d");
        mutableCanvasesAndContexts.push({"id": newLayerCanvasId, "canvas": newLayerCanvas, "context": newLayerContext });

        var canvas = mutableCanvasesAndContexts.find(x => x.id === newLayerCanvasId).canvas;
        var context = mutableCanvasesAndContexts.find(x => x.id === newLayerCanvasId).context;
        canvas.onmousedown = startEditing;
        canvas.onmouseup = stopEditing;
        canvas.onmouseout = stopEditing;
        canvas.onmousemove = edit;

        //1.4. init vars and consts
        const eraserStyle = "rgba(255,255,255,255)";
        const eraserGlobalCompositeOperation = "destination-out";

        const brushGlobalCompositeOperation = context.globalCompositeOperation;

       var currentColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        };

        var brushStyle = colorToRGBAString(currentColor);

        var isDrawing = false;
        var isErasing = false;
        var isFilling = false;

        var brushIsClicked = false;
        var eraserIsClicked = false;
        var fillerIsClicked = false;

        var counter = 0;
        var previousTool;
        var previousThumbnail = document.getElementById("thumbnail_div_" + (drawingsImages.length));

        var drawingLayerData;
        var pixelStack = [];
        var clickedColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }
        const IMAGE_DATA_PIXEL_SHIFT = 4;
        const IMAGE_DATA_RED_SHIFT = 0;
        const IMAGE_DATA_GREEN_SHIFT = 1;
        const IMAGE_DATA_BLUE_SHIFT = 2;
        const IMAGE_DATA_ALPHA_SHIFT = 3;
        //1.5. init buttons

        var clearButton = document.getElementById("clear-layer-button");
        clearButton.addEventListener(
            'click', function (event) {
                breakCycle = false;
                context.clearRect(0, 0, canvas.width, canvas.height);
            });

        var brushButton = document.getElementById("brush-btn");
        brushButton.addEventListener(
            'click', function (event) {
                counter = 1;
                $(this).addClass('active');
                if (previousTool != null && !previousTool.isSameNode(this)) {
                    $(previousTool).removeClass('active');
                }
                previousTool = this;
                brushIsClicked = true;
                eraserIsClicked = false;
                fillerIsClicked = false;
            });

        var eraserButton = document.getElementById("eraser-btn");
        eraserButton.addEventListener(
            'click', function (event) {
                counter = 1;
                $(this).addClass('active');
                if (previousTool != null && !previousTool.isSameNode(this)) {
                    $(previousTool).removeClass('active');
                }
                previousTool = this;
                brushIsClicked = false;
                eraserIsClicked = true;
                fillerIsClicked = false;

            });

            var fillerButton = document.getElementById("filler-btn");
            fillerButton.addEventListener(
                'click', function (event) {
                    counter = 1;
                    $(this).addClass('active');
                    if (previousTool != null && !previousTool.isSameNode(this)) {
                        $(previousTool).removeClass('active');
                    }
                    previousTool = this;
                    brushIsClicked = false;
                    eraserIsClicked = false;
                    fillerIsClicked = true;
                })

        function startEditing(e) {
            if (counter === 1) {
                isDrawing = false;
                counter = 2;
            }

            if (counter === 2 && brushIsClicked) {
                isDrawing = true;
                isErasing = false;
                context.beginPath();
                context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
            }

            if (counter === 2 && eraserIsClicked) {
                isErasing = true;
                isDrawing = false;
                context.beginPath();
                context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
            }
            if (counter === 2 && fillerIsClicked) {
                isErasing = false;
                isDrawing = false;
                isFilling = true;
                drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
                fillArea(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop)
            }
        }

        function edit(e) {
            var x, y;
            if (isDrawing === true && counter === 2) {
                context.globalCompositeOperation = brushGlobalCompositeOperation;
                context.strokeStyle = brushStyle;
                context.lineCap = "round";
                context.lineJoin = "round";

                x = e.pageX - canvas.offsetLeft;
                y = e.pageY - canvas.offsetTop;

                context.lineTo(x, y);
                context.stroke();

            } else if (isErasing === true && counter === 2) {
                context.globalCompositeOperation = eraserGlobalCompositeOperation;
                context.strokeStyle = eraserStyle;

                x = e.pageX - canvas.offsetLeft;
                y = e.pageY - canvas.offsetTop;

                context.lineTo(x, y);
                context.stroke();
            }
        }

        function stopEditing() {
            isDrawing = false;
            isErasing = false;
            isFilling = false;
        }

        function fillArea(x, y) {
            var currentPixelIndex = (y * (canvas.width) + x) * IMAGE_DATA_PIXEL_SHIFT;
            clickedColor.r = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_RED_SHIFT];
            clickedColor.g = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_GREEN_SHIFT];
            clickedColor.b = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_BLUE_SHIFT];
            clickedColor.a = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_ALPHA_SHIFT];

            if(clickedColor.r === currentColor.r
                && clickedColor.g === currentColor.g
                && clickedColor.b === currentColor.b
                && clickedColor.a === currentColor.a)
            {
                return;
            }

            pixelStack = [[x, y]];

            floodFill();
        }

        //http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
        function floodFill() {

            drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            var newPixelIndex, x, y, currentPixelIndex, reachLeft, reachRight;
            var drawingBoundLeft = backgroundX - canvas.offsetLeft;
            var drawingBoundTop = backgroundY - canvas.offsetTop;
            var drawingBoundRight = backgroundX + canvas.width - 1;
            var drawingBoundBottom = backgroundY + canvas.height - 1;

            while(pixelStack.length) {
                newPixelIndex = pixelStack.pop();
                x = newPixelIndex[0];
                y = newPixelIndex[1];
                currentPixelIndex = (y*(canvas.width) + x) * IMAGE_DATA_PIXEL_SHIFT;
                // Go up as long as the color matches and are inside the canvas
                while(y-- >= drawingBoundTop && matchClickedColor(currentPixelIndex)) {
                    currentPixelIndex -= (canvas.width) * IMAGE_DATA_PIXEL_SHIFT;
                }
                currentPixelIndex += (canvas.width) * IMAGE_DATA_PIXEL_SHIFT;
                ++y;
                reachLeft = false;
                reachRight = false;

                // Go down as long as the color matches and in inside the canvas
                while(y++ < drawingBoundBottom && matchClickedColor(currentPixelIndex)) {
                    colorPixel(currentPixelIndex);

                    if(x > drawingBoundLeft) {
                        if(matchClickedColor(currentPixelIndex - IMAGE_DATA_PIXEL_SHIFT)){
                            if(!reachLeft) {
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        } else if(reachLeft) {
                            reachLeft = false;
                        }
                    }
                    if(x < drawingBoundRight)
                    {
                        if(matchClickedColor(currentPixelIndex + IMAGE_DATA_PIXEL_SHIFT)){
                            if(!reachRight){
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        } else if(reachRight){
                            reachRight = false;
                        }
                    }
                    currentPixelIndex += canvas.width * IMAGE_DATA_PIXEL_SHIFT;
                }
            }
            //update image data
            if(drawingLayerData){
                context.putImageData(drawingLayerData, 0, 0);
                drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            }
        }

        function matchClickedColor(currentPixelIndex)
        {
            var r = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_RED_SHIFT];
            var g = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_GREEN_SHIFT];
            var b = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_BLUE_SHIFT];
            var a = drawingLayerData.data[currentPixelIndex + IMAGE_DATA_ALPHA_SHIFT];

            // If the current pixel matches the clicked color
            if(r === clickedColor.r
                && g === clickedColor.g
                && b === clickedColor.b
                && a === clickedColor.a) return true;

            // If current pixel matches the new color
            //if(r === 0 && g === 0 && b === 0) return false;

            return false;
        }

        function colorPixel(currentPixelIndex)
        {
            drawingLayerData.data[currentPixelIndex + IMAGE_DATA_RED_SHIFT] = currentColor.r;
            drawingLayerData.data[currentPixelIndex + IMAGE_DATA_GREEN_SHIFT] = currentColor.g;
            drawingLayerData.data[currentPixelIndex + IMAGE_DATA_BLUE_SHIFT] = currentColor.b;
            drawingLayerData.data[currentPixelIndex + IMAGE_DATA_ALPHA_SHIFT] = currentColor.a;
        }

        toolbarClassContainer = 'toolbar'

        $('.' + toolbarClassContainer)
            .on('input change', '.color-value', function () {
                $(this).attr('value', $(this).val());
                var newColor = $(this).val();
                currentColor.r = parseInt(newColor[1] + newColor[2], 16);
                currentColor.g = parseInt(newColor[3] + newColor[4], 16);
                currentColor.b = parseInt(newColor[5] + newColor[6], 16);
                brushStyle = colorToRGBAString(currentColor);
                context.strokeStyle = brushStyle;
            })

            .on('input change', '.thickness-value', function () {
                $(this).attr('value', $(this).val());
                var newThickness = $(this).val();
                context.lineWidth = newThickness;
            })

        thumbnailsClassContainer = 'thumbnails-layers'

        $('.' + thumbnailsClassContainer)
            /*.on('input change', '.alpha-value', function () {
                $(this).attr('value', $(this).val());
                var newAlpha = parseFloat($(this).val());
                //var drawingImageId = parseInt(($(this).attr('id')).split('_')[1]);
                //drawingsImages[drawingImageId].alpha = newAlpha;
                //updateAllLayers(drawingsImages)
                originalImageCtx = redrawBackground(originalImage, newAlpha)
            })*/
            //todo: remove one of the listeners
            .on('input change', '.alpha-value', function () {
                $(this).attr('value', $(this).val());
                var newAlpha = parseFloat($(this).val());
                var idInt = parseInt(($(this).attr('id')).split('_')[1]);
                var layerId = "layer_" + idInt + "_canvas";
                var tmp = mutableCanvasesAndContexts.find(x => x.id === layerId);
                var contextToChange;
                if(typeof tmp === 'undefined') {
                    contextToChange = originalImageCtx
                }
                else {
                    contextToChange = tmp.context;
                }
                //drawingsImages[drawingImageId].alpha = newAlpha;
                //updateAllLayers(drawingsImages)
                //context = redrawLayer(context, newAlpha)
                const image = contextToChange.getImageData(0, 0, canvas.width, canvas.height);
                const {data} = image;
                const {length} = data;

                for (let i = 0; i < length; i += 4) { // red, green, blue, and alpha
                    if(data[i + 3] > 0) {
                        data[i + 3] = newAlpha*255;
                    }
                }
                contextToChange.putImageData(image, 0, 0);
                //drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
                //context.putImageData(drawingLayerData, 0, 0);
                //drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            })

        var saveButton = document.getElementById("save-layer-button");
        saveButton.addEventListener(
            'click', function (event) {
                var layersUrls = [];
                var layersNames = [];
                //console.log(currentSettings)
                for(let i = 0; i < mutableCanvasesAndContexts.length; i++) {
                    var tmp = mutableCanvasesAndContexts[i];

                    var contextToSave = tmp.context;
                    changeImageColor(contextToSave, canvas.width, canvas.height)

                    var canvasToSave = tmp.canvas;
                    var imageDataUrl = canvasToSave.toDataURL("image/png")

                    layersUrls.push(imageDataUrl);

                    if (i >= currentSettings.drawings.length) {
                        //create new layer
                        var imageName = generateRandomImageTitle(prefix, currentSettings.drawings.length + 1);
                        layersNames.push(imageName)
                        //todo: описание и название разные для разных слоев
                        var layerDescription = document.getElementById('layerDesc').value;
                        var layerTitle = document.getElementById('layerTitle').value;

                        var newLayerInfo = {
                            image: imageName,
                            layerParams: {
                                title: layerTitle,
                                //alpha: (currentColor.a) / 255,
                                //color: colorToHEXString(currentColor),
                                alpha: "1",
                                color: "#000000",
                                description: layerDescription
                            }
                        }
                        currentSettings.drawings.push(newLayerInfo);
                    }
                    else {
                        layersNames.push(currentSettings.drawings[i].image)
                    }
                }
                //settingsJSON = JSON.stringify(currentSettings)
                var newData = {
                    layersFilesNames: layersNames,
                    layersUrls: layersUrls,
                    newSettings: currentSettings,
                };
                //console.log(newData)
                $.ajax({
                    type: "POST",
                    url: "/tracingshare/frontend/web/index.php/publication/save-layers?id=" + publicationId,
                    data: {params: JSON.stringify(newData)},
                    success: function (data) {
                        location.href = "http://localhost/tracingshare/frontend/web/index.php/publication/edit?id=" + publicationId
                    },
                    error: function (xhr, status, error) {
                        alert("Произошла ошибка при сохранении данных:" + xhr);
                    }
                });
            }
        )
        function drawExistingLayersThumbnails(drawingsImages) {

            if (Array.isArray(drawingsImages)) {
                var currentLayerElement = '<div id="layers" style="width: 200px">';
                for (let i = 0; i < drawingsImages.length; i++) {
                    if (typeof drawingsImages.alpha != 'undefined') {
                        alphaValue = drawingsImages.alpha;
                        //colorValue = drawingsImages.color;
                    } else {
                        alphaValue = 1;
                    }
                    var divId = "thumbnail_div_" + i;
                    var thumbnailId = "thumbnail_" + i;
                    var alphaId = "alpha_" + i;
                    currentLayerElement += '<div id=\'' + divId + '\' class = "bordered_div" style="border:1px solid black;\n' +
                        '            border-radius: 10px;\n' +
                        '            padding-left: 20px;\n' +
                        '            width: 400px;\n' +
                        '            text-align: left;\n' +
                        '            margin-bottom: 10px">';
                    currentLayerElement += (drawingsImages[i].title) + ':<br>'
                        + '<canvas id=\'' + thumbnailId + '\'></canvas>'
                        + '<br>'
                        + '<label for=\'' + alphaId + '\'>Прозрачность: </label>'
                        + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0.02\' max=\'1\' value=\'' + alphaValue + '\'>'
                    currentLayerElement += '</div>';
                }
                currentLayerElement += '</div>';
                var layersDiv = document.getElementById("otherLayersThumbnails");
                layersDiv.innerHTML = currentLayerElement

                //initDeleteButtons(settings)
                for (let i = 0; i < drawingsImages.length; i++) {
                    var currentImage = drawingsImages[i].image;
                    if (isImageOk(currentImage)) {
                        drawExistingLayerThumbnail("thumbnail_" + i, drawingsImages[i].image, drawingsImages[i].color, originalImageCtx.canvas.width, originalImageCtx.canvas.height);
                    }
                    else {
                        currentImage.onload = function () {
                            drawExistingLayerThumbnail("thumbnail_" + i, drawingsImages[i].image, drawingsImages[i].color, originalImageCtx.canvas.width, originalImageCtx.canvas.height);
                        }
                    }
                }
                //initThumbnailsClickListeners();
                //var descriptionDiv = document.getElementById('description');
                //var layerTitle = document.getElementById('layer_title');
                //+2 because of new layer
                for (let i = 0; i < drawingsImages.length + 1; i++) {
                   document.getElementById('thumbnail_div_' + i)
                       .addEventListener('click', function (event) {
                           //$(this).addClass('active');
                           var canvasId = "layer_" + i + "_canvas";
                           canvas = mutableCanvasesAndContexts.find(x => x.id === canvasId).canvas;
                           context = mutableCanvasesAndContexts.find(x => x.id === canvasId).context;
                           //TODO: change brush style to current color
                           //brushStyle = context.fillStyle;
                           this.style.background = "#d6d5d5";
                           if (previousThumbnail != null && !previousThumbnail.isSameNode(this)) {
                               //$(previousThumbnail).removeClass('active');
                               previousThumbnail.style.background = "#ffffff";
                           }
                           previousThumbnail = this;
                       });
               }
            }
        }
    }
}



