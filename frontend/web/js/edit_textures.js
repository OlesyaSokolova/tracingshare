function prepareEditableTextures() {


    if(typeof textures != "undefined"
        && textures !== ''
        && textures !== ""
        && textures.textures.length > 0) {

        initTexturesSettingsForEdit(textures);
        initDeleteButtons(textures)


        function initTexturesSettingsForEdit(textures) {

            var jsonTextures = textures.textures
            var textureInfo = '<form>';
            for (let i = 0; i < jsonTextures.length; i++) {
                var textureId = "texture_" + i;
                textureInfo += '<div className="form-group" id=\'' + textureId + '\' style="border:1px solid black;\n' +
                    '                border-radius: 10px;\n' +
                    '                padding-left: 10px;\n' +
                    '                padding-right: 10px;\n' +
                    '                width: 700px;\n' +
                    '                text-align: left;\n' +
                    '                margin-bottom: 10px">';

                var titleId = "title_" + i;
                var delBtnId = "del_btn_" + i;
                var descId = "desc_" + i;

                textureInfo +=
                    '<label for=\'' + titleId + '\'>Название: </label>'
                    + '<button type="button" id=\'' + delBtnId + '\' ' +
                    'class="btn btn-outline-danger btn-sm" ' +
                    'style="float: right; margin-bottom: 10px"' +
                    '>Удалить</button>'
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
                        //drawingsImages.splice(i, 1);
                        //var redirectToView = false;
                        initTexturesSettingsForEdit(jsonTextures)
                        initDeleteButtons(jsonTextures)
                        //saveTextures(jsonTextures, redirectToView)
                    }
                })
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

            const pathParts = window.location.pathname.split ('/');
            const baseUrl = "/" + pathParts[1]
                + "/" + pathParts[2]
                + "/" + pathParts[3]


            $.ajax({
                type: "POST",
                url: baseUrl + "/publication/save-textures?id=" + publicationId,
                data: {params: JSON.stringify(newData)},
                success: function (data) {
                    //alert(data)
                    if(redirectToView) {
                        location.href = window.location.origin + baseUrl + "/publication/view?id=" + publicationId
                    }
                    /*else {
                        //document.location.reload();
                        updateAllLayers(initDrawingsArray(textures));
                    }*/
                },
                error: function (xhr, status, error) {
                    alert("Произошла ошибка при сохранении данных:" + xhr);
                }
            });
        }
    }
}
