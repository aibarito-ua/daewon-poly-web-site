import {create} from 'zustand'
interface IUseProgressPageStore {
    progressTabActiveIndex: number;
    setProgressTabActiveIndex: (index:number) => void;
}
const useProgressPageStore = create<IUseProgressPageStore>((set, get) => ({
    // tab button
    progressTabActiveIndex: 0,
    setProgressTabActiveIndex: (index) => {
        set(()=>({progressTabActiveIndex:index}))
    },
    

}))

export default useProgressPageStore;