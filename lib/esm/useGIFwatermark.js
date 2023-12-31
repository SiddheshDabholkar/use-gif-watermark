import { useEffect, useState } from "react";
import { parseGIF, decompressFrames } from "@flyskywhy/gifuct-js";
import { createGIF } from "gifshot";
import { base64toGIF, downloadGif, getPosition } from "./utils";
var useGifWatermark = function (_a) {
    var _b = _a.watermarkHeight, watermarkHeight = _b === void 0 ? 50 : _b, _c = _a.watermarkWidth, watermarkWidth = _c === void 0 ? 50 : _c, _d = _a.watermarkOpacity, watermarkOpacity = _d === void 0 ? 1 : _d, _e = _a.position, position = _e === void 0 ? "bottomright" : _e, gifSrc = _a.gifSrc, watermarkSrc = _a.watermarkSrc, _f = _a.downloadOnComplete, downloadOnComplete = _f === void 0 ? false : _f, onError = _a.onError, onStart = _a.onStart, onSuccess = _a.onSuccess;
    var _g = useState("idle"), status = _g[0], setStatus = _g[1];
    var _h = useState(false), startApplying = _h[0], setStartApplying = _h[1];
    var _j = useState(null), convertedGIF = _j[0], setConvertedGIF = _j[1];
    var _k = useState({
        height: 0,
        width: 0,
    }), dimensions = _k[0], setDimensions = _k[1];
    var _l = useState([]), frames = _l[0], setFrames = _l[1];
    var _m = useState(null), gifFile = _m[0], setGifFile = _m[1];
    var _o = useState([]), watermarkedFrames = _o[0], setWatermarkedFrames = _o[1];
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
    useEffect(function () {
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
                var gif = parseGIF(buff);
                // @ts-ignore
                var framess = decompressFrames(gif, true, true);
                setFrames(framess);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifSrc, startApplying, watermarkSrc]);
    useEffect(function () {
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
                        var _a = getPosition({
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
    }, [frames, watermarkSrc]);
    useEffect(function () {
        if (watermarkedFrames.length > 0) {
            try {
                createGIF({
                    images: watermarkedFrames,
                    gifWidth: dimensions.width,
                    gifHeight: dimensions.height,
                    crossOrigin: "Anonymous",
                }, function (obj) {
                    var img = obj.image;
                    var file = base64toGIF(img);
                    setGifFile(file);
                    if (downloadOnComplete && file) {
                        downloadGif(file);
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
            downloadGif(gifFile);
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
export default useGifWatermark;
