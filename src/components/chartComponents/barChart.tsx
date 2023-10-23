import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";

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
export default function App() {

  const {reportSelectedOverallBarChart} = useControlAlertStore();
  
  let check = {
    unit1:false,
    unit2:false,
    unit3:false,
    unit4:false,
    unit5:false,
  }
  for (let i =0; i < reportSelectedOverallBarChart.length; i++) {
    const target = reportSelectedOverallBarChart[i];
    if (target.unit1>0) check.unit1=true;
    if (target.unit2>0) check.unit2=true;
    if (target.unit3>0) check.unit3=true;
    if (target.unit4>0) check.unit4=true;
    if (target.unit5>0) check.unit5=true;
  }
  return (
    <BarChart
      width={530}
      height={301}
      data={reportSelectedOverallBarChart}
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
      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
      <XAxis dataKey="name" tick={<CustomXAxisTick />} minTickGap={0} ticks={['ideas','organization','voice','word', 'sentence','conventions']} 
        tickLine={false} tickMargin={10} axisLine={false} interval={0}
      />
      <YAxis tickCount={5} ticks={[0,1,2,3,4,5,6,7,8,9,10,11]} tickLine={false} axisLine={false} tickFormatter={()=>''} />
      <Bar dataKey="unit1" fill="#3dbcbf" label={check.unit1?{position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}:''} barSize={10} radius={[5,5,0,0]} />
      <Bar dataKey="unit2" fill="#f77488" label={check.unit1?{position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}:''} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit3" fill="#f9a77c" label={check.unit1?{position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}:''} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit4" fill="#43d39a" label={check.unit1?{position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}:''} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit5" fill="#5a91c8" label={check.unit1?{position:'top',fontFamily: 'GothamRounded',fontWeight:700,color:'#333',fontSize:12}:''} barSize={10} radius={[5,5,0,0]}/>
    </BarChart>
  );
}
