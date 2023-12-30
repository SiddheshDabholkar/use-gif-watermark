export type position = "bottomright" | "bottomleft" | "topright" | "topleft";
export type base64 = string;
export type Maybe<T> = T | undefined | null;
export type statusType = "idle" | "converting" | "converted" | "failed" | "error";
type onSuccessProps = {
    base64: Maybe<base64>;
    file: Maybe<File>;
};
type onErrorProps = {
    errorMessage: string;
};
export type useGIFwatermarkProps = {
    gifSrc: Maybe<string>;
    watermarkSrc: Maybe<string>;
    watermarkHeight?: number;
    watermarkWidth?: number;
    watermarkOpacity?: number;
    position?: position;
    downloadOnComplete?: boolean;
    onSuccess?: ({ base64, file }: onSuccessProps) => void;
    onError?: ({ errorMessage }: onErrorProps) => void;
    onStart?: () => void;
};
export type useGIFwatermarkReturn = {
    base64: Maybe<base64>;
    gifFile: Maybe<File>;
    apply: () => void;
    reset: () => void;
    download: () => void;
    status: statusType;
};
export type createGIFobj = {
    error: boolean;
    errorCode: string;
    errorMsg: string;
    image: base64;
};
export {};
