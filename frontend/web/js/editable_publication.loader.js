function prepareEditablePublication() {
    if(typeof settings != "undefined" && settings !== ''  && settings !== "") {

        defaultSettings = JSON.parse(JSON.stringify(settings));

        originalImage = new Image();
        originalImage.src = originalImageSrc;

        originalImage.onload = function () {
            var originalImageCtx = drawOriginalImage(originalImage)
            var drawingsImages = initDrawingsArray(jsonSettings = settings)
            addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = originalImageCtx)
            initLayersSettingsForEdit(jsonSettings = settings)

            classNameContainer = 'layers-class'

            $('.' + classNameContainer)
                .on('input change', '.alpha-value', function () {
                    $(this).attr('value', $(this).val());
                    var newAlpha = parseFloat($(this).val());
                    var drawingImageId = parseInt(($(this).attr('id')).split('_')[1]);
                    drawingsImages[drawingImageId].alpha = newAlpha;
                    updateAllLayers(drawingsImages)
                })

                .on('input change', '.color-value', function () {
                    $(this).attr('value', $(this).val());
                    var newColor = $(this).val();
                    var drawingImageId = parseInt(($(this).attr('id')).split('_')[1]);
                    drawingsImages[drawingImageId].color = newColor;
                    updateAllLayers(drawingsImages)
                })

            var resetButton = document.getElementById("reset-button");
            resetButton.addEventListener('click', function (event) {
                reloadSettingsForEdit(defaultSettings)
            })
        }
    }

    else {
        originalImage = new Image();
        originalImage.src = originalImageSrc;

        originalImage.onload = function () {
            drawOriginalImage(originalImage)
        }
    }

    var saveButton = document.getElementById("save-button");
    saveButton.addEventListener('click', function (event) {
        var redirectToView = true
        saveData(settings, redirectToView)
    });

    function saveData(settings, redirectToView) {
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
        mainDescription = document.getElementById('mainDesc').value;
        name = document.getElementById('name').value;
        var newData = {
            id: parseInt(publicationId),
            newName: name,
            newDescription: mainDescription,
            newSettings: settings,
        };
        $.ajax({
            type: "POST",
            url: "/tracingshare/frontend/web/index.php/publication/save",
            data: {params: JSON.stringify(newData)},
            success: function (data) {
                //alert(data)
                if(redirectToView) {
                    location.href = "http://localhost/tracingshare/frontend/web/index.php/publication/view?id=" + publicationId
                }
                else {
                    //document.location.reload();
                    updateAllLayers(initDrawingsArray(settings));
                }
            },
            error: function (xhr, status, error) {
                alert("Произошла ошибка при сохранении данных:" + xhr);
            }
        });
    }

    function initDeleteButtons(settings) {
        var layersNumber = settings.drawings.length;

        for (let i = 0; i < layersNumber; i++) {
            var delBtnId = "del_btn_" + i;
            var titleId = "title_" + i;
            var deleteLayerButton = document.getElementById(delBtnId);
            var layerTitle = document.getElementById(titleId).value;
            deleteLayerButton.addEventListener('click', function (event) {
                var userAnswer = confirm("Вы действительно хотите удалить слой \" " + layerTitle +"\"?");
                if (userAnswer === true) {
                    settings.drawings.splice(i, 1);
                    var redirectToView = false;
                    saveData(settings, redirectToView)
                    //updateAllLayers(initDrawingsArray(settings))
                    initLayersSettingsForEdit(settings)
                }
            })
        }
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
                var delBtnId = "del_btn_" + i;
                var alphaId = "alpha_" + i;
                var colorId = "color_" + i;
                var descId = "desc_" + i;

                layerInfo +=
                    '<label for=\'' + titleId + '\'>Название: </label>'
                    + '<button type="button" id=\'' + delBtnId  + '\' ' +
                    'class="btn btn-outline-danger btn-sm" ' +
                    'style="float: right; margin-bottom: 10px"' +
                    '>Удалить слой</button>'
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
                layerInfo += '<br>'

                layerInfo += '</div>';
            }

            layerInfo += '</form>';
            var layersEditForm = document.getElementById("editForm");
            layersEditForm.innerHTML = layerInfo
            initDeleteButtons(settings)
        }
    }

    function reloadSettingsForEdit(defaultSettings) {
        initLayersSettingsForEdit(defaultSettings)
        updateAllLayers(initDrawingsArray(defaultSettings))
    }
}

