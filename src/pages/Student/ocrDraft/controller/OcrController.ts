import useControlAlertStore from "../../../../store/useControlAlertStore";
import { recognizeOpticalCharacter } from "../api/OcrApi";
import Message from "../Message";
import { OcrTextType } from "../types";

export function showOcrModal(imgFile: File, textType: OcrTextType, inputText: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        useControlAlertStore.getState().setOcrModalData({
            openFlag: true,
            textType,
            inputText,
            imgFile,
            onResOcrEvent: (convertedText: string) => {
                resolve(convertedText);
            }
        });
    });
}

export async function tryGetOcrText(blob: Blob): Promise<string | undefined> {
    useControlAlertStore.getState().setCommonStandbyScreen({ openFlag: true });

    const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    const res = await recognizeOpticalCharacter(croppedFile);

    useControlAlertStore.getState().setCommonStandbyScreen({ openFlag: false });
    if (!res.is_server_error) {
      return res.result;
    } else {
        useControlAlertStore.getState().commonAlertOpen({
            messages: res.result ? [res.result] : Message.Popups.OCR_PROCESSING_FAILED,
            priorityLevel: 2,
            messageFontFamily: 'NotoSansCJKKR',
            useOneButton: true,
            yesButtonLabel: 'OK',
        });
        return;
    }
}


export function getFileToBase64(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
        resizeImage({ imgFile: file, maxWidth, maxHeight }).then((resizedImg) => resolve(resizedImg));
    });
}

function resizeImage(params: {
    imgFile: File;
    maxWidth: number;
    maxHeight: number;
}): Promise<string> {
    const { imgFile, maxWidth, maxHeight } = params;
    const img = new Image();
    const canvas = document.createElement('canvas');

    return new Promise((resolve, reject) => {
        if (!imgFile.type.match(/image.*/)) {
            reject(new Error("Not an image"));
            return;
        }

        const resize = () => {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                } else {
                  height *= maxWidth / width;
                  width = maxWidth;
                } 
            }
            // console.log('resize', width, height);
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg");
            return dataUrl;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas not supported'));
                    return;
                }
                resolve(resize());
            };
            if (typeof e.target?.result !== 'string') {
                reject(new Error('Result is not a string'));
                    return;
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(imgFile);
    });
}