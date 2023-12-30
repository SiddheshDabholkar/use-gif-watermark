"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var gifuct_js_1 = require("@flyskywhy/gifuct-js");
var gifshot_1 = require("gifshot");
var utils_1 = require("./utils");
var useGifWatermark = function (_a) {
    var _b = _a.watermarkHeight, watermarkHeight = _b === void 0 ? 50 : _b, _c = _a.watermarkWidth, watermarkWidth = _c === void 0 ? 50 : _c, _d = _a.watermarkOpacity, watermarkOpacity = _d === void 0 ? 1 : _d, _e = _a.position, position = _e === void 0 ? "bottomright" : _e, gifSrc = _a.gifSrc, watermarkSrc = _a.watermarkSrc, _f = _a.downloadOnComplete, downloadOnComplete = _f === void 0 ? false : _f, onError = _a.onError, onStart = _a.onStart, onSuccess = _a.onSuccess;
    var _g = (0, react_1.useState)("idle"), status = _g[0], setStatus = _g[1];
    var _h = (0, react_1.useState)(false), startApplying = _h[0], setStartApplying = _h[1];
    var _j = (0, react_1.useState)(null), convertedGIF = _j[0], setConvertedGIF = _j[1];
    var _k = (0, react_1.useState)({
        height: 0,
        width: 0,
    }), dimensions = _k[0], setDimensions = _k[1];
    var _l = (0, react_1.useState)([]), frames = _l[0], setFrames = _l[1];
    var _m = (0, react_1.useState)(null), gifFile = _m[0], setGifFile = _m[1];
    var _o = (0, react_1.useState)([]), watermarkedFrames = _o[0], setWatermarkedFrames = _o[1];
    var reset = function () {
        setStartApplying(false);
        setConvertedGIF(null);
        setGifFile(null);
        setFrames([]);
        setWatermarkedFrames([]);
        setDimensions({
            height: 0,
            width: 0,
        });
        setStatus("idle");
    };
    var handleError = function (message) {
        reset();
        setStatus("error");
        console.error(message);
        onError && onError({ errorMessage: message });
        throw new Error(message);
    };
    (0, react_1.useEffect)(function () {
        if (startApplying) {
            if (!gifSrc) {
                handleError("gifSrc is required");
                return;
            }
            if (!watermarkSrc) {
                handleError("watermarkSrc is required");
                return;
            }
            setStatus("converting");
            onStart && onStart();
            fetch(gifSrc)
                .then(function (resp) { return resp.arrayBuffer(); })
                .then(function (buff) {
                var gif = (0, gifuct_js_1.parseGIF)(buff);
                // @ts-ignore
                var framess = (0, gifuct_js_1.decompressFrames)(gif, true, true);
                setFrames(framess);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifSrc, startApplying, watermarkSrc]);
    (0, react_1.useEffect)(function () {
        var applyWatermark = function () {
            if (frames.length > 0 && watermarkSrc) {
                try {
                    setConvertedGIF(null);
                    setWatermarkedFrames([]);
                    var canvas_1 = document.createElement("canvas");
                    var context_1 = canvas_1.getContext("2d");
                    if (!context_1) {
                        handleError("Something went wrong with canvas");
                        return;
                    }
                    var frame = frames[0];
                    var _a = frame.dims, width_1 = _a.width, height_1 = _a.height;
                    setDimensions({
                        height: height_1,
                        width: width_1,
                    });
                    canvas_1.width = width_1;
                    canvas_1.height = height_1;
                    var watermarkImage_1 = new Image();
                    watermarkImage_1.crossOrigin = "anonymous";
                    watermarkImage_1.src = watermarkSrc;
                    watermarkImage_1.onload = function () {
                        var applied = [];
                        var waterMarkOffset = 10;
                        var _a = (0, utils_1.getPosition)({
                            position: position,
                            waterMarkOffset: waterMarkOffset,
                            height: watermarkHeight,
                            width: watermarkWidth,
                            canvas: canvas_1,
                        }), positionX = _a.positionX, positionY = _a.positionY;
                        // eslint-disable-next-line array-callback-return
                        frames.map(function (f) {
                            context_1.clearRect(0, 0, width_1, height_1);
                            context_1.putImageData(f.imageData, 0, 0);
                            context_1.globalAlpha = watermarkOpacity;
                            context_1.drawImage(watermarkImage_1, positionX, positionY, watermarkHeight, watermarkWidth);
                            applied.push(canvas_1.toDataURL("image/webp", 1.0));
                        });
                        setWatermarkedFrames(applied);
                    };
                }
                catch (error) {
                    handleError("Error while applying wtermark");
                }
            }
        };
        applyWatermark();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        frames,
        watermarkSrc,
        position,
        watermarkHeight,
        watermarkWidth,
        watermarkOpacity,
    ]);
    (0, react_1.useEffect)(function () {
        if (watermarkedFrames.length > 0) {
            try {
                (0, gifshot_1.createGIF)({
                    images: watermarkedFrames,
                    gifWidth: dimensions.width,
                    gifHeight: dimensions.height,
                    crossOrigin: "Anonymous",
                }, function (obj) {
                    var img = obj.image;
                    var file = (0, utils_1.base64toGIF)(img);
                    setGifFile(file);
                    if (downloadOnComplete && file) {
                        (0, utils_1.downloadGif)(file);
                    }
                    else {
                        handleError("Something went wrong while downloading");
                    }
                    setStatus("converted");
                    onSuccess && onSuccess({ base64: img, file: file });
                    setConvertedGIF(img);
                });
            }
            catch (error) {
                setStatus("failed");
                handleError("Failed to apply watermark on GIF");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watermarkedFrames, dimensions]);
    var apply = function () {
        setStartApplying(true);
    };
    var download = function () {
        if (gifFile) {
            (0, utils_1.downloadGif)(gifFile);
        }
        else {
            handleError("Something went wrong while downloading");
        }
    };
    return {
        base64: convertedGIF,
        gifFile: gifFile,
        apply: apply,
        reset: reset,
        download: download,
        status: status,
    };
};
exports.default = useGifWatermark;
