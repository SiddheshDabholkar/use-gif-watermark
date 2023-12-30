export var base64toGIF = function (base64String) {
    if (!base64String) {
        console.error("base64string cannot be empty");
        return;
    }
    var base64Content = base64String.split(";base64,").pop();
    if (!base64Content) {
        console.error("base64 is empty or is empty");
        return;
    }
    var byteCharacters = atob(base64Content);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);
        var byteNumbers = new Array(slice.length);
        // eslint-disable-next-line no-plusplus
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: "image/gif" });
    var file = new File([blob], "".concat(Date.now(), ".gif"), { type: "image/gif" });
    return file;
};
