const GrammarResult = () => {
    
    // Render Page
    // return (
    //     <section className={`section-common-layout z-0`}>
    //         <div className='flex flex-1 flex-col w-full pt-[10vh] h-full px-14 pb-4 z-0'>
    //             {/* guide text */}
    //             <div className='flex flex-col font-bold w-full justify-start py-4 text-black h-1/12 z-0'>
    //                 {guideText.map((text:string, textIdx:number)=>{
    //                     return <p className='flex flex-1' key={'guide-text-'+textIdx}>{text}</p>
    //                 })}
    //             </div>
    //             {/* content */}
    //             <GrammarContentComponent />
    //         </div>
    //         <div className={`buttons-div`}>
    //             <button className={`save-button`} onClick={()=>{
    //                 // alert('Edit')
    //                 setGuideFlag(1)
    //                 navigate(-1);
    //                 // setShowSaveModal(true)
    //                 // callbackCheckValues()
    //             }}>Edit</button>

    //             <button className={`${openAIProofreadingButton?'disabled-button':'not-disabled-button'}`} 
    //             // disabled={openAIProofreadingButton}
    //             onClick={()=>AIProofreadingOnClickEvent()}>AI Proofreading</button>

    //             <button className={`save-button ${openSubmitButton?'':'hidden'}`} onClick={()=>{
    //                 alert('Submit')
    //                 // callbackCheckValues()
    //                 // setShowPreviewModal(true)
    //             }}>Submit</button>
    //         </div>
    //         {/* AI Proofreading modal popup */}
    //         <PopupModalComponent 
    //             Message={countofUseAIProofreading===2 ? ['You have already used AI proofreading twice.']: [
    //                 'You can only use AI proofreading twice. Are you sure you want to proceed now?',
    //                 <p className='' key="show-count-p-tag">{`${countofUseAIProofreading}/2`}</p>
    //             ]}
    //             NoMessage={countofUseAIProofreading===2 ? '':'Not Yet'}
    //             YesMessage={countofUseAIProofreading===2 ? 'OK':'Yes'}
    //             onClickYes={countofUseAIProofreading===2 ? AIProofreadingClose: async ()=> await AIProofreadingYesOnClick()}
    //             onClose={AIProofreadingClose}
    //             showFlag={showAIProofreadingModal}
    //         />
    //         {/* Submit modal popup */}
    //         <PopupModalComponent 
    //             Message={[
    //                 ''
    //             ]}
    //             NoMessage=''
    //             YesMessage=''
    //             onClickYes={()=>{}}
    //             onClose={()=>{}}
    //             showFlag={false}
    //         />
    //     </section>
    // )
}
export default GrammarResult;