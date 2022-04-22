function prepareLayersToDraw() {

    var currentSettings = {
        drawings: Array()
    }
    if (typeof settings != "undefined"
        && settings !== ''
        && settings !== "") {

        currentSettings = JSON.parse(JSON.stringify(settings));
    }

//1. Preparations
    //1.1. set original image as background and create thumbnails
        originalImage = new Image();
        originalImage.src = originalImageSrc;
        originalImage.onload = function () {
        var originalImageCtx = drawBackground(originalImage);
        console.log(originalImageCtx.canvas.width);

        drawOriginalImageLayerThumbnail(originalImage)

        newLayerThumbnail = new Image();
        drawNewLayerThumbnail(originalImage.width, originalImage.height)

        //1.2. create canvas for new layer (to draw)
        var backgroundElement = document.getElementById("background");
        const backgroundX = backgroundElement.offsetLeft, backgroundY = backgroundElement.offsetTop;
        var canvas = createCanvasToDrawOn(originalImageCtx.canvas.width, originalImageCtx.canvas.height,
                                          backgroundX, backgroundY);

        //1.3. set event listeners
        canvas.onmousedown = startEditing;
        canvas.onmouseup = stopEditing;
        canvas.onmouseout = stopEditing;
        canvas.onmousemove = edit;

        //1.4. init vars and consts
        var context = canvas.getContext("2d");
        var pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);

        const eraserStyle = "rgba(255,255,255,1)";
        const eraserGlobalCompositeOperation = "destination-out";

        const brushGlobalCompositeOperation = context.globalCompositeOperation;
        var brushStyle = "rgba(0,0,0,1)"

        var isDrawing = false;
        var isErasing = false;
        var isFilling = false;

        var brushIsClicked = false;
        var eraserIsClicked = false;
        var fillerIsClicked = false;

        var counter = 0;
        var previousTool;

        const curColor = {
                r: 0,
                g: 0,
                b: 0,
                a: 255
            };


            //var outlineLayerData;
            var colorLayerData;
            var pixelStack = [];
            var newColorR;
            var newColorG;
            var newColorB;
            var newColorA;
            var clickedColorR;
            var clickedColorG;
            var clickedColorB;
            var clickedColorA;
            var pixelsDrawn;

            colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
        //var breakCycle = false;
            //var tmp = 20000000;
            var counterPixels = 0;

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
                colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
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
            else if (isFilling === true && counter === 2) {
                //do nothing
            }
        }

        function stopEditing() {
            isDrawing = false;
            isErasing = false;
            isFilling = false;
        }
