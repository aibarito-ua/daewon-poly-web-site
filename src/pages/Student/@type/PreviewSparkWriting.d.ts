// body grammar value states
type TbodyHistory = TGrammarResponseResult[];
type TTitleHistory = TGrammarResDiff[][][][];
type TBodyHistorys = {
    title: {
        past: TTitleHistory[],
        present: TTitleHistory,
        future: TTitleHistory[]
    },
    body: {
        past: TbodyHistory[],
        present: TbodyHistory,
        future: TbodyHistory[]
    }
}