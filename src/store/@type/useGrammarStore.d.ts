interface IUseGrammarStore {
    grammarAll:any;
    grammarTitle: any;
    grammarBody: any;
    setGrammarTitle: (title:any) => void;
    setGrammarBody: (body:any) => void;
    setGrammarAll: (data:any) => void;

    resultTitle: TGrammarResDiff[][][][];
    resultBody: TGrammarResponseResult[];
    setGrammarResult: (data:any) =>{
        resultTitle: TGrammarResDiff[][][][],
        resultBody: TGrammarResponseResult[]
    };
    setGrammarResultInit: ()=>void;

    grammarOrigin: TGrammarResponse[];
    setGrammarOrigin: (data:any) => {
        grammarOrigin: TGrammarResponse,
        resultTitle: TGrammarResDiff[][][][],
        resultBody: TGrammarResponseResult[]
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

type TGrammarResponse = {
    // default compareData
    origin_data: TGrammarResOriginData[];
    // after compared data
    result_body: TGrammarResponseResult[];
    result_title: TGrammarResDiff[][][][];
}
type TGrammarResOriginData = {
    name:string,
    origin_text: string,
    change_text: string
}
type TGrammarResponseResult = {
    name:string,
    order_index:number,
    data: TGrammarResDiff[][][][]
}
type TGrammarResDiff = {
    // type은 default-> -1,0,1, stu 선택 후, 2를 push.
    type: number,
    // target word
    word: string,
    // punctuation, spelling, grammar
    correction_reason: string[],
    // client for map ->xml tag key
    key: string
}