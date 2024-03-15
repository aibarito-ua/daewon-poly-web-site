import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "../../../css/ReactCrop.css";
import BottomBtns from "./BottomBtns";
import { tryGetOcrText } from "../../../controller/OcrController";
import { MAX_IMAGE_PAD_HEIGHT, MAX_IMAGE_PAD_WIDTH, MAX_IMAGE_PC_HEIGHT, MAX_IMAGE_PC_WIDTH } from "../consts";
import Header from "./Header";

const MIN_CROPABLE_SIZE = 100;

enum ImgRotationDegree {
  DEGREE_0 = 0,
  DEGREE_90 = 90,
  DEGREE_180 = 180,
  DEGREE_270 = 270,
}

interface IProps {
  fullScreen: boolean;
  originImgUrl: string;
  onChangeImage: (file: File) => void;
  onConvertOcrText: (croppedImgUrl: string, ocrText: string) => void;
  onClose: () => void;
}

export default function OcrImgCropArea(props: IProps) {
  const { fullScreen, originImgUrl, onChangeImage, onConvertOcrText, onClose } = props;

  const [imgSrc, setImgSrc] = useState<string>(originImgUrl);
  const [crop, setCrop] = useState<Crop>(makeInitCrop());
  const [croppedBlob, setCroppedBlob] = useState<Blob | undefined>();
  const rotationType = useRef<ImgRotationDegree>(ImgRotationDegree.DEGREE_0);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(originImgUrl);
  }, [originImgUrl]);

  const handleLoadImg = useCallback((evt: React.SyntheticEvent<HTMLImageElement, Event>) => {

    const { width, height } = evt.currentTarget;
    const pxCrop: PixelCrop = {
      x: 0,
      y: 0,
      width,
      height,
      unit: "px",
    };
    setCrop(pxCrop);
    imgCropToBlob(evt.currentTarget, pxCrop).then((blob) => setCroppedBlob(blob));
  }, []);

  const handleChangeImgCrop = useCallback((crop: PixelCrop) => {
    setCrop(crop);
  }, []);

  const handleCompleteImgCrop = useCallback((crop: PixelCrop) => {
    if (!imgRef.current || crop.height === 0 || crop.width === 0) return;

    imgCropToBlob(imgRef.current, crop).then((blob) => setCroppedBlob(blob));
  }, []);

  const handleClickNext = useCallback(async () => {
    if (!croppedBlob) return;

    const ocrText = await tryGetOcrText(croppedBlob);
    if (ocrText === undefined) return;

    onConvertOcrText(URL.createObjectURL(croppedBlob), ocrText);
  }, [croppedBlob, onConvertOcrText]);

  const handleClickRotate = useCallback(() => {
    rotationType.current = (rotationType.current + 90) % 360;
    rotateBase64Image(originImgUrl, rotationType.current).then((base64) => setImgSrc(base64));
  }, [originImgUrl]);

  const imageHeight = fullScreen ?  MAX_IMAGE_PAD_HEIGHT : MAX_IMAGE_PC_HEIGHT;
  const imageWidth = fullScreen ?  MAX_IMAGE_PAD_WIDTH : MAX_IMAGE_PC_WIDTH;
  return (
    <>
      <Header fullScreen={fullScreen} guideText={'Select the area you want to convert.'} onClose={onClose} onClickRotate={handleClickRotate}/>
      <div className={fullScreen ? 'ocr-modal-pad-body-box' : 'ocr-modal-pc-body-box'}>
        <div className={`flex flex-1 justify-center items-center w-[${imageWidth}px] h-[${imageHeight}px]`}>
          <ReactCrop
            crop={crop}
            ruleOfThirds={true}
            minWidth={MIN_CROPABLE_SIZE}
            minHeight={MIN_CROPABLE_SIZE}
            onChange={handleChangeImgCrop}
            onComplete={handleCompleteImgCrop}
          >
            <img src={imgSrc}
              alt="Crop me"
              ref={imgRef}
              onLoad={handleLoadImg}
            />
          </ReactCrop>
          </div>
      </div>
      <BottomBtns
        nextBtnDisabled={false}
        fullScreen={fullScreen}
        onChangeImage={onChangeImage}
        onClickNext={handleClickNext}
      />
    </>
  );
}


function makeInitCrop(): Crop {
  return {
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };
}

function imgCropToBlob(imgElem: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("No 2d context"));
      return;
    }

    const { naturalWidth, naturalHeight, width, height } = imgElem;

    const scaleX = naturalWidth / width;
    const scaleY = naturalHeight / height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      imgElem,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No Blob"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      1.0
    );
  });
}

function rotateBase64Image(originBase64: string, rotType: ImgRotationDegree): Promise<string> {
  return new Promise((resolve, reject) => {
    if (rotType === ImgRotationDegree.DEGREE_0) {
      resolve(originBase64);
      return;
    }

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    if (!ctx)  {
      reject(new Error("No ctx"));
      return;
    }

    var img = new Image();
    img.src = originBase64;

    var image = new Image();
    image.src = originBase64;
    image.onload = function () {
      if (!ctx) return;

      if (rotType === ImgRotationDegree.DEGREE_90 || rotType === ImgRotationDegree.DEGREE_270) {
        canvas.height = img.width;
        canvas.width = img.height;

        // max height보다 canvas.height가 큰 경우 scale down
        if (canvas.height > MAX_IMAGE_PAD_HEIGHT) {
          const scale = MAX_IMAGE_PAD_HEIGHT / canvas.height;
          const reveredScale = canvas.height / MAX_IMAGE_PAD_HEIGHT;
          canvas.height = MAX_IMAGE_PAD_HEIGHT;
          canvas.width = img.height * scale;
          ctx.scale(scale, scale);
          ctx.rotate(rotType * Math.PI / 180);
          ctx.translate(rotType === ImgRotationDegree.DEGREE_270 ? -canvas.height * reveredScale : 0, rotType === ImgRotationDegree.DEGREE_90 ? -canvas.width * reveredScale : 0);
        } else {
          ctx.rotate(rotType * Math.PI / 180);
          ctx.translate(rotType === ImgRotationDegree.DEGREE_270 ? -canvas.height : 0, rotType === ImgRotationDegree.DEGREE_90 ? -canvas.width : 0);
        }
      } else if (rotType === ImgRotationDegree.DEGREE_180) {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.rotate(rotType * Math.PI / 180);
        ctx.translate(-canvas.width, -canvas.height);
      }

      ctx.drawImage(image, 0, 0); 
      resolve(canvas.toDataURL("image/jpeg", 100));
    };
  });
}