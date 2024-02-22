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
    setReportSelectUnit,
    setResetReportDatas,
  } = useControlAlertStore();
  React.useEffect(()=>{
    return () => {
      console.log('!!!! unmount button component !!!!!')
      setResetReportDatas();
    }
  }, [])
  React.useEffect(()=>{
    console.log('reportSemester =',reportSemester)
    console.log('reportLevel =',reportLevel)
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
              console.log('data[',i,'].level[',l,'].name =',data[i].level[l].name)
              
              const selectReportApidataLevels = reportAPIData.periods.find((p) => (p.year === data[i].year && p.semester === data[i].semester) );
              if (selectReportApidataLevels) {
                
                const findReportAPIData = selectReportApidataLevels.levels.find((p) => p.level_name === data[i].level[l].name);
                if (findReportAPIData) {

                  if (findReportAPIData.overall_report.length > 0) {
                    setSelectReportData(reportAPIData, data[i].year, data[i].semester, targetData);
                    const init = findReportAPIData.overall_report[0].unit_index
                    console.log('init ==',init)
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

              } else {
                // selectReportApidataLevels is undefined

              }
            }
          }
        }

      }
    } else {
      console.log('isLevel false')
      let reportSelectedBoxValue:{
        data: TDropdownSelectBoxDataTypes;
        semester?: string | undefined;
        level?: string | undefined;
        init?: boolean | undefined;
        renderInit?: boolean | undefined;
      } = { data: { label: '', semester: 0, year: 0, level: '' }}

      for (let i = 0; i < data.length; i++) {
        if (data[i].label === targetData) {
          console.log('data[i] ===',data[i])
          // selectDataFn(targetData, reportAPIData, data[i], isLevel);
          reportSelectedBoxValue.data.label = data[i].label;
          reportSelectedBoxValue.data.semester = data[i].semester;
          reportSelectedBoxValue.data.year = data[i].year;
          reportSelectedBoxValue.semester = targetData;
          console.log('data[i].level.length =',data[i].level.length)
          if (data[i].level.length > 1) {
            reportSelectedBoxValue.data.level = ''
            setSelectReportData(reportAPIData,reportSelectedBoxValue.data.year, reportSelectedBoxValue.data.semester, '');
          } else if (data[i].level.length === 1) {
            reportSelectedBoxValue.data.level = data[i].level[0].name;
            setSelectReportData(reportAPIData,reportSelectedBoxValue.data.year, reportSelectedBoxValue.data.semester, data[i].level[0].name);
          } else {
            reportSelectedBoxValue.data.level = ''
            setSelectReportData(reportAPIData,reportSelectedBoxValue.data.year, reportSelectedBoxValue.data.semester, '');
          }
          setReportSelectBoxValue(reportSelectedBoxValue)
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
            
            // disabled={disabled}
            readOnly={disabled}
            onChange={handleChange}
            displayEmpty={true}
            open={open}
            
            renderValue={(selected) => {
              console.log('=== render value in button ====')
              console.log('selected !!=',selected)
              console.log('reportLevel =',reportLevel)
              console.log('reportSemester =',reportSemester)
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