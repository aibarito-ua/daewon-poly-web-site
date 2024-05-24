import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";

export default function App() {

  const {reportSelectedOverallBarChart} = useControlAlertStore();
  const [reportBarData, setReportBarData] = React.useState<TOverallBarChartDataItem[]>([])
  const [check, setCheck] = React.useState<{
    unit1: boolean;
    unit2: boolean;
    unit3: boolean;
    unit4: boolean;
    unit5: boolean;
}>({
  unit1:false, unit2:false, unit3:false, unit4: false, unit5: false
})
  
const CustomXAxisTick = (props:any) => {
  
  const { x, y, payload } = props;
  let words = payload.value.split(' '); // tick 이름을 공백으로 분리
  if (payload.value === 'sentence') {
    words = ['sentence','fluency']
  } else if (payload.value === 'word') {
    words = ['word','choice']
  }
  const textAnchorProps = props.textAnchor
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor={textAnchorProps} fill="#666">
        {words.map((word:any, index:any) => {
          
          return <tspan x={0} dy={index === 0 ? 0 : 16} key={index} fontSize={13} fontFamily="Roboto" className="capitalize">{word}</tspan>
        }
        )}
      </text>
    </g>
  );
};
  React.useEffect(()=>{
    
    // console.log('reportSelectedOverallBarChart =',reportSelectedOverallBarChart)
    if (reportSelectedOverallBarChart.length>0) {
      let dumyCheck:{
        unit1: boolean;
        unit2: boolean;
        unit3: boolean;
        unit4: boolean;
        unit5: boolean;
    } = JSON.parse(JSON.stringify(check));
    // let dumyBarData:JSX.Element[] = []
      const target = reportSelectedOverallBarChart[0];
      if (target.unit1>0) dumyCheck.unit1=true;
      if (target.unit2>0) dumyCheck.unit2=true;
      if (target.unit3>0) dumyCheck.unit3=true;
      if (target.unit4>0) dumyCheck.unit4=true;
      if (target.unit5>0) dumyCheck.unit5=true;
    
      setCheck(dumyCheck);
    }
    setReportBarData(reportSelectedOverallBarChart);
    return () => {
      setReportBarData([])
    }
  },[reportSelectedOverallBarChart, check]);

  if (reportBarData.length > 0) {
    return (
      <BarChart
        width={530}
        height={301}
        data={reportBarData}
        margin={{
          top: -30,
          right: 0,
          left: -50,
          bottom: 10
        }}
        barCategoryGap={16}
        barGap={5}
        className="font-[NotoSansCJKKR] capitalize"
      
      >
        <ReferenceArea shape={(props:any)=>{
          // console.log('props ===',props)
          return <rect 
            x={10} 
            y={18}
            height={243}
            width={86}
            fill="#f5f5f5"
          />
        }}/>
        <ReferenceArea shape={(props:any)=>{
          // console.log('props ===',props)
          return <rect 
            x={183} 
            y={18}
            height={243}
            width={86}
            fill="#f5f5f5"
          />
        }}/>
        <ReferenceArea shape={(props:any)=>{
          // console.log('props ===',props)
          return <rect 
            x={357} 
            y={18}
            height={243}
            width={86}
            fill="#f5f5f5"
          />
        }}/>
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="name" tick={<CustomXAxisTick />} minTickGap={0} ticks={['ideas','organization','voice','word', 'sentence','conventions']} 
          tickLine={false} tickMargin={10} axisLine={false} interval={0}
              
        />
        <YAxis tickCount={5} ticks={[0,1,2,3,4,5,6,7,8,9,10,11]} tickLine={false} axisLine={false} tickFormatter={()=>''} />
        
        <Bar dataKey="unit1" fill="#3dbcbf" label={
          // {position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}
          check.unit1?{position:'top',fontFamily: 'Nunito',fontWeight:800, fontStyle: 'normal',color:'#333',fontSize:12}:''
        } barSize={10} radius={[5,5,0,0]} />
  
        <Bar dataKey="unit2" fill="#f77488" label={
          // {position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}
          check.unit2?{position:'top',fontFamily: 'Nunito',fontWeight:800, fontStyle: 'normal',color:'#333',fontSize:12}:''
        } barSize={10} radius={[5,5,0,0]}/>
  
        <Bar dataKey="unit3" fill="#f9a77c" label={
          // {position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}
          check.unit3?{position:'top',fontFamily: 'Nunito',fontWeight:800, fontStyle: 'normal',color:'#333',fontSize:12}:''
          } barSize={10} radius={[5,5,0,0]}/>
        
        <Bar dataKey="unit4" fill="#43d39a" label={
          // {position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}
          check.unit4?{position:'top',fontFamily: 'Nunito',fontWeight:800, fontStyle: 'normal',color:'#333',fontSize:12}:''
          } barSize={10} radius={[5,5,0,0]}/>
        
        <Bar dataKey="unit5" fill="#5a91c8" label={
          // {position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}
          check.unit5?{position:'top',fontFamily: 'Nunito',fontWeight:800, fontStyle: 'normal',color:'#333',fontSize:12}:''
          } barSize={10} radius={[5,5,0,0]}/>
        {/* <ReferenceArea x1={0} x2={53} y1={0} y2={300} stroke="red" strokeOpacity={0.3} /> */}
        
      </BarChart>
    );

  } else {
    return <></>
  }
}
