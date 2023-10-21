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
import useControlAlertStore from '../../store/useControlAlertStore';

const SelectWritingClinic = () => {
    const [buttonActive, setButtonActive] = React.useState<boolean>(false);
    const {role, userInfo} = useLoginStore();
    const {secondGenerationOpen} = useNavStore();
    const {
        setCommonStandbyScreen
    } = useControlAlertStore();
    const {
        setSparkWritingDataFromAPI,
        setLastUnitIndex, lastUnitIndex,
        sparkWritingBookName
    } = useSparkWritingStore()
    const navigate = useNavigate();
    const beforeRenderedFn = async () => {
        setCommonStandbyScreen({openFlag:true})
        const response = await callUnitInfobyStudent(userInfo.userCode, userInfo.courseName, userInfo.accessToken).then((response) => {
            return response;
        });
        // alert(JSON.stringify(response))
        if (response.book_name!=='') {
            setButtonActive(true)
        }
        setSparkWritingDataFromAPI(response.units, response.book_name)
        if (lastUnitIndex===0) {
            setLastUnitIndex(1);
        }
        setCommonStandbyScreen({openFlag:false})
    }
    useComponentWillMount(()=>{
        beforeRenderedFn();
    })
    
    return (
        <section className="section-common-layout use-nav-aside" >
            <SmallHead mainTitle='Writing Activity'/>
            <div className='flex flex-1 flex-col justify-center w-full h-2/3 pt-[141px] px-[4vw]'>
                <div className="flex flex-1 pr-[2rem] gap-[5%] w-full justify-center">
                    <div className={buttonActive? 'select-writing-item-button select-spark-writing-img': 'hidden'} onClick={()=>{
                        if (buttonActive) {
                            CommonFunctions.goLink( 'WritingClinic/SparkWriting', navigate, role)}
                        }
                    }
                    ></div>
                    <Button className={`select-writing-item-button ${secondGenerationOpen? '':'hidden'}`}><span className="text-xl">{'Free Writing'}</span></Button>
                </div>
            </div>
        </section>
    )
}
export default SelectWritingClinic;