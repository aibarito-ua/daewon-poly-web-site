import React from 'react'
import useNavStore from "../../store/useNavStore";
import useLoginStore from '../../store/useLoginStore';
import { useNavigate } from 'react-router-dom';
import { CommonFunctions } from '../../util/common/commonFunctions';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';

type INavItems = {
    [key in TRole]: {
        selectedMenu: {path:string, label: string, onMenuIcon: JSX.Element, offMenuIcon: JSX.Element }[]
    };
};
export const navItems:INavItems = {
    admin: {
        selectedMenu: [
            // {path: '', label: ''}
        ]
    },
    logout: {
        selectedMenu: []
    },
    student: {
        selectedMenu: [
            {
                path: "WritingClinic", 
                label: 'Writing Activity', 
                // onMenuIcon: <commonIconSvgs.NavWritingActivityActiveOnIcon className='w-[45px] h-[45px]'/>,
                // offMenuIcon: <commonIconSvgs.NavWritingActivityActiveOffIcon className='w-[45px] h-[45px]'/>
                onMenuIcon: <div className='bg-nav-writing-activity-on bg-no-repeat bg-contain w-[45px] h-[45px]'/>,
                offMenuIcon: <div className='bg-nav-writing-activity-off bg-no-repeat bg-contain w-[45px] h-[45px]'/>
            },
            {
                path: "Progress",
                label: 'Progress',
                // onMenuIcon: <commonIconSvgs.NavProgressActiveOnIcon className='w-[45px] h-[45px]'/>,
                // offMenuIcon: <commonIconSvgs.NavProgressActiveOffIcon className='w-[45px] h-[45px]'/>
                onMenuIcon: <div className='bg-nav-progress-on bg-no-repeat bg-contain w-[45px] h-[45px]'/>,
                offMenuIcon: <div className='bg-nav-progress-off bg-no-repeat bg-contain w-[45px] h-[45px]'/>
            },
            {
                path: "Report",
                label: 'Report',
                // onMenuIcon: <commonIconSvgs.NavReportActiveOnIcon className='w-[45px] h-[45px]'/>,
                // offMenuIcon: <commonIconSvgs.NavReportActiveOffIcon className='w-[45px] h-[45px]'/>
                onMenuIcon: <div className='bg-nav-report-on bg-no-repeat bg-contain w-[45px] h-[45px]'/>,
                offMenuIcon: <div className='bg-nav-report-off bg-no-repeat bg-contain w-[45px] h-[45px]'/>
            },
            {
                path: "Portfolio",
                label: 'Portfolio',
                // onMenuIcon: <commonIconSvgs.NavPortfolioActiveOnIcon className='w-[45px] h-[45px]'/>,
                // offMenuIcon: <commonIconSvgs.NavPortfolioActiveOffIcon className='w-[45px] h-[45px]'/>
                onMenuIcon: <div className='bg-nav-portfolio-on bg-no-repeat bg-contain w-[45px] h-[45px]'/>,
                offMenuIcon: <div className='bg-nav-portfolio-off bg-no-repeat bg-contain w-[45px] h-[45px]'/>
            },
            // {path: "StudentHome", label: ''}
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
    console.log('nav stores =',subNavTitleString, subRightNavTitleString)
    
    return (
    <nav id='navMain' className=''>
        <div className={`absolute top-0 left-0 z-50 max-w-[1280px] w-full max-h-20 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
            // topNavHiddenFlagged ? 'hidden': ''
            'hidden'
            }`}>
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
        </div>
        <div className={`absolute top-0 z-50 w-full h-[111px] ${topNavHiddenFlagged ? '': 'hidden'}`}>
            <div className='btn-go-back-from-draft select-none'
            onClick={()=>CommonFunctions.goLink('WritingClinic/SparkWriting',navigate, role)}></div>

            <div className='flex flex-1 flex-row justify-center mt-[48px] select-none'>
                <div className='flex flex-col gap-[6px] justify-center items-center'>
                    <div className='draft-unit-title-head-text select-none'>{subNavTitleString}</div>
                    {subRightNavTitleString !== '' && 
                        <div className='flex flex-1 flex-row-reverse gap-4 px-4 content-center items-center select-none'>
                            <p className='draft-unit-sub-title-head-text'>{subRightNavTitleString}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    </nav>
    )
}
