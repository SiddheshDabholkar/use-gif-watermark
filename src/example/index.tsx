import React, { useState } from "react";
import { Maybe } from "../package/type";
import useGifWatermark from "../package/useGIFwatermark";

function Example() {
  const [watermark, setWatermark] = useState<Maybe<string>>(null);
  const [img, setImg] = useState<Maybe<string>>(null);

  const {
    base64,
    apply,
    download,
    gifFile,
    reset,
    status,
  } = useGifWatermark({
    gifSrc: img,
    watermarkSrc: watermark,
    position: "bottomright",
    watermarkHeight: 50,
    watermarkOpacity: 1,
    watermarkWidth: 50,
    downloadOnComplete: true,
    onError({ errorMessage }) {
      console.log(errorMessage);
    },
    onStart() {
      console.log("converting started");
    },
    onSuccess({ base64, file }) {
      console.log({ base64, file });
    },
  });

  return (
    <>
      <div>
        {img && <img height={50} width={50} src={img} alt="to be converted" />}
        <input
          type="file"
          accept="image/gif"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files[0] !== null) {
              setImg(URL.createObjectURL(files[0]));
            }
          }}
        />
      </div>
      <div>
        {watermark && (
          <img height={50} width={50} src={watermark} alt="watermark" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files[0] !== null) {
              setWatermark(URL.createObjectURL(files[0]));
            }
          }}
        />
        <div>
          {base64 && (
            <img height={100} width={100} src={base64} alt="Converted GIF" />
          )}
          <span>Applied watermark</span>
        </div>
        <div>
          <span>{status}</span>
          <button onClick={download}>download</button>
          <button onClick={apply}>apply</button>
          <button onClick={reset}>reset</button>
        </div>
      </div>
    </>
  );
}

export default Example;
