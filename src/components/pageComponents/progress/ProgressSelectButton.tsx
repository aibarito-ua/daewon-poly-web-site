import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useLoginStore from '../../../store/useLoginStore';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    // 'label + &': {
    //   marginTop: theme.spacing(3),
    // },
    '& .MuiInputBase-input': {
        borderRadius: '15px',
        position: 'relative',
        border: '1px solid #ced4da',
        fontFamily: 'Noto Sans CJK KR',
        fontWeight: 400,
        fontSize: '18px',
        textAlign: 'left',
        backgroundColor: '#fff',
      // Use the system font instead of the default Roboto font.
    //   fontFamily: [
    //     '-apple-system',
    //     'BlinkMacSystemFont',
    //     '"Segoe UI"',
    //     'Roboto',
    //     '"Helvetica Neue"',
    //     'Arial',
    //     'sans-serif',
    //     '"Apple Color Emoji"',
    //     '"Segoe UI Emoji"',
    //     '"Segoe UI Symbol"',
    //   ].join(','),
    //   '&:focus': {
    //     borderRadius: 4,
    //     borderColor: '#80bdff',
    //     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    //   },
    },
}));

export default function SelectLabels() {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState<boolean>(false);
  const {userInfo} = useLoginStore();
    const levels = [userInfo.courseName]
    
  const handleChange = (event: SelectChangeEvent) => {
    console.log('user info =',userInfo)
    setValue(event.target.value);
  };

  return (
    <div className='flex items-center h-[45px] '>
      <FormControl sx={{ width: '240px', height: '45px'}}>
        <Select
            sx={{
                padding:0,
                '& .MuiInputBase-input': {
                    // borderRadius: '15px',
                    // position: 'relative',
                    // border: '1px solid #ced4da',
                    // fontFamily: 'Noto Sans CJK KR',
                    //   fontWeight: 400,
                    //   fontSize: '18px',
                    //   textAlign: 'left',
                    // padding: '16px 0px 16px 14px',
                    // backgroundColor: '#fff',
                    color: value===''? '#aeaeae': '#222',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '45px'
                },
                '& .MuiSelect-select': {
                    height: '45px',
                    paddingLeft: 0,
                    paddingY: 0
                }
            }}
            value={value}
            disabled={levels.length===1?true:false}
            onChange={handleChange}
            displayEmpty
            open={open}
        //   placeholder='Please select a level'
            input={<BootstrapInput/>}
            onOpen={()=>setOpen(true)}
            onClose={()=>setOpen(false)}
            IconComponent={open? progressIcons.LevelSelectToggleUpArrowIcon: progressIcons.LevelSelectToggleDownArrowIcon}
        >
            {(!open && value === '') ? <MenuItem value=''>Please select a level</MenuItem>:null}

            {levels.map((levelItem, levelIndex)=>{
                return <MenuItem key={levelIndex} value={levelItem}>{levelItem}</MenuItem>

            })}
        </Select>
      </FormControl>
    </div>
  );
}