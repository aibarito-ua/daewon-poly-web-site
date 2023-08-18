import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: '15px',
        position: 'relative',
        border: '1px solid #ced4da',
        fontFamily: 'Noto Sans CJK KR',
        fontWeight: 400,
        fontSize: '18px',
        textAlign: 'left',
        backgroundColor: '#fff',
    },
}));

export default function ReportSelectButton(props:{
  data:any[],
  useDefaultEmptyValueFlag?:boolean,
  disabledFlag?:boolean,
}) {
  const {
    data,
    useDefaultEmptyValueFlag,
    disabledFlag,
  } = props;
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState<boolean>(false);
  
  const handleChange = (event: SelectChangeEvent) => {
    console.log('user info =',data)
    setValue(event.target.value);
  };

  return (
    <div className='flex items-center h-[45px] '>
      <FormControl sx={{ width: '240px', height: '45px'}}>
        <Select
            sx={{
                padding:0,
                '& .MuiInputBase-input': {
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
            disabled={disabledFlag?true:false}
            onChange={handleChange}
            displayEmpty={disabledFlag}
            open={open}
            input={<BootstrapInput/>}
            onOpen={()=>setOpen(true)}
            onClose={()=>setOpen(false)}
            IconComponent={open? progressIcons.LevelSelectToggleUpArrowIcon: progressIcons.LevelSelectToggleDownArrowIcon}
        >
            {(!open && value === '') ? <MenuItem value=''>Please select a level</MenuItem>:null}

            {data.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} value={dataItem}>{dataItem}</MenuItem>

            })}
        </Select>
      </FormControl>
    </div>
  );
}