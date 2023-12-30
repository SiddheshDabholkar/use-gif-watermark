import { position } from "../type";
type getPositionProps = {
    position: position;
    waterMarkOffset: number;
    height: number;
    width: number;
    canvas: HTMLCanvasElement;
};
export declare const getPosition: ({ position, waterMarkOffset, height, width, canvas, }: getPositionProps) => {
    positionX: number;
    positionY: number;
};
export {};
