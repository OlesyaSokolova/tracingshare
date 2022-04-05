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

        canvas.onmousedown = startDrawing;
        canvas.onmouseup = stopDrawing;
        canvas.onmouseout = stopDrawing;
        canvas.onmousemove = draw;

        var context = canvas.getContext("2d");

        //1.3. drawing
        var isDrawing = true;

        function startDrawing(e) {
        // Начинаем рисовать
        isDrawing = true;

        // Создаем новый путь (с текущим цветом и толщиной линии)
        context.beginPath();

        // Нажатием левой кнопки мыши помещаем "кисть" на холст
        context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }

    function draw(e) {
        if (isDrawing === true)
        {
            // Определяем текущие координаты указателя мыши
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            // Рисуем линию до новой координаты
            context.lineTo(x, y);
            context.stroke();
        }
    }


    function stopDrawing() {
        isDrawing = false;
    }

        //var colorButton = document.getElementById("change-thickness-btn")
    classNameContainer = 'toolbar'

    $('.' + classNameContainer)
        .on('input change', '.change-color-btn', function () {
            $(this).attr('value', $(this).val());
            var newColor = $(this).val();
            context.strokeStyle = color;
        });

        //1.3. create thumbnails of all existing layers
        //1.3.1. init settings: if they are not set,
        // create settings as associative array for new layer (see below)
        layersSettings = ""
        if(typeof settings != "undefined" && settings !== ''  && settings !== "") {
            layersSettings = JSON.parse(JSON.stringify(settings));
            drawOtherLayersThumbnails(settings)
        }
        //if user creates new layer from editor, settings should be updated

        //1.4. create thumbnail for original image
        var originalImageThumbnailLayerCtx = drawOriginalImageLayerThumbnail(originalImage)

        //1.5. create thumbnail for new layer:
         newLayerThumbnail = new Image();
        var newLayerCtx = drawNewLayerThumbnail()



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

function drawOtherLayersThumbnails(settings) {

    var divWithLayers = document.getElementById('otherLayersThumbnails')
    //create new canvases for each layer
    /*var canvas =
    var ratio = originalImage.width/originalImage.height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx*/
}

function drawNewLayerThumbnail() {

    var canvas = document.getElementById('newLayerThumbnail')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 200
    var correspondingHeight = constWidth/ratio
    canvas.width = constWidth
    canvas.height = correspondingHeight

    originalImageCtx = canvas.getContext('2d');
    originalImageCtx.drawImage(new Image(), 0, 0,canvas.width,  canvas.height);

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
