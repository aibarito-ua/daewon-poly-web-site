interface IRNPostMessage {
    req_type: TRNPostMessageReqType;
    req_data: any;
    setReqData: (req_data:TRNDataObjectType|string) => void;
    res_data: any;
    setResData: (req_data:TRNDataObjectType|string) => void;
    setPostMessage: (reqType:TRNPostMessageReqType, data:TRNDataObjectType )=>void;
    getPostMessage: (event: any) => void;

}

// RW -> 단방향 RN -> Web
// WR -> 단방향 Web -> RN
// WRW -> 양방향 Web -> RN -> Web
type TRNPostMessageReqType = "RW"|"WR"|"WRW"|""

type TRNDataObjectType = {[key:string]:any}