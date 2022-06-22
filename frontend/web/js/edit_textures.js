function prepareEditableTextures() {

    const pathParts = window.location.pathname.split ('/');
    const baseUrl = "/" + pathParts[1]
        + "/" + pathParts[2]
        + "/" + pathParts[3]
        + "/" + pathParts[4]

    if(typeof textures != "undefined"
        && textures !== ''
        && textures !== ""
        && textures.textures.length > 0) {

        initTexturesSettingsForEdit(textures);
        initDeleteButtons(textures)
        initChangeFileButtons(textures)

        function initTexturesSettingsForEdit(textures) {

            var jsonTextures = textures.textures
            var textureInfo = '<form>';
            for (let i = 0; i < jsonTextures.length; i++) {
                var textureId = "texture_" + i;
                textureInfo += '<div className="form-group" id=\'' + textureId + '\' style="border:1px solid black;\n' +
                    '                 border-radius: 10px;\n' +
                    '                padding-left: 10px;\n' +
                    '                padding-right: 10px;\n' +
                    '                padding-top: 10px;\n' +
                    '                width: 700px;\n' +
                    '                text-align: left;\n' +
                    '                margin-bottom: 10px">';

                var titleId = "title_" + i;
                var delBtnId = "del_btn_" + i;
                var descId = "desc_" + i;
                var changeFileBtnId = "chng_file_btn_" + i;
                var inputFileId = "input_file_" + i;

                textureInfo +=
                    '<label for=\'' + titleId + '\'>Название: </label>'

                    + '<button type="button" id=\'' + delBtnId + '\' ' +
                    'class="btn btn-outline-danger btn-sm" ' +
                    'style="float: right; margin-bottom: 10px"' +
                    '>Удалить</button>'

                    + '<button type="button" id=\'' + changeFileBtnId  + '\' ' +
                    'class="btn btn-outline-primary btn-sm" ' +
                    'style="float: right; margin-bottom: 10px; margin-right: 10px" ' +
                    'onclick="$(\'#\' + \'' + inputFileId + '\').trigger(\'click\');"' +
                    '>Загрузить другой файл</button>'
                    + '<input type="file" id=\'' + inputFileId + '\' style="display:none"/>'

                    + '<input type="text" id=\'' + titleId + '\' class="form-control" value=\'' + (jsonTextures[i].layerParams.title) + '\'/>'
                    + '<br>'

                    + '<label for=\'' + descId + '\'>Описание: </label>'
                    + '<textarea id=\'' + descId + '\' class="form-control">'
                    + jsonTextures[i].layerParams.description
                    + '</textarea>'
                textureInfo += '<br>'

                textureInfo += '</div>';
            }

            textureInfo += '</form>';
            var layersEditForm = document.getElementById("editTexturesForm");
            layersEditForm.innerHTML = textureInfo
        }

        function initDeleteButtons(jsonTextures) {
            var texturesNumber = jsonTextures.textures.length;

            for (let i = 0; i < texturesNumber; i++) {
                var delBtnId = "del_btn_" + i;
                var deleteLayerButton = document.getElementById(delBtnId);
                deleteLayerButton.addEventListener('click', function (event) {
                    var titleId = "title_" + i;
                    var textureTitle = document.getElementById(titleId).value;
                    var userAnswer = confirm("Вы действительно хотите удалить текстуру \" " + textureTitle + "\"?");
                    if (userAnswer === true) {
                        jsonTextures.textures.splice(i, 1);
                        var redirectToView = false;
                        saveTextures(jsonTextures, redirectToView)
                        initTexturesSettingsForEdit(jsonTextures)
                        initDeleteButtons(jsonTextures)
                    }
                })
            }
        }

        function initChangeFileButtons(jsonTextures) {
            var texturesJson = jsonTextures.textures;
            var layersNumber = texturesJson.length;

            for (let i = 0; i < layersNumber; i++) {
                (function (e) {
                    var inputFileId = "input_file_" + i;
                    var filename = texturesJson[i].image;
                    var inputElement = document.getElementById(inputFileId);
                    var titleId = "title_" + i;
                    var titleElement = document.getElementById(titleId);
                    inputElement.addEventListener("change", handleFiles, false);

                    async function handleFiles() {
                        var redirectToView = false;

                        //https://stackoverflow.com/a/17328113
                        var file = inputElement.files[0]
                        titleElement.value = (file['name']).substr(0, (file['name']).lastIndexOf('.'));
                        saveTextures(jsonTextures, redirectToView)

                        var formData = new FormData();
                        formData.append('photo-img', file); // append the file to form data

                        var xhr = false;
                        if (typeof XMLHttpRequest !== 'undefined') {
                            xhr = new XMLHttpRequest();
                        } else {
                            var versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
                            for (var i = 0, len = versions.length; i < len; i++) {
                                try {
                                    xhr = new ActiveXObject(versions[i]);
                                    break;
                                } catch (e) {
                                }
                            }
                        }
                        if (xhr) {
                            xhr.open("POST", baseUrl + "/publication/update-texture-file?filename=" + filename, true);
                            xhr.onreadystatechange = function () {
                                if (this.readyState === 4 && this.status === 200) {
                                    var response = this.response || this.responseText;
                                    response = $.parseJSON(response);
                                    if (response['error'] === 0) {
                                        location.reload()
                                    } else {
                                        window.alert(response.message);
                                    }
                                }
                            }
                            // now send the formData to server
                            xhr.send(formData);
                        }
                    }
                })(i);
            }
        }

        var saveButton = document.getElementById("save-textures-button");
        saveButton.addEventListener('click', function (event) {
            var redirectToView = true
            saveTextures(textures, redirectToView)
        });

        function saveTextures(textures, redirectToView) {
            if(typeof textures != 'undefined' && textures !== '' && textures !== "") {
                for (let i = 0; i < textures.textures.length; i++) {
                    textures.textures[i].layerParams.title = document.getElementById("title_" + i).value;
                    textures.textures[i].layerParams.description = document.getElementById('desc_' + i).value;
                }
            }
            else
            {
                textures = ''
            }
            var newData = {
                newTextures: textures,
            };

            $.ajax({
                type: "POST",
                url: baseUrl + "/publication/save-textures?id=" + publicationId,
                data: {params: JSON.stringify(newData)},
                success: function (data) {
                    //alert(data)
                    if(redirectToView) {
                        location.href = window.location.origin + baseUrl + "/publication/view?id=" + publicationId
                    }
                    else {
                        //document.location.reload();
                        initTexturesSettingsForEdit(textures);
                    }
                },
                error: function (xhr, status, error) {
                    alert("Произошла ошибка при сохранении данных:" + xhr);
                }
            });
        }
    }
}
