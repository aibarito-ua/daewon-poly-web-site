import React from 'react'
import useNavStore from "../../store/useNavStore";
import useLoginStore from '../../store/useLoginStore';
import { useNavigate } from 'react-router-dom';
import { CommonFunctions } from '../../util/common/commonFunctions';

type INavItems = {
    [key in TRole]: {
        selectedMenu: {path:string, label: string}[]
    };
};
export const navItems:INavItems = {
    admin: {
        selectedMenu: [
            {path: '', label: ''}
        ]
    },
    logout: {
        selectedMenu: []
    },
    student: {
        selectedMenu: [
            {path: "WritingClinic", label: 'Writing Clinic'},
            {path: "StudentProgress", label: 'My Progress'},
            {path: "StudentReport", label: 'My Report'},
            {path: "StudentPortfolio", label: 'My Portfolio'},
            {path: "StudentHome", label: ''}
        ]
    },
    teacher: {
        selectedMenu: [
            
        ]
    }
}
export const Nav = () => {
    const {role } = useLoginStore()
    const navigate = useNavigate();
    const {sidebarFlagged, setSidebarFlagged, topNavHiddenFlagged, subNavTitleString, subRightNavTitleString} = useNavStore();
    const onClickFlaggedSidebar = (e:React.MouseEvent) => {
        e.preventDefault();
        setSidebarFlagged(!sidebarFlagged)
    }
    const svgHome =(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
        strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    )
    
    return (
    <div className=''>
        <nav className={`fixed top-0 z-50 w-full max-h-[10vh] bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${topNavHiddenFlagged ? 'hidden': ''}`}>
            <div className="px-[1vw] py-[2vh]">
                <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                    <button type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={(e)=>onClickFlaggedSidebar(e)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <a href="#!" className="flex ml-2 md:mr-24">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="FlowBite Logo" /> */}
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">POLY</span>
                    </a>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center ml-3">
                        <div>
                        {/* <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="true" data-dropdown-toggle="dropdown-user">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                        </button> */}
                        </div>
                        <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                        
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </nav>
        <nav className={`fixed top-0 z-50 w-full max-h-[10vh] bg-gray-200 border-b border-gray-200 ${topNavHiddenFlagged ? '': 'hidden'}`}>
            <div className='flex flex-row px-[1vw]'>
            <div className='flex flex-1 gap-4 p-4 content-center items-center'>
                <div onClick={()=>CommonFunctions.goLink('WritingClinic',navigate, role)}>{svgHome}</div>
                <div className='font-bold text-2xl p-2'>{subNavTitleString}</div>
            </div>
            {subRightNavTitleString !== '' && 
                <div className='flex flex-1 flex-row-reverse gap-4 px-4 content-center items-center'>
                    <p className='font-bold text-xl'>{subRightNavTitleString}</p>
                </div>
            }
            </div>
        </nav>
    </div>
    )
}
