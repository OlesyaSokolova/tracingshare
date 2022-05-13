function updateAllQueryParameters(jsonDrawings) {
    const keysToUpdateValue = ["alpha", "color"];
    var drawings = jsonDrawings.drawings;
    var uri = window.location.href
    for (let i = 0; i < drawings.length; i++) {
        var layerParams = drawings[i].layerParams
        for (var key in layerParams) {
            if(keysToUpdateValue.includes(key)) {
                var specialKey = "drawings_" + i + "_layerParams_" + key;
                var re = new RegExp("([?&])" + specialKey + "=.*?(&|$)", "i");
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.match(re)) {
                    uri = uri.replace(re, '$1' + specialKey + "=" + encodeURIComponent(layerParams[key]) + '$2');
                } else {
                    uri += (separator + specialKey + "=" + encodeURIComponent(layerParams[key]));
                }
            }
        }
    }
    if (window.history.replaceState) {
        //prevents browser from storing history with each change:
        window.history.replaceState(null, '', uri);
    }
}
function updateOneQueryParameter(jsonDrawings, layerId, key, value) {

    jsonDrawings.drawings[layerId].layerParams[key] = value.toString()
    updateAllQueryParameters(jsonDrawings)
}

function updateSettingsFromQuery(drawings) {
    let params = (new URL(document.location.href)).searchParams;
    const keysToUpdateValue = ["alpha", "color"];
    for (let i = 0; i < drawings.drawings.length; i++) {
        for(let j = 0; j < keysToUpdateValue.length; j++) {
            var specialKey = "drawings_" + i + "_layerParams_" + keysToUpdateValue[j];
            var value = params.get(specialKey)
            if(value != null) {
                drawings.drawings[i].layerParams[keysToUpdateValue[j]] = decodeURIComponent(value)
            }
        }
    }
}
