import OutlineDraftFormatBtn from './OutlineDraftFormatBtn';
import FormDialog from '../../../../components/toggleModalComponents/ChatbotModalComponent';

export const Header = (): JSX.Element => {
    return (
        <div className='absolute w-fit h-fit top-[15px] right-[20px] overflow-auto'>
            <FormDialog draft1stOutlineTypeBtnElem={<OutlineDraftFormatBtn />} />
        </div>
    )
}