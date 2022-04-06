function prepareLayersToDraw() {

//1. Preparations
    //1.1. set original image as background
    originalImage = new Image();
    originalImage.src = originalImageSrc;
    var originalImageCtx = drawBackground(originalImage);

    //1.2. create canvas for new layer (to draw)
    var backgroundElement = document.getElementById("background");
    var x = backgroundElement.offsetLeft, y = backgroundElement.offsetTop;
    var canvas = createCanvasToDrawOn(originalImageCtx.canvas.width, originalImageCtx.canvas.height, x, y)


    //1.3. set event listeners
    canvas.onmousedown = startEditing;
    canvas.onmouseup = stopEditing;
    canvas.onmouseout = stopEditing;
    canvas.onmousemove = edit;

    //1.4. init vars and consts
    var context = canvas.getContext("2d");

    const eraserStyle = "rgba(255,255,255,1)";
    const eraserGlobalCompositeOperation = "destination-out";

    const brushGlobalCompositeOperation = context.globalCompositeOperation;
    var brushStyle = "rgba(0,0,0,1)"

    var isDrawing = false;
    var isErasing = false;

    var brushIsClicked = false;
    var eraserIsClicked = false;

    var counter = 0;
    var previousTool;

    //1.5. init buttons
    var brushButton = document.getElementById("brush-btn");
    brushButton.addEventListener(
    'click', function (event) {
        isDrawing = true;
        counter = 1;
            $(this).addClass('active');
            if (previousTool != null && !previousTool.isSameNode(this)) {
                $(previousTool).removeClass('active');
            }
            previousTool = this;
            brushIsClicked = true;
            eraserIsClicked = false;
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
            });

       /* var fillButton = document.getElementById("fill-btn");
        fillButton.addEventListener(
            'click', function (event) {
                counter = 1;
                $(this).addClass('active');
                if (previousTool != null && !previousTool.isSameNode(this)) {
                    $(previousTool).removeClass('active');
                }
                previousTool = this;
                brushIsClicked = false;
                eraserIsClicked = false;
            });*/

    function startEditing(e) {
        if(counter === 1) {
            isDrawing = false;
            counter = 2;
        }

        if(counter === 2 && brushIsClicked) {
            isDrawing = true;
            isErasing = false;
            context.beginPath();
            context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        }

        if(counter === 2 && eraserIsClicked) {
            isErasing = true;
            isDrawing = false;
            context.beginPath();
            context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        }
    }

    function edit(e) {

        var x, y;
        if (isDrawing === true && counter === 2)
        {
            context.globalCompositeOperation = brushGlobalCompositeOperation;
            context.strokeStyle = brushStyle;

            x = e.pageX - canvas.offsetLeft;
             y = e.pageY - canvas.offsetTop;

            context.lineTo(x, y);
            context.stroke();
        }

        else if(isErasing === true && counter === 2) {
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
    }

    classNameContainer = 'toolbar'

    $('.' + classNameContainer)
        .on('input change', '.color-value', function () {
            $(this).attr('value', $(this).val());
            var newColor = $(this).val();
            var red = parseInt(newColor[1]+newColor[2],16);
            var green = parseInt(newColor[3]+newColor[4],16);
            var blue = parseInt(newColor[5]+newColor[6],16);
            brushStyle = "rgba(" + red + ","+ green + "," + blue + ",1)";
            context.strokeStyle = brushStyle;
        })

        .on('input change', '.thickness-value', function () {
            $(this).attr('value', $(this).val());
            var newThickness = $(this).val();
            context.lineWidth = newThickness;
        })

        /*.on('input change', '.alpha-value', function () {
            $(this).attr('value', $(this).val());
            var newAlpha = $(this).val();
            context.strokeStyle = 'rgba(255, 0, 0, 0.1)';
        })*/

        //1.3. create thumbnails of all existing layers
        //1.3.1. init settings: if they are not set,
        // create settings as associative array for new layer (see below)
        /*layersSettings = ""
        if(typeof settings != "undefined" && settings !== ''  && settings !== "") {
            layersSettings = JSON.parse(JSON.stringify(settings));
            drawOtherLayersThumbnails(settings)
        }*/
        //if user creates new layer from editor, settings should be updated

    //1.4. create thumbnail for original image
    drawOriginalImageLayerThumbnail(originalImage)

    //1.5. create thumbnail for new layer:
     newLayerThumbnail = new Image();
     drawNewLayerThumbnail(originalImage.width, originalImage.height)


    var saveButton = document.getElementById("save-layer-button");
    saveButton.addEventListener(
        'click', function (event) {
            var image = contextToDrawOn.getDataUrl()
            settings = "{" +
                "\"drawings\": [" +
                "   {" +
/*
                "    image: \" + image+ \",\n" +
*/
                "    layerParams: {" +
                "                   alpha: \"1\"," +
                "                   color: \"#ffffff\"" +
                "                }" +
                "    }]" +
                "}"
            settingJSON = JSON.parse(JSON.stringify(settings))
            settingJSON.drawings[0].layerParams.title = document.getElementById("title").value;
            /*settings.drawings[0].layerParams.alpha = document.getElementById('alpha_' + i).value;
            settings.drawings[0].layerParams.color = document.getElementById('color_' + i).value;*/
            settingJSON.drawings[0].layerParams.description = document.getElementById('layerDesc').value;

        //console.log(publicationId)
        $.ajax({
            type: "POST",
            url: "/tracingshare/frontend/web/index.php/publication/save-layer",
            data: newSettings,
            success: function (data) {
                alert(data)
                location.href = "http://localhost/tracingshare/frontend/web/index.php/publication/view?id=" + publicationId
            },
            error: function (xhr, status, error) {
                alert("Произошла ошибка при сохранении данных:" + xhr);
            }
        });
    })
}

