import React from 'react';
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { EssayWriting } from "../pages/Student/EssayWriting";
import { MyPage } from "../pages/Student/MyPage";
import { Portfolio } from "../pages/Student/Portfolio";
import WebViewWrap from "../pages/WebViewWrap";
import SelectEssayWriting from '../pages/Student/SelectEssayWriting';
import EssayWritingSelectTopic from '../pages/Student/EssayWritingSelectTopic';

export const routeValues = {
    // authenticated true
    privateRoutes: {
        logout: [],
        admin: [],
        teacher: [],
        student: [
            {path: '/student/EssayWriting', element: <EssayWriting />},
            {path: '/student/SelectEssayWriting', element: <SelectEssayWriting />},
            {path: '/student/EssayWritingSelectTopic', element: <EssayWritingSelectTopic />},
            {path: '/student/MyPage', element: <MyPage />},
            {path: '/student/Portfolio', element: <Portfolio />},
        ]
    },
    // authenticated false
    publicRoutes: [
        {path: '/', element: <Home />},
        {path: '/Login', element: <Login />}
    ],
    webViewRoutes: [
        {path: '/webTest', element: <WebViewWrap />},
    ]
}