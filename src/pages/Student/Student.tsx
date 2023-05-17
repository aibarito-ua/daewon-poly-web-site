import React from 'react';
import { MyPage } from './MyPage';
import { Portfolio } from './Portfolio';
import { EssayWriting } from './EssayWriting';

export const Student = () => {


    return (
        <div>
            학생 홈
            {/* My Page */}
            <MyPage></MyPage>
            {/* Essay Writing */}
            <EssayWriting></EssayWriting>
            {/* Portfolio */}
            <Portfolio></Portfolio>

        </div>
    )
}