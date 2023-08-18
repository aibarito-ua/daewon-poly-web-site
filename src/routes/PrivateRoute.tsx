import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import useLoginStore from "../store/useLoginStore";

interface IPrivateRouteProps {
    children?: React.ReactElement;
    authenticated: boolean;
    pageAuth?: TRole
}
export default function PrivateRoute({
    authenticated, pageAuth
}:IPrivateRouteProps):any {
    const {role} = useLoginStore();
    
    if (authenticated) {
        // 권한 필요, 로그인 체크
        if (role === null || role === undefined || role === 'logout') {
            return <Navigate to="/" />
        } else {
            // admin은 전체 접근
            if (role === 'admin') {
                return <Outlet />
            } else if (role === 'teacher') {
                // teacher는 student, teacher 접근 가능
                if (pageAuth === role || pageAuth === 'student') {
                    return <Outlet />
                } else {
                    // No auth Page 
                    return <Navigate to="/" />
                }
            } else if (role === 'student') {
                // student는 student 접근 가능
                if (pageAuth === role ) {
                    return <Outlet />
                } else {
                    // No auth Page 
                    return <Navigate to="/" />
                }
            }
        }
    } else {
        // 권한 필요 x, 로그인 체크 x
        return <Outlet />
    }
}
