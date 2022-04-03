function prepareLayersToDraw() {

    //1. Preparations
        //1.1. set original image as background
        originalImage = new Image();
        originalImage.src = originalImageSrc;
        drawBackground(originalImage);

        //1.2. create canvas for new layer (to draw)
        newLayer = new Image();

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

        classNameContainer = 'layers-class'

        /*$('.' + classNameContainer)//прозрачность слоев
            .on('input change', '.alpha-value', function () {
                $(this).attr('value', $(this).val());
                var newAlpha = parseFloat($(this).val());
                var layerId = parseInt(($(this).attr('id')).split('_')[1]);
                layers[layerId].alpha = newAlpha;//change alpha value of original image
                updateAllLayers(layers)
            })
*/
       /* var resetButton = document.getElementById("reset-button");
        resetButton.addEventListener('click', function (event) {
            reloadSettingsForEdit(defaultSettings, drawingsImages)
        })*/

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

    var canvas = document.getElementById('layerCanvas')
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
