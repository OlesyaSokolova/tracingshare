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

    const pathParts = window.location.pathname.split ('/');
    const baseUrl = "/" + pathParts[1]
        + "/" + pathParts[2]
        + "/" + pathParts[3]
        + "/" + pathParts[4]

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
        //mainDescription = document.getElementById('mainDesc').value;
        name = document.getElementById('name').value;
        var newData = {
            //id: parseInt(publicationId),
            newName: name,
            //newDescription: mainDescription,
            newDrawings: drawings,
        };

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
            var deleteLayerButton = document.getElementById(delBtnId);
            deleteLayerButton.addEventListener('click', function (event) {
                var titleId = "title_" + i;
                var layerTitle = document.getElementById(titleId).value;
                var userAnswer = confirm("Вы действительно хотите удалить слой \" " + layerTitle +"\"?");
                if (userAnswer === true) {
                    jsonDrawings.drawings.splice(i, 1);
                    drawingsImages.splice(i, 1);
                    var redirectToView = false;
                    saveData(jsonDrawings, redirectToView)
                    initLayersSettingsForEdit(jsonDrawings)
                    updateAllLayers(initDrawingsArray(jsonDrawings));
                }
            })
        }
    }

    function initChangeFileButtons(jsonDrawings) {
        var drawingsJson = jsonDrawings.drawings;
        var layersNumber = drawingsJson.length;

        for (let i = 0; i < layersNumber; i++) {
            (function(e) {
                var inputFileId = "input_file_" + i;
                var filename = drawingsJson[i].image;
                var inputElement = document.getElementById(inputFileId);
                inputElement.addEventListener("change", handleFiles, false);

                async function handleFiles() {
                    var redirectToView = false;
                    saveData(jsonDrawings, redirectToView)

                    //https://stackoverflow.com/a/17328113
                    var file = inputElement.files[0]
                    var formData  = new FormData();
                    formData.append( 'photo-img', file ); // append the file to form data

                    var xhr = false;
                    if ( typeof XMLHttpRequest !== 'undefined' ) {
                        xhr = new XMLHttpRequest();
                    }
                    else {
                        var versions  = [ "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp" ];
                        for( var i = 0, len = versions.length; i < len; i++ ) {
                            try {
                                xhr = new ActiveXObject( versions[i] );
                                break;
                            }
                            catch(e) {}
                        }
                    }
                    if ( xhr ) {
                        xhr.open( "POST", baseUrl + "/publication/update-drawing-file?filename=" + filename, true );
                        xhr.onreadystatechange  = function() {
                            if ( this.readyState === 4 && this.status === 200 ) {
                                var response  = this.response || this.responseText;
                                response  = $.parseJSON( response );
                                if(response['error'] === 0) {
                                    location.reload()
                                }
                                else {
                                    window.alert( response.message );
                                }
                            }
                        }
                        // now send the formData to server
                        xhr.send( formData );
                    }
                }
            })(i);
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
                    '                padding-left: 10px;\n' +
                    '                padding-right: 10px;\n' +
                    '                padding-top: 10px;\n' +
                    '                width: 700px;\n' +
                    '                text-align: left;\n' +
                    '                margin-bottom: 10px">';

                var titleId = "title_" + i;
                var delBtnId = "del_btn_" + i;
                var changeFileBtnId = "chng_file_btn_" + i;
                var inputFileId = "input_file_" + i;
                var alphaId = "alpha_" + i;
                var colorId = "color_" + i;
                var descId = "desc_" + i;

                layerInfo +=
                    '<label for=\'' + titleId + '\'>Название: </label>'

                    + '<button type="button" id=\'' + delBtnId  + '\' ' +
                    'class="btn btn-outline-danger btn-sm" ' +
                    'style="float: right; margin-bottom: 10px"' +
                    '>Удалить</button>'

                    + '<button type="button" id=\'' + changeFileBtnId  + '\' ' +
                    'class="btn btn-outline-primary btn-sm" ' +
                    'style="float: right; margin-bottom: 10px; margin-right: 10px" ' +
                    'onclick="$(\'#\' + \'' + inputFileId + '\').trigger(\'click\');"' +
                    '>Загрузить другой файл</button>'
                    + '<input type="file" id=\'' + inputFileId + '\' style="display:none"/>'

                    + '<input type="text" id=\'' + titleId + '\' class="form-control" value=\'' + (jsonArrayDrawings[i].layerParams.title) + '\'/>'
                    + '<br>'

                    + '<label for=\'' + alphaId + '\'>Прозрачность: </label>'
                    + '<input type=\'range\' name="alphaChannel" id=\'' + alphaId + '\' class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=\'' + alphaValue + '\' oninput=\"this.nextElementSibling.value = this.value\">'
                    + '<br>'

                    + '<label for=\'' + colorId + '\'>Цвет: </label>'
                    + '<input type="color" id=\'' + colorId + '\' class =\'color-value\' value=\'' + colorValue + '\' name="drawingColor"></button>' + '<br>'

                    + '<label for=\'' + descId + '\'>Описание: </label>'
                    + '<textarea id=\'' + descId + '\' class="form-control">'
                    + jsonArrayDrawings[i].layerParams.description
                    +'</textarea>'
                layerInfo += '<br>'

                layerInfo += '</div>';
            }

            layerInfo += '</form>';
            var layersEditForm = document.getElementById("editForm");
            layersEditForm.innerHTML = layerInfo
            initDeleteButtons(jsonDrawings)
            initChangeFileButtons(jsonDrawings)
        }
    }

    function reloadSettingsForEdit(defaultDrawings) {
        initLayersSettingsForEdit(defaultDrawings)
        updateAllLayers(initDrawingsArray(defaultDrawings))
    }
}