//http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
        function fillArea(x, y) {
            var pixelPos = (y*(canvas.width) + x)*4;
            //console.log("outline: " + outlineLayerData.data[pixelPos] +","+ outlineLayerData.data[pixelPos+1] +","+ outlineLayerData.data[pixelPos+2] +","+ outlineLayerData.data[pixelPos+3]);
            var r = colorLayerData.data[pixelPos + 0];
            var g = colorLayerData.data[pixelPos + 1];
            var b = colorLayerData.data[pixelPos + 2];
            var a = colorLayerData.data[pixelPos + 3];
            console.log("clicked color:   " + r +","+ g +","+ b +","+ a);

            clickedColorR = r;
            clickedColorG = g;
            clickedColorB = b;
            clickedColorA = a;

            //console.log("new color:   " + newColorR +","+ newColorG +","+ newColorB);

            /*if(clickedColorR == newColorR && clickedColorG == newColorG && clickedColorB == newColorB)
            {
                //console.log("Return because trying to fill with the same color");
                return;
            }

            if(outlineLayerData.data[pixelPos] + outlineLayerData.data[pixelPos+1] + outlineLayerData.data[pixelPos+2] == 0 && outlineLayerData.data[pixelPos+ 3] == 255)
            {
                //console.log("Return because clicked outline: " + outlineLayerData.data[pixelPos+4]);
                return;
            }*/

            //console.log("PUSH: " + (startX - drawingAreaX - 2) + "," + (startY - drawingAreaY - 2));
            pixelStack = [[x, y]];

            floodFill();
        }

            function floodFill()
            {
                colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
                var newPos, x, y, pixelPos, reachLeft, reachRight;
                var drawingBoundLeft = backgroundX;
                var drawingBoundTop = backgroundY;
                var drawingBoundRight = backgroundX + canvas.width - 1;
                var drawingBoundBottom = backgroundY + canvas.height - 1;

                while(pixelStack.length)
                {
                    newPos = pixelStack.pop();
                    x = newPos[0];
                    y = newPos[1];

                    //console.log("POP: " + (x - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));

                    pixelPos = (y*(canvas.width) + x) * 4;
                    // Go up as long as the color matches and are inside the canvas
                    while(y-- >= drawingBoundTop && matchClickedColor(pixelPos))
                    {
                        console.log("UP: " + x + "," + y);
                        pixelPos -= (canvas.width) * 4;
                    }
                    pixelPos += (canvas.width) * 4;
                    ++y;
                    reachLeft = false;
                    reachRight = false;
                    // Go down as long as the color matches and in inside the canvas
                    while(y++ < drawingBoundBottom && matchClickedColor(pixelPos))
                    {
                        colorPixel(pixelPos);
                        //console.log("COLOR: " + (x - drawingAreaX - 2) + "," + (y - drawingAreaY - 2));

                        if(x > drawingBoundLeft)
                        {
                            if(matchClickedColor(pixelPos - 4)){
                                if(!reachLeft){
                                    pixelStack.push([x - 1, y]);
                                    console.log("PUSH: " + (x-1) + " " +  y)
                                    reachLeft = true;
                                }
                            }else if(reachLeft){
                                reachLeft = false;
                            }
                        }
                        if(x < drawingBoundRight)
                        {
                            if(matchClickedColor(pixelPos + 4)){
                                if(!reachRight){
                                    pixelStack.push([x + 1, y]);
                                    console.log("PUSH: " + (x+1) + " " + y);
                                    reachRight = true;
                                }
                            }else if(reachRight){
                                reachRight = false;
                            }
                        }
                        pixelPos += canvas.width * 4;
                    }
                }
                if(colorLayerData){
                    context.putImageData(colorLayerData, 0, 0);
                    colorLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
                }
            }

            function matchClickedColor(pixelPos)
            {
                var r = colorLayerData.data[pixelPos];
                var g = colorLayerData.data[pixelPos+1];
                var b = colorLayerData.data[pixelPos+2];
                var a = colorLayerData.data[pixelPos+3];

                // If current pixel is black then it is an outline
                if(r + g + b === 0 && a === 255){ return false; }

                r = colorLayerData.data[pixelPos];
                g = colorLayerData.data[pixelPos+1];
                b = colorLayerData.data[pixelPos+2];
                a = colorLayerData.data[pixelPos+3];

                // If the current pixel matches the clicked color
                if(r === clickedColorR && g === clickedColorG && b === clickedColorB && a === clickedColorA) return true;

                // If current pixel matches the new color
                if(r === 0 && g === 0 && b === 0) return false;

                return false;
            }

            function colorPixel(pixelPos)
            {
                console.log("color pixel")
                colorLayerData.data[pixelPos] = 0;
                colorLayerData.data[pixelPos+1] = 0;
                colorLayerData.data[pixelPos+2] = 0;
                colorLayerData.data[pixelPos+3] = 255;
            }


            toolbarClassContainer = 'toolbar'

        $('.' + toolbarClassContainer)
            .on('input change', '.color-value', function () {
                $(this).attr('value', $(this).val());
                var newColor = $(this).val();
                var red = parseInt(newColor[1] + newColor[2], 16);
                var green = parseInt(newColor[3] + newColor[4], 16);
                var blue = parseInt(newColor[5] + newColor[6], 16);
                brushStyle = "rgba(" + red + "," + green + "," + blue + ",1)";
                context.strokeStyle = brushStyle;
            })

            .on('input change', '.thickness-value', function () {
                $(this).attr('value', $(this).val());
                var newThickness = $(this).val();
                context.lineWidth = newThickness;
            })

        thumbnailsClassContainer = 'thumbnails-layers'

        $('.' + thumbnailsClassContainer)
            .on('input change', '.orgnl-img-alpha-value', function () {
                $(this).attr('value', $(this).val());
                var newAlpha = parseFloat($(this).val());
                //var drawingImageId = parseInt(($(this).attr('id')).split('_')[1]);
                //drawingsImages[drawingImageId].alpha = newAlpha;
                //updateAllLayers(drawingsImages)
                redrawBackground(newAlpha)
            })

        function redrawBackground(newAlpha) {
            var canvas = document.getElementById('background')
            var ratio = originalImage.width/originalImage.height
            var constWidth = 1000
            var correspondingHeight = constWidth/ratio
            canvas.width = constWidth
            canvas.height = correspondingHeight

            originalImageCtx = canvas.getContext('2d');
            originalImageCtx.globalAlpha = newAlpha;
            //4. fill the context with color of current image
            originalImageCtx.clearRect(0, 0, canvas.width, canvas.height);
            originalImageCtx.globalCompositeOperation = "source-in";
            originalImageCtx.fillRect(0, 0, canvas.width, canvas.height);
            originalImageCtx.globalCompositeOperation = "source-over";
            originalImageCtx.drawImage(originalImage, 0, 0, canvas.width, canvas.height)

            //5. render virtual canvase with image on contextToDrawOn
           // contextToDrawOn.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

            //return originalImageCtx
        }

        var saveButton = document.getElementById("save-layer-button");
        saveButton.addEventListener(
            'click', function (event) {
                changeImageColor(context, canvas.width, canvas.height)
                var imageDataUrl = canvas.toDataURL("image/png")
                var imageName = generateRandomImageTitle(prefix, currentSettings.drawings.length+1);
                layerDescription = document.getElementById('layerDesc').value;
                layerTitle = document.getElementById('layerTitle').value;

                var newLayerInfo = {
                    image: imageName,
                    layerParams: {
                        title: layerTitle,
                        alpha: "1",
                        color: "#000000",
                        description: layerDescription
                    }
                }
                currentSettings.drawings.push(newLayerInfo);
                //settingsJSON = JSON.stringify(currentSettings)
                var newData = {
                    newImageName: imageName,
                    newImageUrl: imageDataUrl,
                    newSettings: currentSettings,
                };
                $.ajax({
                    type: "POST",
                    url: "/tracingshare/frontend/web/index.php/publication/save-layer?id=" + publicationId,
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
    }
}



