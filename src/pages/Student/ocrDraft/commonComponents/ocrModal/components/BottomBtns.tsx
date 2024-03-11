import { useCallback, useRef} from "react";
import { RETAKE_BTN_ENABLED } from "../consts";

interface IProps {
  nextBtnDisabled: boolean;
  fullScreen: boolean;
  onChangeImage: (file: File) => void;
  onClickNext: () => void;
}

export default function BottomBtns(props: IProps) {
  const { nextBtnDisabled, fullScreen, onChangeImage, onClickNext } = props;

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleChangeImgFile = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files || evt.target.files.length === 0) return;

    onChangeImage(evt.target.files[0]);
  }, [onChangeImage]);

  const handleRetake = useCallback(() => inputFileRef.current?.click(), []);

  const handleNext = useCallback(() => onClickNext(), [onClickNext]);

  return (
    <div className={fullScreen ? 'ocr-modal-pad-footer-box' : 'ocr-modal-pc-footer-box'}>
      {fullScreen && RETAKE_BTN_ENABLED && <button className='ocr-modal-footer-btn' onClick={handleRetake}>
        {'Scan again'}
        <input
          ref={inputFileRef}
          type='file'
          hidden
          accept='image/jpeg, image/png'
          capture="environment"
          onChange={handleChangeImgFile}
        />
      </button>}
      <button
        className={nextBtnDisabled ? 'save-button' : 'ocr-modal-footer-btn'}
        disabled={nextBtnDisabled}
        onClick={handleNext}
      >
        {'Next'}
      </button>
    </div>
  );
}
