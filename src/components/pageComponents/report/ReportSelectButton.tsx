import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import useControlAlertStore from '../../../store/useControlAlertStore';

export default function ReportSelectButton(props:{
  data:{
    year: number, semester:number, level:string, label:string
  }[];
  selectDataFn:Function;
  isLevel:boolean;
  useDefaultEmptyValueFlag?:boolean;
  disabledFlag?:boolean;
}) {
  const {
    data,
    useDefaultEmptyValueFlag,
    disabledFlag,
    isLevel, 
    selectDataFn,
  } = props;
  // const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(false);

  const {
    reportSelectFinder,
    // value & setValue
    reportLevel,
    reportSemester,
    setReportSelectBoxValue,
    reportAPIData,
    forcedReadOnlyReportSelectBox
  } = useControlAlertStore();
  React.useEffect(()=>{
    // isLevel? (reportSemester===''?true:false):false
    let isDisabled = false;
    if (isLevel) {
      if (forcedReadOnlyReportSelectBox[1]) {
        isDisabled = true;
      } else {
        if (reportSemester==='') {
          isDisabled = true;
        } else {
          isDisabled = false;
        }
      }
    } else {
      if (forcedReadOnlyReportSelectBox[0]) {
        isDisabled = true;
      } else {
        isDisabled = false;
      }
    }
    setDisabled(isDisabled)
  },[forcedReadOnlyReportSelectBox])

  const setValue = (value:string, data:TDropdownSelectBoxDataTypes) => {
    console.log('value ==',value)
    if (value==='') {
      setReportSelectBoxValue({data, init:true})
    } else {
      if (isLevel) {
        setReportSelectBoxValue({data,level:value})
      } else {
        setReportSelectBoxValue({data,semester:value})
      }
    }
  }
  
  const handleChange = (event: SelectChangeEvent) => {
    console.log('reportSelectFinder ch =',reportSelectFinder)
    console.log('user info =',data)
    const targetData = event.target.value;
    console.log('target =',targetData);
    if (targetData === '') {
      
      selectDataFn('', reportAPIData, data[0], isLevel, true);
      // setValue('', data[0])
      return;
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].label === targetData) {
          selectDataFn(event.target.value, reportAPIData, data[i], isLevel);
           
          // setValue(event.target.value, data[i]);
          break;
        }
      }
    }
  };


  return (
    <div className='flex items-center h-[45px]' >
      <FormControl sx={{ width: '240px', height: '45px', padding:0, minHeight:'45px', m: 1 }} >
        <Select
            sx={
              disabled 
              ? {
              color:'#aeaeae',
              height: '45px',
              backgroundColor: '#fff',
              borderRadius: '15px',
              '& .MuiInputBase-input': {
                padding:0
              },
              '& .MuiSelect-icon': {
                right: '14px'
              },
            } : {
              color: (isLevel? reportLevel: reportSemester)===''? '#aeaeae': '#222',
              height: '45px',
              backgroundColor: '#fff',
              borderRadius: '15px',
              '& .MuiInputBase-input': {
                padding:0
              },
              '& .MuiSelect-icon': {
                right: '14px'
              }
            }
          }
            
            placeholder='test'
            value={isLevel? reportLevel: reportSemester}
            
            disabled={disabled}
            onChange={handleChange}
            displayEmpty={true}
            open={open}
            
            renderValue={(selected) => {
              console.log('selected !!=',selected)
              if (selected.length === 0) {
                if (isLevel) {
                  return 'Please select a level'
                } else {
                  return 'Please select a semester';
                }
                

              }else return selected

            }}
            
            onOpen={()=>setOpen(true)}
            onClose={()=>setOpen(false)}
            
            IconComponent={open? progressIcons.LevelSelectToggleUpArrowIcon: progressIcons.LevelSelectToggleDownArrowIcon}
            
        >
            {/* {!isLevel && <MenuItem sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>}
            
            {isLevel && } */}
            <MenuItem sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>

            {data.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={isLevel?dataItem.level:dataItem.label}>{isLevel?dataItem.level:dataItem.label}</MenuItem>

            })}
        </Select>
      </FormControl>
    </div>
  );
}