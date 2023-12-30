"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadGif = void 0;
var downloadGif = function (file) {
    var link = document.createElement("a");
    link.download = file.name;
    link.title = file.name;
    link.href = URL.createObjectURL(file);
    link.click();
};
exports.downloadGif = downloadGif;
