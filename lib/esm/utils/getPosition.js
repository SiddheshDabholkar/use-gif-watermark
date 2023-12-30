export var getPosition = function (_a) {
    var position = _a.position, waterMarkOffset = _a.waterMarkOffset, height = _a.height, width = _a.width, canvas = _a.canvas;
    var positionX = waterMarkOffset;
    var positionY = canvas.height - height - waterMarkOffset;
    if (position === "bottomright") {
        positionX = canvas.width - width - waterMarkOffset;
        positionY = canvas.height - height - waterMarkOffset;
    }
    else if (position === "bottomleft") {
        positionX = waterMarkOffset;
        positionY = canvas.height - height - waterMarkOffset;
    }
    else if (position === "topright") {
        positionX = canvas.width - width - waterMarkOffset;
        positionY = waterMarkOffset;
    }
    else if (position === "topleft") {
        positionX = waterMarkOffset;
        positionY = waterMarkOffset;
    }
    return {
        positionX: positionX,
        positionY: positionY,
    };
};
