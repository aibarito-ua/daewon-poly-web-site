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
import useControlAlertStore from '../../../store/useControlAlertStore';
import useSparkWritingStore from '../../../store/useSparkWritingStore';
import { callUnitInfobyStudent } from '../../../pages/Student/api/EssayWriting.api';

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

export default function SelectLabels() {
  // const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState<boolean>(false);
  const {userInfo, setMaintenanceData} = useLoginStore();
  // const [levels, setLevels] = React.useState<string[]>([]);
  const [isReadOnly, setIsReadOnly] = React.useState<boolean>(false);
  const {
    reportAPIData,
    reportSelectBoxDatas,
    progressLevelBoxValue,
    progressAllLevelsValue,
    setProgressLevelBoxValue,
    setCommonStandbyScreen
  } = useControlAlertStore();
  const {
    setSparkWritingDataFromAPI
  } = useSparkWritingStore();
  React.useEffect(()=>{
    console.log('progressAllLevelsValue =',progressAllLevelsValue)
    console.log('progress',progressLevelBoxValue)
    if (progressAllLevelsValue.length > 0) {
      if (progressAllLevelsValue.length===1) {
        setIsReadOnly(true);
      } else {
        setIsReadOnly(false);
      }
    } else {
      setIsReadOnly(true);
    }
  },[progressLevelBoxValue, progressAllLevelsValue,reportAPIData])

  const findCallUnitInfobyStudent = async (studentCode: string,
    courseName: string,
    accessToken: string
) => {
    return await callUnitInfobyStudent(studentCode, courseName, accessToken).then((response) => {
      if (response.data) {
        let maintenanceInfo:TMaintenanceInfo = response.data.maintenanceInfo;
        maintenanceInfo.start_date = response.data.maintenanceInfo.start_date;
        maintenanceInfo.end_date = response.data.maintenanceInfo.end_date;
        let dumyMaintenanceData:TMaintenanceData = {
            alertTitle: '시스템 점검 안내',
            data: maintenanceInfo,
            open: false,
            type: ''
        }
        setMaintenanceData(dumyMaintenanceData)
      } else {
        console.log('callUnitInfobyStudent ===',response)
        if (response.book_name!=='') {
            // setLoading(true)
        }
        setSparkWritingDataFromAPI(response.units, response.book_name)
        
        return response;
      } 
    });
}
  
  const handleChange = async (event: SelectChangeEvent) => {
    console.log('user info =',userInfo)
    console.log(' event.target.value =',event.target.value)
    setProgressLevelBoxValue(event.target.value, userInfo, false);
    
    setCommonStandbyScreen({openFlag:true})
    const rsp = await findCallUnitInfobyStudent(userInfo.userCode, event.target.value, userInfo.accessToken)
    if (rsp) {
      setCommonStandbyScreen({openFlag:false})
    }
  };

  

  return (
    <div className='flex items-center h-[45px] '>
      <FormControl sx={{ width: '240px', height: '45px', minHeight:'45px', m:1,}}>
        <Select
            sx={{
              color: progressLevelBoxValue===''? '#aeaeae': '#222',
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
                fontWeight: progressLevelBoxValue==='' ? 'normal': 'bold',
                fontSize: '18px',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center'
              }
            }}
            value={progressLevelBoxValue}
            disabled={isReadOnly}
            
            onChange={handleChange}
            displayEmpty={true}
            open={open}
            renderValue={(selected) => {
              console.log('selected !!=',selected)
              if (selected.length === 0) {
                return 'Please select a level';
              }else return selected
            }}
            onOpen={()=>setOpen(true)}
            onClose={()=>setOpen(false)}
            IconComponent={open? progressIcons.LevelSelectToggleUpArrowIcon: progressIcons.LevelSelectToggleDownArrowIcon}
        >
            {isReadOnly && <MenuItem sx={{height: '45px', minHeight: '45px'}} value=''></MenuItem>}

            {progressAllLevelsValue.map((levelItem, levelIndex)=>{
                return <MenuItem key={levelIndex} sx={{height: '45px', minHeight: '45px'}} value={levelItem}>{levelItem}</MenuItem>
            })}
        </Select>
      </FormControl>
    </div>
  );
}