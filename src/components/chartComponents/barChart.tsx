import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";
const DotIcon = (props:React.SVGAttributes<SVGElement>) => {
return (<svg {...props} viewBox="0 0 20 20" width={14} height={14}>
    
        <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
    
    </svg>)
}

// const data:TOverallBarChartDataItem[] = [
//   {
//     name: "idea",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 10
//   },
//   {
//     name: "organization",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 10
//   },
//   {
//     name: "voice",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 10
//   },
//   {
//     name: "word choice",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 10
//   },
//   {
//     name: "sentence",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 10
//   },
//   {
//     name: "conventions",
//     unit1: 6,
//     unit2: 4,
//     unit3: 4,
//     unit4: 8,
//     unit5: 10,
//     amt: 1
//   },
// ];
const legendFormJSX = (text:string) => {
  const textSplit = text.split(' ');
  if (textSplit.length === 1) {
    return <span className="capitalize pr-[40px]" style={{color: '#555', fontSize: '13px',lineHeight:'20px',fontFamily:'Noto Sans CJK KR'}}>{text}</span>
  } else {

  }
}
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
        tickLine={false} tickMargin={10} axisLine={false} 
      />
      <YAxis tickCount={5} ticks={[0,1,2,3,4,5,6,7,8,9,10,11]} tickLine={false} axisLine={false} tickFormatter={()=>''} />
      <Bar dataKey="unit1" fill="#3dbcbf" label={{position:'top'}} barSize={10} radius={[5,5,0,0]} />
      <Bar dataKey="unit2" fill="#f77488" label={{position:'top'}} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit3" fill="#f9a77c" label={{position:'top'}} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit4" fill="#43d39a" label={{position:'top'}} barSize={10} radius={[5,5,0,0]}/>
      <Bar dataKey="unit5" fill="#5a91c8" label={{position:'top'}} barSize={10} radius={[5,5,0,0]}/>
    </BarChart>
  );
}
