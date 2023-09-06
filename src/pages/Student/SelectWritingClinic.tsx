import React from 'react';
import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import {Button} from 'flowbite-react'
import { CommonFunctions } from "../../util/common/commonFunctions";
import useNavStore from '../../store/useNavStore';
import { commonIconSvgs } from '../../util/svgs/commonIconsSvg';
import SmallHead from '../../components/commonComponents/SmallHeadComponent/SmallHead';
import { callUnitInfobyStudent } from './api/EssayWriting.api';
import useSparkWritingStore from '../../store/useSparkWritingStore';
import { useComponentWillMount } from '../../hooks/useEffectOnce';

const SelectWritingClinic = () => {
    const [buttonActive, setButtonActive] = React.useState<boolean>(false);
    const {role, userInfo} = useLoginStore();
    const {secondGenerationOpen} = useNavStore();
    const {
        setSparkWritingDataFromAPI
    } = useSparkWritingStore()
    const navigate = useNavigate();
    const beforeRenderedFn = async () => {
        await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName).then((response) => {
            if (response.book_name!=='') {
                setButtonActive(true)
            }
            setSparkWritingDataFromAPI(response.units, response.book_name)
            return response;
        });
    }
    useComponentWillMount(()=>{
        beforeRenderedFn();
    })
    
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Writing Activity'/>
            <div className='flex flex-1 flex-col justify-center w-full h-2/3 pt-[141px] px-[4vw]'>
                <div className="flex flex-1 pr-[2rem] gap-[5%] w-full justify-center">
                    <commonIconSvgs.SparkWritingEnterButton className={buttonActive? 'select-writing-item-button': 'hidden'} onClick={()=>{
                        if (buttonActive) {
                            CommonFunctions.goLink( 'WritingClinic/SparkWriting', navigate, role)}
                        }
                    }
                    ><span className="text-xl select-none">{'Spark Writing'}</span></commonIconSvgs.SparkWritingEnterButton>
                    <Button className={`select-writing-item-button ${secondGenerationOpen? '':'hidden'}`}><span className="text-xl">{'Free Writing'}</span></Button>
                </div>
            </div>
        </section>
    )
}
export default SelectWritingClinic;