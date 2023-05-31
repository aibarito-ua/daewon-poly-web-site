import React from 'react';
import { useNavigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";
import {Button} from 'flowbite-react'
import { CommonFunctions } from "../../util/common/commonFunctions";

const SelectEssayWriting = () => {
    const {role} = useLoginStore();
    const navigate = useNavigate();

    return (
        <section className="section-common-layout" >
            <div className="flex flex-1 max-sm:flex-col sm:px-[10%] gap-[5%] w-screen min-h-full justify-center text-center align-middle">
                <Button className="select-writing-item-button" onClick={()=>CommonFunctions.goLink( 'EssayWritingSelectTopic', navigate, role)}><span className="text-3xl">{'Essay Writing'}</span></Button>
                <Button className="select-writing-item-button"><span className="text-3xl">{'Essay Writing Clinic'}</span></Button>
            </div>
        </section>
    )
}
export default SelectEssayWriting;