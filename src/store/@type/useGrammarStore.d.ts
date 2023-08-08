interface IUseGrammarStore {
    grammarAll:any;
    grammarTitle: any;
    grammarBody: any;
    setGrammarTitle: (title:any) => void;
    setGrammarBody: (body:any) => void;
    setGrammarAll: (data:any) => void;

    resultTitle: Diff[][][][];
    resultBody: Diff[][][][];
    setGrammarResult: (data:any) =>{
        resultTitle: Diff[][][][],
        resultBody: Diff[][][][]
    };
    setGrammarResultInit: ()=>void;

    grammarOrigin: TGrammarData[];
    setGrammarOrigin: (data:any) => {
        grammarOrigin: TGrammarData[],
        resultTitle: Diff[][][][],
        resultBody: Diff[][][][]
    }
    

    // bodyTags: Diff[][][][];
    // resetBodyTagsInit: any;
    // setBodyTags: (bodyTags:any)=>void;

    // text data
    returnData: {
        change_text_array:string[],
        origin_text_array:string[]
    }[]
}
type TGrammarData = Diff[][][][];