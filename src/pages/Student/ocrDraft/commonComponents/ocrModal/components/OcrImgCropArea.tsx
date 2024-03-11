import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
import "../../../css/ReactCrop.css";
import BottomBtns from "./BottomBtns";
import { tryGetOcrText } from "../../../controller/OcrController";
import { MAX_IMAGE_PAD_HEIGHT, MAX_IMAGE_PAD_WIDTH, MAX_IMAGE_PC_HEIGHT, MAX_IMAGE_PC_WIDTH } from "../consts";

const MIN_CROPABLE_SIZE = 100;

interface IProps {
  fullScreen: boolean;
  originImgUrl: string;
  onChangeImage: (file: File) => void;
  onConvertOcrText: (croppedImgUrl: string, ocrText: string) => void;
}

export default function OcrImgCropArea(props: IProps) {
  const { fullScreen, originImgUrl, onChangeImage, onConvertOcrText } = props;

  // const [selectedFileSrc, setSelectedFileSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>(makeInitCrop());
  const [croppedBlob, setCroppedBlob] = useState<Blob | undefined>();
  // const [scale, setScale] = useState<number>(1);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoadImg = useCallback((evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // const baseHeight = isMobile ? MAX_IMAGE_PAD_HEIGHT : MAX_IMAGE_PC_HEIGHT;
    // const scale = baseHeight / evt.currentTarget.height;
    // setScale(scale);

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

  const imageHeight = fullScreen ?  MAX_IMAGE_PAD_HEIGHT : MAX_IMAGE_PC_HEIGHT;
  const imageWidth = fullScreen ?  MAX_IMAGE_PAD_WIDTH : MAX_IMAGE_PC_WIDTH;
  return (
    <>
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
            <img src={originImgUrl}
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