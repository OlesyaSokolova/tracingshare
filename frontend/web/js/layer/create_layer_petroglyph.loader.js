function prepareLayersToDraw() {

        originalImage = new Image();
        originalImage.src = originalImageSrc;

        newLayer = new Image();
        var originalImageLayerCtx = drawOriginalImageLayer(originalImage)

            originalImageLayerThumbnail = new Image();
            originalImage.src = originalImageSrc;

            newLayerThumbnail = new Image();
            var originalImageThumbnailLayerCtx = drawOriginalImageLayerThumbnail(originalImage)
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
            settings = "{" +
                "\"drawings\": [" +
                "   {" +
/*
                "    image: \"new_layer.png\",\n" +
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

        console.log(petroglyphId)
        $.ajax({
            type: "POST",
            url: "/tracingshare/frontend/web/index.php/petroglyph/save-layer",
            data: newSettings,
            success: function (data) {
                alert(data)
                location.href = "http://localhost/tracingshare/frontend/web/index.php/petroglyph/view?id=" + petroglyphId
            },
            error: function (xhr, status, error) {
                alert("Произошла ошибка при сохранении данных:" + xhr);
            }
        });
    })
}

function drawOriginalImageLayer(originalImage) {

    var canvas = document.getElementById('layerCanvas')
    var ratio = originalImage.width/originalImage.height
    var constWidth = 700
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
