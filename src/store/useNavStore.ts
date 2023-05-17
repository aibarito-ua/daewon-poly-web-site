import { create } from 'zustand';

const useNavStore = create<INavItem>((set) => ({
    selectedMenu: "",
    setSelectMenu: (selectNumber: string) => {
        console.log("selectNumber :::", selectNumber)
        set(()=>({selectedMenu:selectNumber}))
    }
}))

export default useNavStore;