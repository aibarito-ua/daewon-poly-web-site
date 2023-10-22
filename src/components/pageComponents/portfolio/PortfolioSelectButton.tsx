import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import usePortfolioStore from '../../../store/usePortfolioStore';

export default function PortfolioSelectButton(props:{
  isUse: "semester"|"level";
}) {
  const {
    isUse,
  } = props;
  
  const [open, setOpen] = React.useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = React.useState<boolean>(false);
  const {
    semesters, selectSemester, setSelectSemester,
    levels, selectLevel, setSelectLevel,
    forceReadOnlyPortfolioSelectBox
  } = usePortfolioStore();
  React.useEffect(()=>{
    if (levels.length>0) {
      if (levels.length===1) {
        setIsReadOnly(true);
      } else {
        setIsReadOnly(false)
      }
    } else {
      setIsReadOnly(true);
    }
  }, [selectLevel, selectSemester])
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
      <FormControl sx={{ 
        width: '240px', height: '45px', minHeight:'45px', m: 1, 
        cursor: isReadOnly ? 'not-allowed': 'pointer'
        }} >
        <Select
            sx={
              {
                color: isReadOnly? '#aeaeae': '#222',
                height: '45px',
                backgroundColor: '#fff',
                borderRadius: '15px',
                paddingLeft: '14px',
                '& .MuiInputBase-input': {
                  padding:0
                },
                '& .MuiSelect-icon': {
                  right: '14px'
                },
                '& .MuiSelect-select': {
                  textAlign: 'left',
                  paddingLeft: '14px'
                },
                '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                  padding:0,
                }
              }
            }
          
            
            placeholder='test'
            value={selectValue()}
            disabled={isReadOnly}
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
            <MenuItem disabled={isReadOnly} sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>
            {isUse==='level' && levels.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.level}>{dataItem.level}</MenuItem>
            })}
            {isUse==='semester' && semesters.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.label}>{dataItem.label}</MenuItem>
            })}
        </Select>
      </FormControl>
    </div>
  );
}