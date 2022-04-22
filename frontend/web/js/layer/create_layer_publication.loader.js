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
                b: 0
            };
        var breakCycle = false;
            var tmp = 10000;
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
            pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);
            var currentPixelIndex = (y * canvas.width + x) * 4;
            const startR = pixelsData.data[currentPixelIndex];
            const startG = pixelsData.data[currentPixelIndex + 1];
            const startB = pixelsData.data[currentPixelIndex + 2];
            const startA = pixelsData.data[currentPixelIndex + 3];//TODO:define alpha as current drawing setting

            floodFill(x, y, startR, startG, startB, startA);
        }

        function floodFill(startX, startY, startR, startG, startB, startA) {
            pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);
            var newPos,
                x,
                y,
                pixelPos,
                reachLeft,
                reachRight,
                drawingBoundLeft = backgroundX,
                drawingBoundTop = backgroundY,
                drawingBoundRight = backgroundX + canvas.width - 1,
                drawingBoundBottom = backgroundY + canvas.height - 1,
                pixelStack = [[startX, startY]];

            while (pixelStack.length && breakCycle === false) {

                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];

                // Get current pixel position
                pixelPos = (y * canvas.width + x) * 4;

                // Go up as long as the color matches and are inside the canvas
                while (y >= drawingBoundTop && breakCycle === false && matchStartColor(pixelPos, startR, startG, startB)) {
                    y -= 1;
                    pixelPos -= canvas.width * 4;
                }

                pixelPos += canvas.width * 4;
                y += 1;
                reachLeft = false;
                reachRight = false;

                // Go down as long as the color matches and in inside the canvas
                while (y <= drawingBoundBottom && breakCycle === false && matchStartColor(pixelPos, startR, startG, startB)) {
                    y += 1;

                    colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

                    if (x > drawingBoundLeft) {
                        if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                            if (!reachLeft) {
                                // Add pixel to stack
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        } else if (reachLeft) {
                            reachLeft = false;
                        }
                    }

                    if (x < drawingBoundRight) {
                        if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                            if (!reachRight) {
                                // Add pixel to stack
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        } else if (reachRight) {
                            reachRight = false;
                        }
                    }
                    pixelPos += canvas.width * 4;
                }
            }
        }

        colorPixel = function (pixelPos, r, g, b, a) {
            counterPixels++;
            if(counterPixels === tmp)
            {
                breakCycle = true;
            }
            console.log("fillPixel "  + pixelPos)
           /* pixelsData = context.getImageData(0, 0, canvas.width, canvas.height);
            pixelsData.data[pixelPos] = 255;
            pixelsData.data[pixelPos + 1] = 255;
            pixelsData.data[pixelPos + 2] = 0;
            //pixelsData.data[pixelPos + 3] = 255;
            context.putImageData(pixelsData, 0, 0 );*/
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            const {data} = image;

            // red, green, blue, and alpha
                data[pixelPos] = 0;//r
                data[pixelPos + 1] = 0;//g
                data[pixelPos + 2] = 0;//b
            context.putImageData(image, 0, 0);
        }
      /*  matchOutlineColor = function (r, g, b, a) {

            return (r + g + b < 100 && a === 255);
        }*/

        function matchStartColor(pixelPos, startR, startG, startB) {
            var r = pixelsData.data[pixelPos],
                g = pixelsData.data[pixelPos + 1],
                b = pixelsData.data[pixelPos + 2],
                a = pixelsData.data[pixelPos + 3];

            // If current pixel of the outline image is black
           /* if (matchOutlineColor(r, g, b, a)) {
                return false;
            }*/

            r = pixelsData.data[pixelPos];
            g = pixelsData.data[pixelPos + 1];
            b = pixelsData.data[pixelPos + 2];
            a = pixelsData.data[pixelPos + 3];

            // If the current pixel matches the clicked color
            if (r === startR && g === startG && b === startB) {
                return true;
            }
           /* if(a === 0) {
                return true;
            }*/

            // If current pixel matches the new color
            if (r === curColor.r && g === curColor.g && b === curColor.b) {
                return false;
            }

            return true;
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



