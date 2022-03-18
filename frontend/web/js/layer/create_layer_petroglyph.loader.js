function prepareLayersToDraw() {

        originalImage = new Image();
        originalImage.src = originalImageSrc;

        newLayer = new Image();
        var originalImageLayerCtx = drawOriginalImageLayer(originalImage)

        originalImage.onload = function () {
            originalImageLayerThumbnail = new Image();
            originalImage.src = originalImageSrc;

            newLayerThumbnail = new Image();
            var originalImageLayerCtx = drawOriginalImageLayerThumbnail(originalImage)
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
        }

    var saveButton = document.getElementById("save-button");
    saveButton.addEventListener(
        'click', function (event) {
        if(typeof settings != 'undefined' && settings !== '' && settings !== "") {
            for (let i = 0; i < settings.drawings.length; i++) {
                settings.drawings[i].layerParams.title = document.getElementById("title_" + i).value;
                settings.drawings[i].layerParams.alpha = document.getElementById('alpha_' + i).value;
                settings.drawings[i].layerParams.color = document.getElementById('color_' + i).value;
                settings.drawings[i].layerParams.description = document.getElementById('desc_' + i).value;
            }
        }
        else
        {
            settings = ''
        }
        layerDescription = document.getElementById('layerDesc').value;
        name = document.getElementById('name').value;
        console.log(petroglyphId)
        var newData = {
            id: parseInt(petroglyphId),
            newName: name,
            newDescription: layerDescription,
            newSettings: settings,
        };
        $.ajax({
            type: "POST",
            url: "/tracingshare/frontend/web/index.php/petroglyph/save-layer",
            data: {params: JSON.stringify(newData)},
            success: function (data) {
                //alert(data)
                location.href = "http://localhost/tracingshare/frontend/web/index.php/petroglyph/view?id=" + petroglyphId
            },
            error: function (xhr, status, error) {
                alert("Произошла ошибка при сохранении данных:" + xhr);
            }
        });
    })
}

function reloadSettingsForEdit(defaultSettings, drawingsImages) {
    initLayersSettingsForEdit(defaultSettings)
    updateAllLayers(initDrawingsArray(defaultSettings))
}

function initLayersSettingsForEdit(jsonSettings) {
    var drawings = jsonSettings.drawings
    if (Array.isArray(drawings)) {

        var layerInfo = '<form>';
        for (let i = 0; i < drawings.length; i++) {
            if (typeof drawings[i].layerParams.alpha != 'undefined') {
                alphaValue = drawings[i].layerParams.alpha;
                colorValue = drawings[i].layerParams.color;
            } else {
                alphaValue = 1;
            }
            var layerId = "layer_" + i;
            layerInfo += '<div className="form-group" id=\'' + layerId + '\' style="border:1px solid black;\n' +
                '                border-radius: 10px;\n' +
                '                padding-left: 20px;\n' +
                '                width: 700px;\n' +
                '                text-align: left;\n' +
                '                margin-bottom: 10px">';

            var titleId = "title_" + i;
            var alphaId = "alpha_" + i;
            var colorId = "color_" + i;
            var descId = "desc_" + i;

            layerInfo += '<label for=\'' + titleId + '\'>Название: </label>'
                + '<input type="text" id=\'' + titleId + '\' class="form-control" value=\'' + (drawings[i].layerParams.title) + '\'/>'
                + '<br>'

                + '<label for=\'' + alphaId + '\'>Прозрачность: </label>'
                + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=\'' + alphaValue + '\' oninput=\"this.nextElementSibling.value = this.value\">'
                + '<br>'

                + '<label for=\'' + colorId + '\'>Цвет: </label>'
                + '<input type="color" id=\'' + colorId + '\' class =\'color-value\' value=\'' + colorValue + '\' name="drawingColor"></button>' + '<br>'

                + '<label for=\'' + descId + '\'>Описание: </label>'
                + '<textarea id=\'' + descId + '\' style="width: 500px" class="form-control">'
                + drawings[i].layerParams.description
                +'</textarea>'
                + '<br>'

            layerInfo += '</div>';
        }

        layerInfo += '</form>';
        var layersDiv = document.getElementById("layers");
        layersDiv.insertAdjacentHTML('beforeend', layerInfo)
    }
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
    //originalImageCtx.drawImage(originalImage, 0, 0,canvas.width,  canvas.height);

    return originalImageCtx
}
