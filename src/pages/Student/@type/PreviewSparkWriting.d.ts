// body grammar value states
type TbodyHistory = Diff[][][][];
type TBodyHistorys = {
    title: {
        past: TbodyHistory[],
        present: TbodyHistory,
        future: TbodyHistory[]
    },
    body: {
        past: TbodyHistory[],
        present: TbodyHistory,
        future: TbodyHistory[]
    }
}