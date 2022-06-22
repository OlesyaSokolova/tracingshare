function prepareView() {
    if(typeof drawings != "undefined"
        && drawings !== ''
        && drawings !== ""
        && drawings !== "0"
        && drawings.drawings.length > 0) {
        defaultDrawings = JSON.parse(JSON.stringify(drawings));

        preparedTextures = ''
        if(typeof textures != "undefined"
            && textures !== ''
            && textures !== ""
            && textures.textures.length > 0) {
            preparedTextures = textures.textures
        }
        //1. update settings from query (if exist)
        updateSettingsFromQuery(drawings);

        //2. put (updated) settings to url
        updateAllQueryParameters(drawings)
        backgroundId = "originalImage";

        originalImage = new Image();
        originalImage.src = originalImageSrc + '?' + new Date().getTime();
        originalImage.onload = function () {

            var originalImageCtx = drawOriginalImage(originalImage)
            var drawingsImages = initDrawingsArray(jsonDrawings = drawings)
            addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = originalImageCtx)
            initLayersSettings(jsonDrawings = drawings)

            classNameContainer = 'layers-class'

            $('.' + classNameContainer)
                .on('input change', '.alpha-value', function () {
                    $(this).attr('value', $(this).val());
                    var newAlpha = parseFloat($(this).val());
                    var drawingImageId = parseInt($(this).attr('id'));
                    drawingsImages[drawingImageId].alpha = newAlpha;
                    updateAllLayers(drawingsImages)
                    updateOneQueryParameter(jsonDrawings = drawings, layerId = drawingImageId, key = "alpha", newValue = newAlpha);
                })
                .on('input change', '.color-value', function () {
                    $(this).attr('value', $(this).val());
                    var newColor = $(this).val();
                    var drawingImageId = parseInt($(this).attr('id'));
                    drawingsImages[drawingImageId].color = newColor;
                    updateAllLayers(drawingsImages)
                    updateOneQueryParameter(jsonDrawings = drawings, layerId = drawingImageId, key = "color", newValue = newColor);
                });

            if (drawings.drawings.length !== 0) {
                var descriptionDiv = document.getElementById('description');
                var layerTitle = document.getElementById('layer_title');
                descriptionDiv.innerText = drawings.drawings[0].layerParams.description;
                document.getElementById('layer_' + 0).style.background = "#d6d5d5";
                layerTitle.innerText = drawings.drawings[0].layerParams.title
            }

            var resetButton = document.getElementById("reset-button");
            if(resetButton) {
                resetButton.addEventListener('click', function (event) {
                    reloadSettings(defaultDrawings, drawingsImages)

                    if (drawings.drawings.length !== 0) {
                        var descriptionDiv = document.getElementById('description');
                        var layerTitle = document.getElementById('layer_title');
                        descriptionDiv.innerText = drawings.drawings[0].layerParams.description;
                        document.getElementById('layer_' + 0).style.background = "#d6d5d5";
                        layerTitle.innerText = drawings.drawings[0].layerParams.title
                    }
                })
            }
        }
    }
    else {
        originalImage = new Image();
        originalImage.src = originalImageSrc + '?' + new Date().getTime();

        originalImage.onload = function () {
            drawOriginalImage(originalImage)
        }
    }

    addDropdownMenuForTextures();

    function addDropdownMenuForTextures() {

        var texturesSelectElement = document.getElementById("selectTextures");
        if(typeof textures != "undefined"
            && textures !== ''
            && textures !== ""
            && textures.textures.length > 0) {
            preparedTextures = textures.textures
            if (Array.isArray(preparedTextures)) {

                var options = '';
                for (let i = 0; i < preparedTextures.length; i++) {
                    var currentId = "texture_" + i;
                    options += '<option id=\'' + currentId + '\'>'
                        + preparedTextures[i].layerParams.title
                        + '</option>'
                }
                texturesSelectElement.insertAdjacentHTML('beforeend', options);
            }
        }
            texturesSelectElement.onchange = function () {
                backgroundId = texturesSelectElement.options[texturesSelectElement.selectedIndex].id;
                var descriptionDiv = document.getElementById('backgroundDescription');
                if(backgroundId === "originalImage") {
                    var imageCtx = drawOriginalImage(originalImage)
                    if (typeof drawings != "undefined"
                        && drawings !== ''
                        && drawings !== ""
                        && drawings !== "0"
                        && drawings.drawings.length > 0) {
                        drawingsImages = initDrawingsArray(jsonDrawings = drawings)
                        addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = imageCtx)
                        descriptionDiv.innerHTML = ''
                    }
                }
                else if (backgroundId === "none") {
                    var emptyCanvas = document.getElementById('publicationCanvas');
                    var emptyCtx = emptyCanvas.getContext('2d');
                    emptyCtx.clearRect(0, 0, emptyCanvas.width, emptyCanvas.height);
                    if (typeof drawings != "undefined"
                        && drawings !== ''
                        && drawings !== ""
                        && drawings !== "0"
                        && drawings.drawings.length > 0) {
                        drawingsImages = initDrawingsArray(jsonDrawings = drawings)
                        addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = emptyCtx)
                        descriptionDiv.innerHTML = ''
                    }
                }
                else {
                    var index = parseInt((backgroundId).split('_')[1])
                    var textureSrc = texturePathPrefix + preparedTextures[index].image;
                    textureImage = new Image();
                    textureImage.src = textureSrc + '?' + new Date().getTime();

                    if (isImageOk(textureImage)) {
                        var textureImageCtx = drawOriginalImage(textureImage)
                        if (typeof drawings != "undefined"
                            && drawings !== ''
                            && drawings !== ""
                            && drawings !== "0"
                            && drawings.drawings.length > 0) {
                            var drawingsImages = initDrawingsArray(jsonDrawings = drawings)
                            addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = textureImageCtx)
                        }
                    }
                    else {
                        textureImage.onload = function () {
                            var textureImageCtx = drawOriginalImage(textureImage)
                            if (typeof drawings != "undefined"
                                && drawings !== ''
                                && drawings !== ""
                                && drawings !== "0"
                                && drawings.drawings.length > 0) {
                                var drawingsImages = initDrawingsArray(jsonDrawings = drawings)
                                addImagesToContext(imagesArray = drawingsImages, contextToDrawOn = textureImageCtx)
                            }
                        }
                    }

                    if(preparedTextures[index].layerParams.description.trim().length !== 0) {

                        descriptionDiv.innerHTML = '<div style="border:1px solid black;\n' +
                            '                border-radius: 10px;\n' +
                            '                height: fit-content;\n' +
                            '                text-align: center;\n' +
                            '                margin-bottom: 10px"">' +
                            preparedTextures[index].layerParams.description +
                            '                </div>'
                    }
                    else {
                        descriptionDiv.innerHTML = ''
                    }
                }
            }
    }
    var downloadZipButton = document.getElementById("download-zip-button");
    //https://gist.github.com/c4software/981661f1f826ad34c2a5dc11070add0f?permalink_comment_id=3517790#gistcomment-3517790
    downloadZipButton.addEventListener('click', function (event) {
        var urls = [
            originalImageSrc,
        ];

        if(typeof textures != "undefined"
            && textures !== ''
            && textures !== ""
            && textures.textures.length > 0) {
            if (Array.isArray(textures.textures)) {
                for (let i = 0; i < textures.textures.length; i++) {
                    urls.push(texturePathPrefix + textures.textures[i].image)
                }
            }
        }
        if(typeof drawings != "undefined"
            && drawings !== ''
            && drawings !== ""
            && drawings.drawings.length > 0) {
            if (Array.isArray(drawings.drawings)) {
                for (let i = 0; i < drawings.drawings.length; i++) {
                    urls.push(drawingPathPrefix + drawings.drawings[i].image)
                }
            }
        }
        const zip = new JSZip();
        let count = 0;
        const originalImageFileName = originalImageSrc.split('/');
        const filename = originalImageFileName[originalImageFileName.length - 1].split('.')[0];
        const zipFilename = filename + ".zip";
        urls.forEach(async function (url) {
            const urlArr = url.split('/');
            const filename = urlArr[urlArr.length - 1];
            try {
                const file = await JSZipUtils.getBinaryContent(url)
                zip.file(filename, file, {binary: true});
                count++;
                if (count === urls.length) {
                    zip.generateAsync({type: 'blob'}).then(function (content) {
                        saveAs(content, zipFilename);
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });
    });
}


function reloadSettings( defaultDrawings) {
    initLayersSettings(defaultDrawings)
    updateAllLayers(initDrawingsArray(defaultDrawings))
    updateAllQueryParameters(defaultDrawings)
}

function initLayersSettings(jsonDrawings) {
    var drawings = jsonDrawings.drawings
    if (Array.isArray(drawings)) {
        var inputAlpha = '<div id="drawings" style="width: 200px">';
        for (let i = 0; i < drawings.length; i++) {
            if (typeof drawings[i].layerParams.alpha != 'undefined') {
                alphaValue = drawings[i].layerParams.alpha;
                colorValue = drawings[i].layerParams.color;
            } else {
                alphaValue = 1;
            }
            var currentId = "layer_" + i;
            inputAlpha += '<div id=\'' + currentId + '\' class = "bordered_div" style="border:1px solid black; border-radius: 10px; text-align: center; margin-bottom: 10px">';
            inputAlpha += (drawings[i].layerParams.title) + '<br>'
                + '<input type=\'range\' name="alphaChannel" id=\'' + i + '\' class=\'alpha-value\' step=\'0.02\' min=\'0\' max=\'1\' value=\'' + alphaValue + '\' oninput=\"this.nextElementSibling.value = this.value\">'
                + '<br>'
                + '<label for="drawingColor">Цвет: </label>'
                + '<input type="color" id=\'' + i + '\' class =\'color-value\' value=\'' + colorValue + '\' name="drawingColor"></button>' + '<br>';
            inputAlpha += '</div>';
        }
        inputAlpha += '</div>';
        var layersDiv = document.getElementById("layers");
        layersDiv.innerHTML = inputAlpha

        var descriptionDiv = document.getElementById('description');
        var layerTitle = document.getElementById('layer_title');
        for (let i = 0; i < drawings.length; i++) {
            document.getElementById('layer_' + i)
                .addEventListener('click', function (event) {
                    descriptionDiv.innerText = drawings[i].layerParams.description
                    this.style.background = "#d6d5d5";
                    layerTitle.innerText = drawings[i].layerParams.title

                    function clearOtherLayersDivs(i) {
                        for (let j = 0; j < drawings.length; j++) {
                            if(i !== j) {
                                document.getElementById('layer_' + j).style.background = "#ffffff";
                            }
                        }
                    }
                    clearOtherLayersDivs(i)
                });
        }
    }
}

