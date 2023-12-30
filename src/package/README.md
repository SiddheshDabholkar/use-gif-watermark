# use-gif-watermark


### usage

*installation*

use yarn 
```
yarn add use-gif-watermark
```

*or* use npm

```
npm i use-gif-watermark
```

```
import React, { useState } from "react";
import useGifWatermark from 'use-gif-watermark'

function Example() {
  const [watermark, setWatermark] = useState(null);
  const [img, setImg] = useState(null);

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
```

### Props accepted for useGifWatermark

| prop              |required | description |accepted value|default value|
| :---------------- | :------: | :----: |       :----:      |:----: |
|gifSrc               |   True   |URL of the GIF |   URL             |       |
|watermarkSrc          |   True   | URL of the watermark|     URL          |       |
| watermarkHeight    |      False      | height of the watermark height |number                |   50       |
| watermarkWidth    |    False        | width of the watermark height |number                |   50       |
| watermarkOpacity    |     False       | opacity of the watermark height |number                |   1      |
| downloadOnComplete    |    False        | opacity of the watermark height |boolean                |   false      |
| onError    |   False         |  |boolean                |   ```({errorMessage})=>{}```      |
| onStart    |     False       |  |boolean                |    ```()=>{}```        |
| onSuccess    |    False      |  |boolean                |   ```({ base64, file })=>{base64 -> base64 of the watermark applied GIF,file -> GIF File}```        |


### values returned by useGifWatermark

| prop              | description           |value type |
| :---------------- | :----:                |   :----:  |
| base64            | base64 of the new GIF |     can be base64,null or undefined      |
| gifFile           | new GIF file   |      can be File,null or undefined      |  
| apply           | applies watermark to the GIF   |    function       |       
| reset           | resets all the value   |      function     |   
| download           | downloads the new GIF   |   function        |   
| status           | status    |    can be idle,converting,converted,failed,error       |   

### Special thanks to 
This library wouldn't have been possible without the help of 
[gifshot](https://www.npmjs.com/package/gifshot) and [gifuct-js](https://www.npmjs.com/package/@flyskywhy/gifuct-js)
