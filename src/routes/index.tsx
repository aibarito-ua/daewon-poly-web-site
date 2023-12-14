import React from 'react'
import { Routes, Route } from 'react-router-dom';
// import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import EssayWriting from '../pages/Student/EssayWriting';
// import { MyPage } from '../pages/Student/MyPage';
import { Portfolio } from '../pages/Student/Portfolio';
import WebViewWrap from '../pages/WebViewWrap';
import useLoginStore from '../store/useLoginStore';
import PrivateRoute from './PrivateRoute';
// import { Admin } from '../pages/Admin';
// import { Student } from '../pages/Student/Student';
// import { Teacher } from '../pages/Teacher';
import {routeValues} from './routeValues';
import SelectWritingClinic from '../pages/Student/SelectWritingClinic';
import SelectUnit from '../pages/Student/SelectUnit';
import PreviewSparkWriting from '../pages/Student/PreviewSparkWriting';
import Report from '../pages/Student/Report';
import { Nav } from '../components/layoutComponents/Nav';
import NavAside from '../components/layoutComponents/Navs/NavAside';
import CommonAlertModalComponent from '../components/toggleModalComponents/CommonAlertModalComponent';
import StandbyScreen from '../components/commonComponents/standby/StandbyScreen';
import Progress from '../pages/Student/Progress';
import ReturnFeedbackModalComponent from '../components/toggleModalComponents/ReturnFeedbackModalComponent';
import PortfolioModalComponent from '../components/toggleModalComponents/PortfolioModalComponent';
import UserInfoModalComponent from '../components/toggleModalComponents/UserInfoModalComponent';
import MaintenanceAlertModalComponent from '../components/toggleModalComponents/MaintenanceAlertModalComponent';
import { logoutAPI } from '../pages/Student/api/Login.api';
import ErrorBoundary from './errorBoundary';


export default function Roter() {
    const { role, isOpen, maintenanceData, setMaintenanceData, userInfo, device_id, isMobile, setLogoutUser } = useLoginStore();
    const logoutFn = async () => {
        await logoutAPI(userInfo.userCode, device_id)
        if(isMobile)
            window.ReactNativeWebView.postMessage(JSON.stringify('logout'))
        else if(window.navigator.userAgent.toLowerCase().indexOf('electron') > -1) {
            (window as any).api.toElectron.send('clear')
        }
        setLogoutUser();
    }
    React.useEffect(()=>{
        const stDate = maintenanceData.data.start_date;
        const edDate = maintenanceData.data.end_date;
        if (stDate !== '' && edDate !== '' ) {
            // real time check maintenance start/end
            let timerId = setInterval(()=>{
                const currentTime = new Date();

                const offset = 1000 * 60 * 60 * 9;
                // start
                const startDate = new Date(stDate);
                const start_date = startDate.getTime() + offset;
                const start_current_gap_timeNumber = start_date - currentTime.getTime()
                const startCurrentGapTime_min = Math.floor(start_current_gap_timeNumber/ ( 60*1000));
                const gap_st = Math.floor(start_current_gap_timeNumber)
                // console.log('gap_st= ',gap_st)
                
                if (start_current_gap_timeNumber <= 0) {
                    // 시작
                    let dumpMaintenanceData:TMaintenanceData = JSON.parse(JSON.stringify(maintenanceData));
                    // end time calculate
                    const endDate = new Date(edDate)
                    const end_date = endDate.getTime() + offset;
                    const end_current_gap_timeNumber = end_date - currentTime.getTime();
                    const gap_end = Math.floor(end_current_gap_timeNumber);
                    // console.log('gap ed =',gap_end)
                    if (gap_end >= 0) {
                        // maintenance 진행중
                        if (role !== 'logout') {
                            logoutFn()
                        }
                        dumpMaintenanceData.open = true;
                        setMaintenanceData(dumpMaintenanceData)
                    } else {
                        // 종료
                        dumpMaintenanceData.open = false;
                        dumpMaintenanceData.alertTitle = '';
                        dumpMaintenanceData.data.end_date = '';
                        dumpMaintenanceData.data.start_date = '';
                        setMaintenanceData(dumpMaintenanceData)
                    }
                } else {
                    if (startCurrentGapTime_min === 30) {
                        // 30 분 전
                    } else if (startCurrentGapTime_min === 10) {
                        // 10분 전
                    }
                }
            },1000);
    
            return () => clearTimeout(timerId);
        }
    })
    const publicRoutes = () => {
        const routeValue = routeValues.publicRoutes;
        // 각 권한별 기본 페이지
        // const mainPage = role === 'logout' ? <Login /> : (
        //     role === 'admin' ? <Admin /> : (
        //         role === 'teacher' ? <Teacher /> : <SelectWritingClinic />
        //     )
        // );
        const mainPage = role === 'logout' ? <Login /> : <SelectWritingClinic />;
        // const mainPage = <Home />
        return (
            <Route element={<PrivateRoute authenticated={false} />}>
                {routeValue.map((publicRoute, publicIndex) => {
                    if (publicRoute.path === '/') {
                        return <Route key={publicIndex} path={publicRoute.path} element={mainPage}/>
                    } else {
                        return <Route key={publicIndex} path={publicRoute.path} element={publicRoute.element}/>
                    }
                })}
            </Route>
        )
    }
    // const privateRoutes = () => {
    //     const routeValue = routeValues.privateRoutes;

    // }
    
    return (
        <div className={window.navigator.userAgent.toLowerCase().indexOf('electron') > -1 ? 'container-wrapper-electron relative':'container-wrapper relative'}>
            {role!=='logout' && <Nav />}
            {role!=='logout' && <NavAside />}
            <div className="max-display-screen">
                <ErrorBoundary>
                {isOpen && <Login />}
                <Routes>
                    {/* No Login Pages */}
                    {publicRoutes()}
                    {/* Admin 전용 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='admin' />} >
                        
                    </Route>
                    {/* Teacher 전용 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='teacher' />} >

                    </Route>
                    {/* 학생 페이지 */}
                    <Route element={<PrivateRoute authenticated={true} pageAuth='student' />} >
                        <Route path='/student/WritingClinic' element={<SelectWritingClinic />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting/:unit/:draft' element={ <EssayWriting />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting' element={ <SelectUnit />}></Route>
                        <Route path='/student/Progress' element={<Progress />}></Route>
                        <Route path='/student/Report' element={<Report />}></Route>
                        <Route path='/student/Portfolio' element={<Portfolio />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting/:unit/:draft/Preview' element={<PreviewSparkWriting />}></Route>
                        <Route path='/student/WritingClinic/SparkWriting/:unit/:draft/Preview/:status' element={<PreviewSparkWriting />}></Route>

                    </Route>
                    {/* <Route path='' element={ }></Route> */}

                    {/* webview 전용 page */}
                    <Route path='/webTest' element={<WebViewWrap />}></Route>
                </Routes>
                <MaintenanceAlertModalComponent />
                <CommonAlertModalComponent />
                <StandbyScreen />
                <PortfolioModalComponent />
                <ReturnFeedbackModalComponent />
                <UserInfoModalComponent />
                </ErrorBoundary>
            </div>
          
        </div>

    )
}