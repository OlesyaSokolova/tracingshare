function prepareLayersToDraw() {

    //init vars and consts
    const pathParts = window.location.pathname.split ('/');
    const baseUrl = "/" + pathParts[1]
        + "/" + pathParts[2]
        + "/" + pathParts[3]
        //+ "/" + pathParts[4]

    var currentDrawings = {
        drawings: Array()
    }

    var maxImageName = prefix + "0.png";

    var canvas;
    var context;
    var currentColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 255
    };

    const eraserStyle = "rgba(255,255,255,255)";
    const eraserGlobalCompositeOperation = "destination-out";

    //init other vars and consts
    var brushGlobalCompositeOperation;
    var previousThumbnail = null;
    var thickness;

    var brushStyle = colorToRGBAString(currentColor);

    var isDrawing = false;
    var isErasing = false;
    var isFilling = false;

    var brushIsClicked = false;
    var eraserIsClicked = false;
    var fillerIsClicked = false;

    var counter = 0;
    var previousTool;

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

    preparedTextures = ''
    if(typeof textures != "undefined"
        && textures !== ''
        && textures !== ""
        && textures.textures.length > 0) {
        preparedTextures = textures.textures
    }

    originalImage = new Image();
    backgroundImage = originalImage;
    backgroundId = "originalImage";
    originalImage.src = originalImageSrc + '?' + new Date().getTime();
    var drawingsImages = [];
    originalImage.onload = function () {
        if (typeof drawings != "undefined"
            && drawings !== ''
            && drawings !== "") {
            currentDrawings = JSON.parse(JSON.stringify(drawings));
            maxImageName = getMaxImageName(currentDrawings);
            drawingsImages = initDrawingsArray(currentDrawings);
        }
        //create context of background
        var backgroundCanvasId = "layer_" + "b" + "_canvas";
        var originalImageCtx = drawBackground(backgroundCanvasId, originalImage);

        //create thumbnail for new layer
        newLayerThumbnail = new Image();

        //create array of contexts and canvases for layers to draw on:
        var mutableCanvasesAndContexts = [];
        var backgroundElement = document.getElementById(backgroundCanvasId);
        const backgroundX = backgroundElement.offsetLeft, backgroundY = backgroundElement.offsetTop;

        createExistingLayersThumbnailsElements(drawingsImages);

        //load images and draw them at canvases and thumbnails
        //todo: check layers order on canvas
        for (let i = drawingsImages.length - 1; i >=0; i--) {
            var currentImage = drawingsImages[i].image;

            var canvasId = "layer_" + i + "_canvas";
            if (isImageOk(currentImage)) {
                var currentCanvasOk = createCanvasToDrawOn(canvasId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                    backgroundX, backgroundY);
                var currentContextOk = currentCanvasOk.getContext('2d');
                drawLayer(drawingsImages[i], currentContextOk);
                drawExistingLayerThumbnail("thumbnail_" + i, drawingsImages[i].image, drawingsImages[i].color, originalImageCtx.canvas.width, originalImageCtx.canvas.height);
                initMutableCanvas(currentCanvasOk)
                var imageNameOk = removeGeneratedValue(removeFullFilepath(drawingsImages[i].image.src))
                mutableCanvasesAndContexts.push({"layer": {"imageName": imageNameOk,
                                                           "alpha": drawingsImages[i].alpha,
                                                           "color": drawingsImages[i].color,
                                                           "title": drawingsImages[i].title,
                                                           "description": drawingsImages[i].description},
                    "canvasId": canvasId, "canvas": currentCanvasOk, "context": currentContextOk });
                addClickListenerToThumbnail(i)

                canvas = currentCanvasOk;
                context = currentContextOk;
                context.lineWidth = thickness
                currentColor.a = context.globalAlpha * 255
                currentColor.r = 0;
                currentColor.g = 0;
                currentColor.b = 0;
                brushStyle = colorToRGBAString(currentColor);
                context.strokeStyle = brushStyle;
                var idOk = parseInt((canvas.id).split('_')[1])
                var currentThumbnailOk = document.getElementById('thumbnail_div_' + idOk)
                currentThumbnailOk.style.background = "#d6d5d5";
                if (previousThumbnail != null && !previousThumbnail.isSameNode(currentThumbnailOk)) {
                    previousThumbnail.style.background = "#ffffff";
                }
                previousThumbnail = currentThumbnailOk;

                //init other vars and consts
                brushGlobalCompositeOperation = context.globalCompositeOperation;
                thickness = context.lineWidth;

            } else {
                currentImage.onload = function () {
                    var currentCanvas = createCanvasToDrawOn("layer_" + i + "_canvas", originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                        backgroundX, backgroundY);
                    var currentContext = currentCanvas.getContext('2d');
                    drawLayer(drawingsImages[i], currentContext);
                    drawExistingLayerThumbnail("thumbnail_" + i, drawingsImages[i].image, drawingsImages[i].color, originalImageCtx.canvas.width, originalImageCtx.canvas.height);
                    initMutableCanvas(currentCanvas)

                    var imageName = removeGeneratedValue(removeFullFilepath(drawingsImages[i].image.src))
                    mutableCanvasesAndContexts.push({"layer": {"imageName": imageName,
                                                                "alpha": drawingsImages[i].alpha,
                                                                "color": drawingsImages[i].color,
                                                                "title": drawingsImages[i].title,
                                                                "description": drawingsImages[i].description},
                        "canvasId": "layer_" + i + "_canvas", "canvas": currentCanvas, "context": currentContext });

                    addClickListenerToThumbnail(i)

                    canvas = currentCanvas;
                    context = currentContext;
                    context.lineWidth = thickness
                    currentColor.a = context.globalAlpha * 255

                    var id = parseInt((canvas.id).split('_')[1])
                    var currentThumbnail = document.getElementById('thumbnail_div_' + id);
                    currentThumbnail.style.background = "#d6d5d5";
                    if (previousThumbnail != null && !previousThumbnail.isSameNode(currentThumbnail)) {
                        previousThumbnail.style.background = "#ffffff";
                    }
                    previousThumbnail = currentThumbnail;

                    //init other vars and consts
                    brushGlobalCompositeOperation = context.globalCompositeOperation;
                    thickness = context.lineWidth;
                }
            }
        }

        //if there is new layer, choose it instead of current
        if(newLayer === 2) {
            const newLayerCanvasId = "layer_" + (drawingsImages.length) + "_canvas";
            var newLayerCanvas = createCanvasToDrawOn(newLayerCanvasId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                backgroundX, backgroundY);
            var newLayerContext = newLayerCanvas.getContext("2d");

            maxImageName = prefix + (getIndexFromImageName(removeFileFormat(maxImageName)) + 1) + ".png";
            mutableCanvasesAndContexts.push({"layer":  {"imageName": maxImageName,
                                                        "alpha": "1",
                                                        "color": "#000000",
                                                        "title": "Новый слой " + (drawingsImages.length + 1),
                                                        "description": ""},
                "canvasId": newLayerCanvasId, "canvas": newLayerCanvas, "context": newLayerContext });

            canvas = mutableCanvasesAndContexts.find(x => x.canvasId === newLayerCanvasId).canvas;
            context = mutableCanvasesAndContexts.find(x => x.canvasId === newLayerCanvasId).context;
            initMutableCanvas(canvas)

            addClickListenerToThumbnail((drawingsImages.length))

            //init other vars and consts
            brushGlobalCompositeOperation = context.globalCompositeOperation;
            var currentThumbnail = document.getElementById('thumbnail_div_' + (drawingsImages.length));
            currentThumbnail.style.background = "#d6d5d5";
            if (previousThumbnail != null && !previousThumbnail.isSameNode(currentThumbnail)) {
                previousThumbnail.style.background = "#ffffff";
            }
            previousThumbnail = currentThumbnail;

            brushGlobalCompositeOperation = context.globalCompositeOperation;
            thickness = context.lineWidth;
        }

        //init tools buttons
        var clearButton = document.getElementById("clear-layer-button");
        clearButton.addEventListener(
            'click', function (event) {
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
                while(y-- >= drawingBoundTop && matchClickedColor(drawingLayerData, currentPixelIndex, clickedColor)) {
                    currentPixelIndex -= (canvas.width) * IMAGE_DATA_PIXEL_SHIFT;
                }
                currentPixelIndex += (canvas.width) * IMAGE_DATA_PIXEL_SHIFT;
                ++y;
                reachLeft = false;
                reachRight = false;

                // Go down as long as the color matches and in inside the canvas
                while(y++ < drawingBoundBottom && matchClickedColor(drawingLayerData, currentPixelIndex, clickedColor)) {
                    colorPixel(drawingLayerData, currentPixelIndex, currentColor);

                    if(x > drawingBoundLeft) {
                        if(matchClickedColor(drawingLayerData, currentPixelIndex - IMAGE_DATA_PIXEL_SHIFT, clickedColor)){
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
                        if(matchClickedColor(drawingLayerData, currentPixelIndex + IMAGE_DATA_PIXEL_SHIFT, clickedColor)){
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
                //context.globalAlpha = (currentColor.a)/255;
                context.putImageData(drawingLayerData, 0, 0);
                drawingLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            }
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
                thickness = newThickness;
                context.lineWidth = thickness;
            })

        thumbnailsClassContainer = 'thumbnails-layers'

        $('.' + thumbnailsClassContainer)

            .on('input change', '.alpha-value', function () {
                $(this).attr('value', $(this).val());
                var newAlpha = parseFloat($(this).val());
                currentColor.a = newAlpha*255;
                var id = ($(this).attr('id')).split('_')[1];
                var layerId = "layer_" + id + "_canvas";
                var tmp = mutableCanvasesAndContexts.find(x => x.canvasId === layerId);
                var contextToChange;
                if(typeof tmp === 'undefined') {
                    if (backgroundId !== 'none')
                    {
                        contextToChange = originalImageCtx
                        contextToChange.globalAlpha = newAlpha;
                        contextToChange.clearRect(0, 0, canvas.width, canvas.height);
                        contextToChange.globalCompositeOperation = "source-in";
                        contextToChange.fillRect(0, 0, canvas.width, canvas.height);
                        contextToChange.globalCompositeOperation = "source-over";
                        contextToChange.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                    }
                }
                else {
                    contextToChange = tmp.context;

                    const image = contextToChange.getImageData(0, 0, canvas.width, canvas.height);
                    const {data} = image;
                    const {length} = data;

                    for (let i = 0; i < length; i += 4) { // red, green, blue, and alpha
                        if(data[i + 3] > 0) {
                            data[i + 3] = newAlpha*255;
                        }
                    }
                    contextToChange.globalAlpha = newAlpha
                    contextToChange.putImageData(image, 0, 0);
                }
            })

        var createLayerButton = document.getElementById("create-layer-button");
        createLayerButton.addEventListener(
            'click', function (event) {
                var layersThumbnailsContainer = document.getElementById("thumbnails-layers");
                    var newId = mutableCanvasesAndContexts.length;
                    var divId = "thumbnail_div_" + newId;
                    var alphaId = "alpha_" + newId;


                    var currentLayerElement = '<div id=\'' + divId + '\' class = "bordered_div" style="border:1px solid black;\n' +
                        '            border-radius: 10px;\n' +
                        '            padding-left: 20px;\n' +
                        '            width: 300px;\n' +
                        '            height: fit-content;\n' +
                        '            text-align: left;\n' +
                        '            margin-bottom: 10px">';

                    currentLayerElement += "Новый слой " + (newId + 1)+ ':<br>'
                        + '<br>'
                        + '<label for=\'' + alphaId + '\'>Прозрачность: </label><br>'
                        + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0.02\' max=\'1\' value=\'' + 1 + '\'>'
                    currentLayerElement += '</div>';
                    currentLayerElement += '</div>';
                    layersThumbnailsContainer.insertAdjacentHTML('afterbegin', currentLayerElement);

                    //create empty canvas
                    var canvasesContainer = document.getElementById("canvases");
                    var createdLayerId = "layer_" + (newId) + "_canvas";
                    var createdCanvas = '<canvas id=\'' + createdLayerId + '\'></canvas>'
                    canvasesContainer.insertAdjacentHTML('beforeend', createdCanvas);

                    //init empty canvas
                    var createdLayerCanvas = createCanvasToDrawOn(createdLayerId, originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                        backgroundX, backgroundY);
                    var createdLayerContext = createdLayerCanvas.getContext("2d");
                    initMutableCanvas(createdLayerCanvas)
                    createdLayerContext.lineWidth = thickness

                    maxImageName = prefix + (getIndexFromImageName(removeFileFormat(maxImageName)) + 1) + ".png";
                    mutableCanvasesAndContexts.push({"layer": { "imageName": maxImageName,
                                                    "alpha": "1",
                                                    "color": "#000000",
                                                    "title": "Новый слой " +  (mutableCanvasesAndContexts.length + 1),
                                                    "description": ""},
                    "canvasId": createdLayerId, "canvas": createdLayerCanvas, "context": createdLayerContext });

                    canvas = createdLayerCanvas;
                    context = createdLayerContext;
                    currentColor.a = context.globalAlpha * 255
                    /*brushStyle = colorToRGBAString({r: 0, g: 0, b: 0, a: 255});
                    context.strokeStyle = brushStyle;*/

                    var id = parseInt((canvas.id).split('_')[1])
                    var currentThumbnail = document.getElementById('thumbnail_div_' + id);
                    currentThumbnail.style.background = "#d6d5d5";
                    if (previousThumbnail != null && !previousThumbnail.isSameNode(currentThumbnail)) {
                        previousThumbnail.style.background = "#ffffff";
                    }
                    previousThumbnail = currentThumbnail;

                    addClickListenerToThumbnail(newId)
               // }
            });

            var deleteLayerButton = document.getElementById("delete-layer-button");
            deleteLayerButton.addEventListener(
                'click', function (event) {
                    var index = parseInt((canvas.id).split('_')[1]);
                    var divId = "thumbnail_div_" + index;
                    var elem = document.getElementById(divId)
                    if (elem) {
                        elem.remove();
                    }

                    //remove canvas from markup
                    var canvasId = "layer_" + index + "_canvas";
                    elem = document.getElementById(canvasId)
                    if (elem) {
                        elem.remove();
                    }

                    //remove canvas and context from mutableCanvasesAndContexts
                    var removeIndex = mutableCanvasesAndContexts.map(x => x.canvasId).indexOf(canvasId);
                    ~removeIndex && mutableCanvasesAndContexts.splice(removeIndex, 1);

                    //remove layer from settings
                    if (typeof currentDrawings.drawings[index] != 'undefined') {
                        currentDrawings.drawings.splice(index, 1)
                    }

                    if (mutableCanvasesAndContexts.length !== 0) {
                        canvas = mutableCanvasesAndContexts[0].canvas;
                        context = mutableCanvasesAndContexts[0].context;
                        initMutableCanvas(canvas)
                        context.lineWidth = thickness
                        currentColor.a = context.globalAlpha * 255

                        var id = parseInt((canvas.id).split('_')[1])
                        document.getElementById('thumbnail_div_' + id).style.background = "#d6d5d5";
                        previousThumbnail = document.getElementById('thumbnail_div_' + id)
                    }
                });

        var saveButton = document.getElementById("save-layer-button");
        saveButton.addEventListener(
            'click', function (event) {
                var updatedLayers = {};

                for(let i = 0; i < mutableCanvasesAndContexts.length; i++) {
                    var tmp = mutableCanvasesAndContexts[i];
                    var contextToSave = tmp.context;
                    var canvasToSave = tmp.canvas;

                    changeImageColor(contextToSave, canvas.width, canvas.height)

                    //error here: new filenames needed!!!
                    updatedLayers[tmp.layer.imageName] = {
                        "title": tmp.layer.title,
                        "alpha": tmp.layer.alpha,
                        "color": tmp.layer.color,
                        //"alpha": "1",
                        //color: "#000000",
                        "description": tmp.layer.description,
                        "data": canvasToSave.toDataURL("image/png")
                    }
                }

                var newData = {
                    layers:  updatedLayers,
                };
                //console.log(JSON.stringify(newData))

                $.ajax({
                    type: "POST",
                    url: baseUrl + "/publication/save-layers?id=" + publicationId,
                    data: { params: JSON.stringify(newData) },

                    success: function (data) {
                        //alert(data)
                        location.href = window.location.origin + baseUrl + "/publication/edit-drawings?id=" + publicationId
                    },
                    error: function (xhr, status, error) {
                        alert("Произошла ошибка при сохранении данных: " + status + " " + error);
                    }
                });
            }
        )

        function createExistingLayersThumbnailsElements(drawingsImages) {

            if (Array.isArray(drawingsImages)) {
                var currentLayerElement = '<div id="layers"">';
                for (let i = drawingsImages.length - 1; i >=0  ; i--) {
                    if (typeof drawingsImages[i].alpha != 'undefined') {
                        alphaValue = drawingsImages[i].alpha;
                    } else {
                        alphaValue = 1;
                    }
                    var divId = "thumbnail_div_" + i;
                    var thumbnailId = "thumbnail_" + i;
                    var alphaId = "alpha_" + i;
                    currentLayerElement += '<div id=\'' + divId + '\' class = "bordered_div" style="border:1px solid black;\n' +
                        '            border-radius: 10px;\n' +
                        '            padding-left: 20px;\n' +
                        '            height: fit-content;\n' +
                        '            text-align: left;\n' +
                        '            margin-bottom: 10px">';
                    currentLayerElement += (drawingsImages[i].title) + ':<br>'
                        + '<canvas id=\'' + thumbnailId + '\'></canvas>'
                        + '<br>'
                        + '<label for=\'' + alphaId + '\'>Прозрачность: </label><br>'
                        + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0.02\' max=\'1\' value=\'' + alphaValue + '\'>'
                    currentLayerElement += '</div>';
                }
                currentLayerElement += '</div>';
                var layersDiv = document.getElementById("otherLayersThumbnails");
                layersDiv.innerHTML = currentLayerElement
            }
        }

        function addClickListenerToThumbnail(index) {
            document.getElementById('thumbnail_div_' + index)
                .addEventListener('click', function (event) {
                    var canvasId = "layer_" + index + "_canvas";
                    canvas = mutableCanvasesAndContexts.find(x => x.canvasId === canvasId).canvas;
                    context = mutableCanvasesAndContexts.find(x => x.canvasId === canvasId).context;
                    initMutableCanvas(canvas)
                    context.lineWidth = thickness
                    currentColor.a = context.globalAlpha * 255

                    this.style.background = "#d6d5d5";
                    if (previousThumbnail != null && !previousThumbnail.isSameNode(this)) {
                        previousThumbnail.style.background = "#ffffff";
                    }
                    previousThumbnail = this;
                });
        }

        addDropdownMenuForTextures();

        function addDropdownMenuForTextures() {
            var texturesSelectElement = document.getElementById("selectTextures");
            if(typeof textures != "undefined"
                && textures !== ''
                && textures !== ""
                && textures.textures.length > 0) {
                preparedTextures = textures.textures
                if (Array.isArray(preparedTextures)) {

                    var options = '';
                    for (let i = 0; i < preparedTextures.length; i++) {
                        var currentId = "texture_" + i;
                        options += '<option id=\'' + currentId + '\'>'
                            + preparedTextures[i].layerParams.title
                            + '</option>'
                    }
                    texturesSelectElement.insertAdjacentHTML('beforeend', options);
                }
            }
            texturesSelectElement.onchange = function () {
                backgroundId = texturesSelectElement.options[texturesSelectElement.selectedIndex].id;
                if(backgroundId === "originalImage") {
                    originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
                    originalImageCtx.drawImage(originalImage, 0, 0, canvas.width,  canvas.height);
                }
                else if (backgroundId === "none") {
                    originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
                }
                else {
                    var index = parseInt((backgroundId).split('_')[1])
                    var textureSrc = texturePathPrefix + preparedTextures[index].image;
                    textureImage = new Image();
                    textureImage.src = textureSrc + '?' + new Date().getTime();

                    if (isImageOk(textureImage)) {
                        backgroundImage = textureImage;
                        originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
                        originalImageCtx.drawImage(backgroundImage, 0, 0, canvas.width,  canvas.height);
                    }
                    else {
                        textureImage.onload = function () {
                            backgroundImage = textureImage;
                            originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
                            originalImageCtx.drawImage(backgroundImage, 0, 0, canvas.width,  canvas.height);
                        }
                    }
                }
            }
        }

        function initMutableCanvas(currentCanvasOk) {
            currentCanvasOk.onmousedown = startEditing;
            currentCanvasOk.onmouseup = stopEditing;
            currentCanvasOk.onmouseout = stopEditing;
            currentCanvasOk.onmousemove = edit;
        }
    }
}



