function prepareEditablePublication() {
    if(typeof drawings != "undefined"
        && drawings !== ''
        && drawings !== ""
        && drawings.drawings.length > 0) {

        defaultDrawings = JSON.parse(JSON.stringify(drawings));

        originalImage = new Image();
        originalImage.src = originalImageSrc;
        var drawingsImages;

        originalImage.onload = function () {
            var originalImageCtx = drawOriginalImage(originalImage)
            drawingsImages = initDrawingsArray(jsonDrawings = drawings)
            addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = originalImageCtx)
            initLayersSettingsForEdit(jsonDrawings = drawings)

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
                reloadSettingsForEdit(defaultDrawings)
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
        saveData(drawings, redirectToView)
    });

    function saveData(drawings, redirectToView) {
        if(typeof drawings != 'undefined' && drawings !== '' && drawings !== "") {
            for (let i = 0; i < drawings.drawings.length; i++) {
                drawings.drawings[i].layerParams.title = document.getElementById("title_" + i).value;
                drawings.drawings[i].layerParams.alpha = document.getElementById('alpha_' + i).value;
                drawings.drawings[i].layerParams.color = document.getElementById('color_' + i).value;
                drawings.drawings[i].layerParams.description = document.getElementById('desc_' + i).value;
            }
        }
        else
        {
            drawings = ''
        }
        mainDescription = document.getElementById('mainDesc').value;
        name = document.getElementById('name').value;
        var newData = {
            //id: parseInt(publicationId),
            newName: name,
            newDescription: mainDescription,
            newDrawings: drawings,
        };

        const pathParts = window.location.pathname.split ('/');
        const baseUrl = "/" + pathParts[1]
            + "/" + pathParts[2]
            + "/" + pathParts[3]
            + "/" + pathParts[4]


        $.ajax({
            type: "POST",
            url: baseUrl + "/publication/save?id=" + publicationId,
            data: {params: JSON.stringify(newData)},
            success: function (data) {
                //alert(data)
                if(redirectToView) {
                    location.href = window.location.origin + baseUrl + "/publication/view?id=" + publicationId
                }
                else {
                    //document.location.reload();
                    updateAllLayers(initDrawingsArray(drawings));
                }
            },
            error: function (xhr, status, error) {
                alert("Произошла ошибка при сохранении данных:" + xhr);
            }
        });
    }

    function initDeleteButtons(jsonDrawings) {
        var layersNumber = jsonDrawings.drawings.length;

        for (let i = 0; i < layersNumber; i++) {
            var delBtnId = "del_btn_" + i;
            var titleId = "title_" + i;
            var deleteLayerButton = document.getElementById(delBtnId);
            var layerTitle = document.getElementById(titleId).value;
            deleteLayerButton.addEventListener('click', function (event) {
                var userAnswer = confirm("Вы действительно хотите удалить слой \" " + layerTitle +"\"?");
                if (userAnswer === true) {
                    jsonDrawings.drawings.splice(i, 1);
                    drawingsImages.splice(i, 1);
                    var redirectToView = false;
                    initLayersSettingsForEdit(jsonDrawings)
                    saveData(jsonDrawings, redirectToView)
                }
            })
        }
    }

    function initLayersSettingsForEdit(jsonDrawings) {

        var jsonArrayDrawings = jsonDrawings.drawings
        if (Array.isArray(jsonArrayDrawings)) {

            var layerInfo = '<form>';
            for (let i = 0; i < jsonArrayDrawings.length; i++) {
                if (typeof jsonArrayDrawings[i].layerParams.alpha != 'undefined') {
                    alphaValue = jsonArrayDrawings[i].layerParams.alpha;
                    colorValue = jsonArrayDrawings[i].layerParams.color;
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
                    + '<input type="text" id=\'' + titleId + '\' class="form-control" value=\'' + (jsonArrayDrawings[i].layerParams.title) + '\'/>'
                    + '<br>'

                    + '<label for=\'' + alphaId + '\'>Прозрачность: </label>'
                    + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=\'' + alphaValue + '\' oninput=\"this.nextElementSibling.value = this.value\">'
                    + '<br>'

                    + '<label for=\'' + colorId + '\'>Цвет: </label>'
                    + '<input type="color" id=\'' + colorId + '\' class =\'color-value\' value=\'' + colorValue + '\' name="drawingColor"></button>' + '<br>'

                    + '<label for=\'' + descId + '\'>Описание: </label>'
                    + '<textarea id=\'' + descId + '\' style="width: 500px" class="form-control">'
                    + jsonArrayDrawings[i].layerParams.description
                    +'</textarea>'
                layerInfo += '<br>'

                layerInfo += '</div>';
            }

            layerInfo += '</form>';
            var layersEditForm = document.getElementById("editForm");
            layersEditForm.innerHTML = layerInfo
            initDeleteButtons(jsonDrawings)
        }
    }

    function reloadSettingsForEdit(defaultDrawings) {
        initLayersSettingsForEdit(defaultDrawings)
        updateAllLayers(initDrawingsArray(defaultDrawings))
    }
}

