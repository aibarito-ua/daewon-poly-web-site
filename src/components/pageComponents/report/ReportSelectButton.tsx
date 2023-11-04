import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { progressIcons } from '../../../util/svgs/commonProgressIcons';
import useControlAlertStore from '../../../store/useControlAlertStore';

export default function ReportSelectButton(props:{
  data:TReportPageSelectBoxDatas[];
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
    forcedReadOnlyReportSelectBox,
    setSelectReportData,
    setReportSelectUnit
  } = useControlAlertStore();
  React.useEffect(()=>{

    // isLevel? (reportSemester===''?true:false):false
    let isDisabled = false;
    if (isLevel) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].label === reportSemester) {
          if (data[i].level.length > 1) {
            isDisabled = false;
          } else {
            isDisabled = true;
          }
          break;
        }
      }
    } else {
      if (data.length > 1) {
        isDisabled = false;
      } else {
        isDisabled = true;
      }
    }
    setDisabled(isDisabled)
  },[reportSelectFinder, reportLevel, reportSemester])

  const setValue = (value:string, data:TDropdownSelectBoxDataTypes) => {
    console.log('value ==',value)
    if (value==='') {
      // setReportSelectBoxValue({data, init:true})
    } else {
      if (isLevel) {
        // setReportSelectBoxValue({data,level:value})
      } else {
        // setReportSelectBoxValue({data,semester:value})
      }
    }
  }
  
  const handleChange = (event: SelectChangeEvent) => {
    console.log('reportSelectFinder ch =',reportSelectFinder)
    console.log('user info =',data)
    const targetData = event.target.value;
    console.log('target =',targetData);
    if (isLevel) {
      console.log('isLevel true')
      for (let i = 0; i < data.length; i++) {
        console.log('data[i].label ===',data[i].label)
        if (data[i].label === reportSemester) {
          for (let l = 0; l < data[i].level.length; l++) {
            if (data[i].level[l].name === targetData) {
              // selectDataFn(targetData, reportAPIData, data[i], isLevel);
              console.log('reportAPIData.periods[i].levels[l].overall_report.length =',reportAPIData.periods[i].levels[l].overall_report.length)
              if (reportAPIData.periods[i].levels[l].overall_report.length > 0) {
                setSelectReportData(reportAPIData, data[i].year, data[i].semester, targetData);
                const init = reportAPIData.periods[i].levels[l].overall_report[0].unit_index
                setReportSelectUnit(init)
                setReportSelectBoxValue({
                  data: {
                    label: data[i].label,
                    semester: data[i].semester,
                    year: data[i].year,
                    level: targetData
                  }, level: targetData
                })
              } else {

                setSelectReportData(reportAPIData, data[i].year, data[i].semester, targetData);
                // const init = reportAPIData.periods[i].levels[l].overall_report[0].unit_index
                // setReportSelectUnit(init)
                setReportSelectBoxValue({
                  data: {
                    label: data[i].label,
                    semester: data[i].semester,
                    year: data[i].year,
                    level: targetData
                  }, level: targetData
                })
              }
            }
          }
        }

      }
    } else {
      console.log('isLevel false')
      for (let i = 0; i < data.length; i++) {
        if (data[i].label === targetData) {
          console.log('data[i].label ===',data[i].label)
          // selectDataFn(targetData, reportAPIData, data[i], isLevel);
          setReportSelectBoxValue({
            data: {
              label: data[i].label,
              semester: data[i].semester,
              year: data[i].year,
              level: ''
            }, semester: targetData
          })
        }

      }
    }
  };


  return (
    <div className='flex items-center h-[45px]' >
      <FormControl sx={{ width: '240px', height: '45px', minHeight:'45px', m: 1 }} >
        <Select
            sx={
            {
              color: disabled? '#aeaeae': '#222',
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
                fontWeight: disabled ? 'normal': 'bold',
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
            {disabled && 
            <MenuItem sx={{height: '45px', minHeight: '45px',padding:0 }} value=''></MenuItem>
            }

            {!isLevel && data.map((dataItem, dataIndex)=>{
                return <MenuItem key={dataIndex} sx={{height: '45px', minHeight: '45px'}} value={dataItem.label}>{dataItem.label}</MenuItem>
            })}
            {isLevel && data.map((yearItem, yearIndex)=>{
              console.log('yearItem===',yearItem)
              console.log('reportSelectFinder.label ==',reportSelectFinder.label)
              if (reportSemester === yearItem.label) {
                return yearItem.level.map((levelItem, levelIndex)=>{
                  console.log('levelItem ==',levelItem.name)
                  return <MenuItem key={'reportSelectButtonLevel-'+yearIndex+'-'+levelIndex} sx={{height: '45px', minHeight: '45px'}} value={levelItem.name}>{levelItem.name}</MenuItem>

                })
              }
              return null;
            })}
        </Select>
      </FormControl>
    </div>
  );
}