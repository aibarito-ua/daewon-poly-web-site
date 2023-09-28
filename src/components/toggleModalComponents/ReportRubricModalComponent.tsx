import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import useControlAlertStore from '../../store/useControlAlertStore';
// import btnPreview from '../../util/png/btn_preview.png';

interface IRubricTypeModalComponentProps {
    isPrev:boolean;
    isNext:boolean;
    setIsPrev: Function;
    setIsNext: Function;
    handlePrev: Function;
    handleNext: Function;
    isNoData:boolean;
    initSelectUnitIndex?:number;
    isActivityPage?:boolean;
}
interface IRubricTableDataItem {
  key:string;
  value:string|string[];
  rowspan: number;
  print: boolean;
}

export default function ReportRubricModalComponent(props:IRubricTypeModalComponentProps) {

  const {
    // keyValue, rubric_type, rubric_type_datas, isFinalDraft
    isNext, isPrev, setIsNext, setIsPrev, handleNext, handlePrev, isActivityPage, isNoData
  } = props;
    
  const [open, setOpen] = React.useState(false);
  const [viewRubric, setViewRubric] = React.useState<IRubricTableDataItem[][]>([]);
  const [viewRubricHead, setViewRubricHead] = React.useState<TRubricTypeHeader[]>([]);
  const [title, setTitle] = React.useState<string>('');
  const {
    reportSelectUnit,
    reportModalRubricData,
  } = useControlAlertStore();

  React.useEffect(()=>{
    if (!open) {
      setViewRubric([])
      setViewRubricHead([])
    } else {
        
        const allRubricData = reportModalRubricData;
        if (allRubricData.length > 0) {
            for (let i = 0; i < allRubricData.length; i++) {
                if (allRubricData[i].unit_index === reportSelectUnit) {
                    const targetRubricData = allRubricData[i].rubric;
                    const dataHead:TRubricTypeHeader[] = [
                        {accessor: 'category', header: 'Category'},
                        {accessor: 'explanation', header: 'Explanation'},
                        {accessor: 'excellent', header: 'Excellent'},
                        {accessor: 'very_good', header: 'Very Good'},
                        {accessor: 'good', header: 'Good'},
                        {accessor: 'fair', header: 'Fair'},
                        {accessor: 'poor', header: 'Poor'},
                    ];
                    const rubric_type_data:TRubricTypeData = {
                        data: targetRubricData.rubric_description,
                        dataHead: dataHead
                    }
                    const topic = targetRubricData.name.split('_')
                    const targetText = `Unit ${reportSelectUnit}. ${topic[1]}`;
                    setTitle(targetText)
                    processTableData(rubric_type_data);
                }
            }
        }
    

    }
  }, [open, reportSelectUnit])

  // process table data 
  const processTableData = (allDatas:TRubricTypeData ) => {
    // console.log('test ==',allDatas)
    const tableDatas = allDatas.data;
    const tableHeadDatas = allDatas.dataHead;
    let dataModel:IRubricTableDataItem[][] = [];
    for (let dataIndex =0; dataIndex < tableDatas.length; dataIndex++) {
      const rowData = tableDatas[dataIndex];
      let pushRow:IRubricTableDataItem[] =[]
      for (let colIndex = 0;colIndex < tableHeadDatas.length; colIndex++) {
        const keyValue = tableHeadDatas[colIndex].accessor;
        const cellData = rowData[keyValue];
        const pushCellData:IRubricTableDataItem = {
          key: keyValue,
          value: cellData,
          rowspan: 1,
          print: true
        };
        pushRow.push(pushCellData);
      } // make cell
      dataModel.push(pushRow)
    } // make row
    setViewRubric(dataModel);
    setViewRubricHead(tableHeadDatas);
  }

  const RubricTableHeader = (props: {tableHeader: TRubricTypeHeader[]}) => {
    
    return (
      <thead className='w-[934px] capitalize h-[68px] rubric-modal-head-font'>
        <tr className=''>
          {props.tableHeader.map((tableHead, headIndex)=>{
            const checkSpan = tableHead.accessor==='explanation'||tableHead.accessor==='category'
            return (
              <th key={tableHead.accessor+headIndex}
              className={`px-2 py-2 text-center border border-[#ddd] ${
                tableHead.accessor==='category' ? 'w-[100px] bg-[#fff9ec]':
                (tableHead.accessor==='explanation' ? 'w-[139px] bg-[#fffdf7]':'w-[139px] bg-[#f6fdff]')
                
              } border-t-[#111]`}
              rowSpan={checkSpan ? 2:1}
              >
                {tableHead.header}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  const RubricTableBody = (props: {dataModel: IRubricTableDataItem[][]}) => {
    // const {dataModel} = props;
    const dataModel = viewRubric;
    return (
      <tbody >
        {dataModel && dataModel.map((rowItem, rowIndex)=>{
          return (
            <tr key={'row-data-'+rowIndex}>
              {rowItem.map((cellItem, cellIndex)=>{
                return (
                  <td key={cellItem.key}
                  className={`p-[10px] whitespace-normal border border-[#ddd] ${
                    cellItem.key==='category' ? 'bg-[#fff9ec] rubric-modal-head-font'
                    :cellItem.key==='explanation' ? 'bg-[#fffdf7] rubric-modal-body-font' : 'bg-white rubric-modal-body-font'
                  }`}>
                    {typeof(cellItem.value)==='string' ? cellItem.value 
                    : cellItem.value.map((textItem, textIndex)=>{
                      return (
                        <span key={'explanation-'+textIndex}>{`- ${textItem}`}</span>
                      )
                    })}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  const handleClickOpen = () => {
    if (!isNoData) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className='flex justify-center'>
    <span className="flex flex-row hover:cursor-pointer text-center items-center min-w-max px-[20px]"
        onClick={handleClickOpen}
    ><div className={isActivityPage ? 'w-[48px] h-[48px] bg-btn-rubric-modal-ic-svg bg-no-repeat':'w-[48px] h-[48px] bg-tab-overall-rubric-ic-svg bg-no-repeat'}/></span>
      <Dialog className=''
      fullWidth={true}
      PaperProps={{sx:{
        width: '1075x',
        maxWidth: '1075px',
        minWidth: '1075px',
        height: '605px',
        backgroundColor: 'rgba(0.4,0,0.2, 0)',
        boxShadow: 'none',
        padding:0,
        margin:0,

      }}}
      open={open} onClose={handleClose}>
        <DialogTitle borderBottom={1}
          sx={{
            backgroundColor: 'none',
            width: '100%',
            paddingTop: '25px',
            paddingRight: '25px',
            paddingLeft: '25px',
            height: '75px',
            paddingBottom: 0,
          }}
        >
          <div className='flex flex-row justify-center items-center text-[16px] text-[#ffffff] bg-[#7861bb] font-bold h-[50px] w-[1024px] relative rounded-t-[30px]'>
            {title}
            <div className='bg-modal-close-button-svg w-[50px] h-[50px] bg-no-repeat absolute -right-[24px] -top-[24px] hover:cursor-pointer'
                onClick={handleClose}
                
            />
          </div>
        </DialogTitle>
        <DialogContent 
            className='flex flex-1 flex-col w-full h-full'
            sx={{
                padding:0,
                paddingRight: '25px',
                paddingLeft: '25px',
            }}
        >
        <div className='flex flex-1 h-full w-full bg-white rounded-b-[30px] border-x-[6px] border-b-[6px] border-x-[#7861bb] border-b-[#7861bb] relative'>
            <div className={!isPrev
                ? 'absolute top-[215px] -left-[25px] bg-tab-prev-btn-disabled w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                : 'absolute top-[215px] -left-[25px] bg-tab-rubric-modal-left w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'}
                onClick={()=>handlePrev(reportSelectUnit)}
            />
            <div className={!isNext
                ? 'absolute top-[215px] -right-[25px] bg-tab-next-btn-disabled w-[55px] h-[55px] bg-no-repeat hover:cursor-not-allowed'
                : 'absolute top-[215px] -right-[25px] bg-tab-rubric-modal-right w-[55px] h-[55px] bg-no-repeat hover:cursor-pointer'
            }
                onClick={()=>handleNext(reportSelectUnit)}
            />
        <div className='flex flex-grow flex-col w-full overflow-y-auto px-[45px] py-[30px]'>
          <table className=' text-left w-full border border-[#808080] table-fixed'>
            <RubricTableHeader 
              tableHeader={viewRubricHead}
            />
            <RubricTableBody 
              dataModel={viewRubric}
            />
          </table>
        </div>
        
        </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
