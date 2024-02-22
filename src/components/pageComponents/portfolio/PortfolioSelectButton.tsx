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
    selectSemester, setSelectSemester,
    selectLevel, setSelectLevel,
    portfolioSelectBoxValue,
    // portfolioSelectFinder
  } = usePortfolioStore();
  React.useEffect(()=>{
    let readOnlyFlag = false;
    if (isUse === 'level') {
      for (let i = 0; i < portfolioSelectBoxValue.length; i++) {
        if (portfolioSelectBoxValue[i].label === selectSemester) {
          if (portfolioSelectBoxValue[i].level.length > 1) {
            // 2개 이상
            readOnlyFlag = false;
          } else {
            setSelectLevel(portfolioSelectBoxValue[i].level[0].name)
            readOnlyFlag = true;
          }
        }
      }
    } else if (isUse==='semester') {
      if (portfolioSelectBoxValue.length > 1) {
        readOnlyFlag = false;
      } else {
        readOnlyFlag = true;
      }
    }
    setIsReadOnly(readOnlyFlag)
  }, [selectLevel, selectSemester, portfolioSelectBoxValue])

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
  
  const returnDisplayValue = () => {
    let returnDisplayValue:JSX.Element[] = [];
    for (let i = 0; i < portfolioSelectBoxValue.length; i++) {
      const currentSemesterValue = portfolioSelectBoxValue[i];
      if (currentSemesterValue.label === selectSemester) {
        for (let j = 0; j < currentSemesterValue.level.length; j++) {
          const currentLevelValue = currentSemesterValue.level[j];
          const dataIndex = i+j;
          const displayValue = <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={currentLevelValue.name}>{currentLevelValue.name}</MenuItem>
          returnDisplayValue.push(displayValue)
        }
        break;
      }
    }
    return returnDisplayValue;
  }


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
                  fontFamily: 'NotoSansCJKKR',
                  fontWeight: isReadOnly ? 'normal': 'bold',
                  fontSize: '18px',
                  fontStretch: 'normal',
                  fontStyle: 'normal',
                  lineHeight: 'normal',
                  letterSpacing: 'normal',
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center'
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
            {isReadOnly && 
              <MenuItem disabled={isReadOnly} sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>
            }
            {isUse==='level' && returnDisplayValue()}
            {isUse==='semester' && portfolioSelectBoxValue.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.label}>{dataItem.label}</MenuItem>
            })}
        </Select>
      </FormControl>
    </div>
  );
}