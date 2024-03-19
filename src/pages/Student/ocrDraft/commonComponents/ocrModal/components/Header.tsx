interface IProps {
  fullScreen: boolean;
  guideText: string;
  onClose: () => void;
  onClickRotate?: () => void;
}

export default function Header(props: IProps) {
  const { fullScreen, guideText, onClose, onClickRotate } = props;


  return (
    <div className={fullScreen ? 'ocr-modal-pad-header-box' : 'ocr-modal-pc-header-box'}>
      {fullScreen && <div className='ocr-modal-back-btn div-to-button-hover-effect' onClick={onClose}>
        <div className="ocr-modal-back-btn-icon bg-no-repeat bg-contain" />
      </div>}
      <span className='ocr-modal-pc-header-text'>
        {guideText}
      </span>
      {!fullScreen && <button
        style={{
          width: '49px',
          height: '49px',
          padding: 0,
          position: 'absolute',
          right: '30px',
          top: '0px',
          zIndex: 1301
        }}
      >
        <div
          className='w-[49px] h-[49px] m-0 p-0 bg-modal-close-button-svg bg-contain bg-no-repeat'
          onClick={onClose}
        />
      </button>
      }
      {onClickRotate && <div className='ocr-modal-rotate-btn div-to-button-hover-effect' onClick={onClickRotate}>
        <div className="ocr-modal-rotate-btn-icon bg-no-repeat bg-contain" />
      </div>}
    </div>
  );
}