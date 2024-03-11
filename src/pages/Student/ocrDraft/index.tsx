import { useEffect } from 'react';
import { Header } from './components/Header';
import useNavStore from '../../../store/useNavStore';
import { Body } from './components/Body';
import { Footer } from './components/Footer';
import useOcrDraft from './useOcrDraft';
import "./css/index.css";
import { GuideArea } from './components/GuideArea';

export const OcrDraft = (): JSX.Element => {
    const { 
        setTopNavHiddenFlagged,
        setSubNavTitleString,
        setSubRightNavTitleString,
        selectUnitInfo,
    } = useNavStore();

    const {
        saveBtnVisible,
        previewBtnVisible,
        title,
        content,
        onSave,
        onPreview,
        onChangeTitle,
        onChangeContent,
    } = useOcrDraft();

    useEffect(() => {
        // ASide 메뉴 감추기
        setTopNavHiddenFlagged(true);

        // 상단 타이틀 정보 설정
        setSubNavTitleString(`${selectUnitInfo.main} ${selectUnitInfo.sub}`);
        const rightTitle = <span>{'Step 1.'}<span className='ordinal pl-2 pr-1'>{'1st'}</span>{'Draft'}</span>
        setSubRightNavTitleString(rightTitle);
        
        return () => {
            setTopNavHiddenFlagged(false);
            setSubNavTitleString('')
            setSubRightNavTitleString('')
        }
    }, [selectUnitInfo.main, selectUnitInfo.sub, setSubNavTitleString, setSubRightNavTitleString, setTopNavHiddenFlagged]);
    
    return (
        <section className={`section-spark-writing z-0 use-nav-top bg-draft-background-image bg-no-repeat bg-cover object-contain`}>
            <Header />
            <div className='wrap-contain-spark-writing'>
                <GuideArea />
                <div className="wrap-content-spark-writing-ocr">
                    <Body title={title} content={content} onChangeTitle={onChangeTitle} onChangeContent={onChangeContent} />
                </div>
                <Footer saveBtnVisible={saveBtnVisible} previewBtnVisible={previewBtnVisible} onClickSaveBtn={onSave} onClickPreviewBtn={onPreview} />
            </div>
        </section>
    )
}