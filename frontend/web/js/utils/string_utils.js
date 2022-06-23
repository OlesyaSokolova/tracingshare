function removeFullFilepath(fullSrc) {
   return fullSrc.replace(/^.*[\\\/]/, '')
}

function removeFileFormat(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename
}

function removeGeneratedValue(filename) {
    return filename.substring(0, filename.lastIndexOf('?')) || filename
}

function getIndexFromImageName(filename) {
    var fileWithoutPrefix = (filename.split('_')[2])
    return parseInt(removeFileFormat(fileWithoutPrefix))
}
