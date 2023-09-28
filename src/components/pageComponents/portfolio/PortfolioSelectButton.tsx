import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import usePortfolioStore from '../../../store/usePortfolioStore';

export default function PortfolioSelectButton(props:{
  isUse: "semester"|"level";
  disabled:boolean;
}) {
  const {
    disabled, 
    isUse,
  } = props;
  
  const [open, setOpen] = React.useState<boolean>(false);
  
  const selectValue = () => {
    if (isUse==='level') {
      return selectLevel;
    } else if (isUse==='semester') {
      return selectSemester
    }
  }
  const setSelectValue = (value:string) => {
    
    if (isUse==='level') {
      setSelectLevel(value)
    } else if (isUse==='semester') {
      setSelectSemester(value)
    }
  }
  const {
    semesters, selectSemester, setSelectSemester,
    levels, selectLevel, setSelectLevel,
  } = usePortfolioStore();
  
  const handleChange = (event: SelectChangeEvent) => {
    const targetValue = event.target.value;
    console.log('portfolio select button targetValue =',targetValue)
    if (targetValue === '') {
      setSelectValue('')
    } else {
      setSelectValue(targetValue)
    }
  };


  return (
    <div className='flex items-center h-[45px] ' >
      <FormControl sx={{ width: '240px', height: '45px', minHeight:'45px', m: 1}} >
        <Select
            sx={{
              color: selectValue()===''? '#aeaeae': '#222',
              height: '45px',
              backgroundColor: '#fff',
              borderRadius: '15px',
              '& .MuiInputBase-input': {
                padding:0
              },
              '& .MuiSelect-icon': {
                right: '14px'
              }
            }}
            
            placeholder='test'
            value={selectValue()}
            disabled={disabled}
            onChange={handleChange}
            displayEmpty={true}
            open={open}
            renderValue={(selected) => {
              console.log('selected !!=',selected)
              if (selected==="") {
                if (isUse==='level') {
                  return 'Please select a level'
                } else {
                  return 'Please select a semester';
                };
              }else return selected
            }}
            
            onOpen={()=>setOpen(true)}
            onClose={()=>setOpen(false)}
            
            IconComponent={open? progressIcons.LevelSelectToggleUpArrowIcon: progressIcons.LevelSelectToggleDownArrowIcon}
            
        >
            <MenuItem disabled={disabled} sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>
            {isUse==='level' && levels.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.label}>{dataItem.label}</MenuItem>
            })}
            {isUse==='semester' && semesters.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.label}>{dataItem.label}</MenuItem>
            })}
        </Select>
      </FormControl>
    </div>
  );
}