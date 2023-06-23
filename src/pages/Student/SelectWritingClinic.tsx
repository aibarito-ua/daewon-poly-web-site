import React from 'react';
import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import {Button} from 'flowbite-react'
import { CommonFunctions } from "../../util/common/commonFunctions";
import useNavStore from '../../store/useNavStore';

const SelectWritingClinic = () => {
    const {role} = useLoginStore();
    const {secondGenerationOpen} = useNavStore()
    const navigate = useNavigate();

    return (
        <section className="section-common-layout use-nav-aside" >
            <div className='flex-1 flex-row justify-center content-center h-max'>
                <p className='text-3xl font-bold text-black pb-4'>{'Writing Clinic'}</p>
            </div>
            <div className='flex flex-1 flex-col justify-center w-full h-2/3 pt-12 px-[4vw]'>
                <div className="flex flex-1 pr-[2rem] gap-[5%] w-full justify-center">
                    <Button className="select-writing-item-button" onClick={()=>CommonFunctions.goLink( 'WritingClinic/SparkWriting', navigate, role)}><span className="text-xl">{'Spark Writing'}</span></Button>
                    <Button className={`select-writing-item-button ${secondGenerationOpen? '':'hidden'}`}><span className="text-xl">{'Free Writing'}</span></Button>
                </div>
            </div>
        </section>
    )
}
export default SelectWritingClinic;