import { useEffect, useState } from "react";
import { parseGIF, decompressFrames } from "@flyskywhy/gifuct-js";
import { createGIF } from "gifshot";
import { base64toGIF, downloadGif, getPosition } from "./utils";
import {
  Maybe,
  base64,
  createGIFobj,
  statusType,
  useGIFwatermarkProps,
  useGIFwatermarkReturn,
} from "./type";

const useGifWatermark = ({
  watermarkHeight = 50,
  watermarkWidth = 50,
  watermarkOpacity = 1,
  position = "bottomright",
  gifSrc,
  watermarkSrc,
  downloadOnComplete = false,

  onError,
  onStart,
  onSuccess,
}: useGIFwatermarkProps): useGIFwatermarkReturn => {
  const [status, setStatus] = useState<statusType>("idle");
  const [startApplying, setStartApplying] = useState(false);
  const [convertedGIF, setConvertedGIF] = useState<Maybe<base64>>(null);
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  const [frames, setFrames] = useState<any>([]);
  const [gifFile, setGifFile] = useState<Maybe<File>>(null);
  const [watermarkedFrames, setWatermarkedFrames] = useState<base64[]>([]);

  const reset = () => {
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

  const handleError = (message: string) => {
    reset();
    setStatus("error");
    console.error(message);
    onError && onError({ errorMessage: message });
    throw new Error(message);
  };

  useEffect(() => {
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
        .then((resp) => resp.arrayBuffer())
        .then((buff) => {
          const gif = parseGIF(buff);
          // @ts-ignore
          const framess = decompressFrames(gif, true, true);
          setFrames(framess);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gifSrc, startApplying, watermarkSrc]);

  useEffect(() => {
    const applyWatermark = () => {
      if (frames.length > 0 && watermarkSrc) {
        try {
          setConvertedGIF(null);
          setWatermarkedFrames([]);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            handleError("Something went wrong with canvas");
            return;
          }
          const frame = frames[0];
          const { width, height } = frame.dims;
          setDimensions({
            height,
            width,
          });
          canvas.width = width;
          canvas.height = height;
          const watermarkImage = new Image();
          watermarkImage.crossOrigin = "anonymous";
          watermarkImage.src = watermarkSrc;
          watermarkImage.onload = () => {
            const applied: base64[] = [];
            const waterMarkOffset = 10;
            const { positionX, positionY } = getPosition({
              position,
              waterMarkOffset,
              height: watermarkHeight,
              width: watermarkWidth,
              canvas,
            });
            // eslint-disable-next-line array-callback-return
            frames.map((f: any) => {
              context.clearRect(0, 0, width, height);
              context.putImageData(f.imageData, 0, 0);
              context.globalAlpha = watermarkOpacity;

              context.drawImage(
                watermarkImage,
                positionX,
                positionY,
                watermarkHeight,
                watermarkWidth
              );
              applied.push(canvas.toDataURL("image/webp", 1.0));
            });
            setWatermarkedFrames(applied);
          };
        } catch (error) {
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

  useEffect(() => {
    if (watermarkedFrames.length > 0) {
      try {
        createGIF(
          {
            images: watermarkedFrames,
            gifWidth: dimensions.width,
            gifHeight: dimensions.height,
            crossOrigin: "Anonymous",
          },
          (obj: createGIFobj) => {
            const img = obj.image;
            const file = base64toGIF(img);
            setGifFile(file);
            if (downloadOnComplete && file) {
              downloadGif(file);
            } else {
              handleError("Something went wrong while downloading");
            }
            setStatus("converted");
            onSuccess && onSuccess({ base64: img, file });
            setConvertedGIF(img);
          }
        );
      } catch (error) {
        setStatus("failed");
        handleError("Failed to apply watermark on GIF");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watermarkedFrames, dimensions]);

  const apply = () => {
    setStartApplying(true);
  };

  const download = () => {
    if (gifFile) {
      downloadGif(gifFile);
    } else {
      handleError("Something went wrong while downloading");
    }
  };

  return {
    base64: convertedGIF,
    gifFile,
    apply,
    reset,
    download,
    status,
  };
};

export default useGifWatermark;
