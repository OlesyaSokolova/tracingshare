function removeFullFilepath(fullSrc) {
   return fullSrc.replace(/^.*[\\\/]/, '')
}

function removeFileFormat(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename
}

function removeGeneratedValue(filename) {
    return filename.substring(0, filename.lastIndexOf('?')) || filename
}

function getIndexFromImageName(maxImageName) {
    var fileWithoutPrefix = (maxImageName.split('_')[2])
    return parseInt(removeFileFormat(fileWithoutPrefix))
}

function generateNextImageName(maxImageName) {
   return prefix + (getIndexFromImageName(maxImageName) + 1) + ".png";
}
