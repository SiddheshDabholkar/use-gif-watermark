import React, { useRef, useState } from "react";
import { Maybe, position } from "../package/type";
import useGifWatermark from "../package/useGIFwatermark";
import "./index.css";
import SelectIcon from "./SelectIcon";
import GithubIcon from "./GithubIcon";
import NpmIcon from "./NpmIcon";

function Example() {
  const [watermarkPosition, setWatermarkPosition] = useState<position>(
    "bottomright"
  );
  const [width, setWidth] = useState(50);
  const [downloadOnComplete, setDownloadOnComplete] = useState(false);
  const [height, setHeight] = useState(50);
  const [opacity, setOpacity] = useState(1);
  const [watermark, setWatermark] = useState<Maybe<string>>(null);
  const [img, setImg] = useState<Maybe<string>>(null);

  const { base64, apply, download, gifFile, reset, status } = useGifWatermark({
    gifSrc: img,
    watermarkSrc: watermark,
    position: watermarkPosition,
    watermarkHeight: height,
    watermarkOpacity: opacity,
    watermarkWidth: width,
    downloadOnComplete,
    onError({ errorMessage }) {
      console.log(errorMessage);
    },
    onStart() {
      console.log("converting");
    },
    onSuccess({ base64, file }) {
      console.log({ base64, file });
    },
  });

  return (
    <div className="container">
      <h1 className="text-center">Example</h1>
      <div className="row align-items-center justify-content-center">
        <span id="buttonLink">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/SiddheshDabholkar/use-gif-watermark"
          >
            <GithubIcon />
          </a>
        </span>
        <span id="buttonLink">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.npmjs.com/package/use-gif-watermark"
          >
            <NpmIcon />
          </a>
        </span>
      </div>
      <div className="row align-items-center justify-content-center">
        <SelectCard
          setContent={setWatermark}
          title="Select Watermark"
          content={watermark}
          handleRemove={() => setWatermark(null)}
        />
        <SelectCard
          isGif={true}
          setContent={setImg}
          title="Select Image"
          content={img}
          handleRemove={() => setImg(null)}
        />
        <div className="card">
          <div>
            <label>Watermark Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
            />
          </div>
          <div>
            <label>Watermark Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
            />
          </div>
          <div>
            <label>Watermark Opacity</label>
            <input
              type="number"
              max={1}
              min={0}
              value={opacity}
              onChange={(e) => setOpacity(+e.target.value)}
            />
          </div>
          <div>
            <label>Watermark Position</label>
            <select
              value={watermarkPosition}
              onChange={(e) => setWatermarkPosition(e.target.value)}
            >
              <option value={"bottomright"}>Bottom right</option>
              <option value={"bottomleft"}>Bottom left</option>
              <option value={"topright"}>top right</option>
              <option value={"topleft"}>top left</option>
            </select>
          </div>
          <div>
            <label>Download on complete</label>
            <input
              defaultChecked={downloadOnComplete}
              onChange={(e) => setDownloadOnComplete(e.target.value)}
              type="checkbox"
            />
          </div>
        </div>
      </div>
      {img && watermark && (
        <>
          <div className="row align-items-center justify-content-center">
            <button disabled={status === "converting"} onClick={apply}>
              apply
            </button>
          </div>
          <div className="">
            <p className="text-center">status {status}</p>
            <div className="row align-items-center justify-content-center">
              {base64 && (
                <img
                  height={150}
                  width={150}
                  src={base64}
                  alt="Converted GIF"
                />
              )}
              p
            </div>
            {base64 && (
              <div className="row align-items-center justify-content-center">
                <button onClick={download}>download</button>
                <button onClick={reset}>reset</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

type SelectCardProps = {
  title: string;
  content?: Maybe<string>;
  isGif?: boolean;
  setContent: React.Dispatch<React.SetStateAction<Maybe<string>>>;
  handleRemove: () => void;
};
const SelectCard = ({
  title,
  content,
  isGif = false,
  setContent,
  handleRemove,
}: SelectCardProps) => {
  const ref = useRef(null);

  return (
    <div className="card">
      <p>{title}</p>
      <span
        onClick={() => {
          ref?.current?.click();
        }}
      >
        {content ? (
          <img alt="img" height="100%" width="100%" src={content} />
        ) : (
          <SelectIcon />
        )}
      </span>
      <input
        style={{ display: "none" }}
        type="file"
        accept={isGif ? "image/gif" : "image/*"}
        ref={ref}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files[0]) {
            setContent(URL.createObjectURL(files[0]));
          }
        }}
      />
      {content && (
        <button onClick={handleRemove} datatype="danger">
          remove
        </button>
      )}
    </div>
  );
};

export default Example;
