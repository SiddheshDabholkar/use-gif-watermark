import { position } from "../type";

type getPositionProps = {
  position: position;
  waterMarkOffset: number;
  height: number;
  width: number;
  canvas: HTMLCanvasElement;
};

export const getPosition = ({
  position,
  waterMarkOffset,
  height,
  width,
  canvas,
}: getPositionProps) => {
  let positionX = waterMarkOffset;
  let positionY = canvas.height - height - waterMarkOffset;
  if (position === "bottomright") {
    positionX = canvas.width - width - waterMarkOffset;
    positionY = canvas.height - height - waterMarkOffset;
  } else if (position === "bottomleft") {
    positionX = waterMarkOffset;
    positionY = canvas.height - height - waterMarkOffset;
  } else if (position === "topright") {
    positionX = canvas.width - width - waterMarkOffset;
    positionY = waterMarkOffset;
  } else if (position === "topleft") {
    positionX = waterMarkOffset;
    positionY = waterMarkOffset;
  }
  return {
    positionX,
    positionY,
  };
};
