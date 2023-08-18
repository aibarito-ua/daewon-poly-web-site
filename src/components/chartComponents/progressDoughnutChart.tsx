
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Tooltip } from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";

// const data:TPrintReportDoughnutData = {
//         target: 'average',
//         data: [
//             {
//                 name: 'average',
//                 value: 70,
//             }
//         ],
//         addWidth: 40,
//         fitText: 40,
//     }
const scoreToCoordinates = (cx:number, cy:number, score:number, radius:number) => {
    // 점수에 따른 각도 계산
const scoreAngle = ( (100-score) / 100 ) * -360;
// radian계산
const scoreRadian = (scoreAngle - 90) * (Math.PI / 180);
// 점수의 좌표
const scoreX = cx + radius * Math.cos(scoreRadian);
const scoreY = cy + radius * Math.sin(scoreRadian);
return {scoreX,scoreY}
}
const renderActiveShape = (props: any) => {
    
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    fill,
    payload,
    percent,
    value
  } = props;
  const midAngle = 45;
  const startAngle = 90;
  const endAngle = 90-value/100*360;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const radiusMid = outerRadius-innerRadius;
const cornerRadius = radiusMid/2;
const trackRadius = innerRadius + cornerRadius;

// end point
const radiusP = (outerRadius+innerRadius)/2;
const startP = scoreToCoordinates(cx,cy,0,radiusP)
const endP = scoreToCoordinates(cx,cy,value,radiusP)
  return (
    <g>
        {/* <circle cx={cx} cy={cy}
            r={trackRadius}
            fill="#deebff"
            stroke="#f5f5f5"
        /> */}
        {/* <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={0}
            endAngle={360}
            fill={'#E5ECFD'}
            stroke="#E5ECFD"
        /> */}
        
        
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle+5}
            endAngle={endAngle-5}
            fill={'#3E61AA'}
            
            cornerRadius={cornerRadius}
        />
    </g>
  );
};
type TAllDoughnutDatas = {
    target: string;
    data: {
        name: string;
        value: number;
        selectName: string;
        fillColor: string;
        fillBorderColor: string;
    }[];
    addWidth: number;
    fitText: number;
    toolLineColor: string;
}[]
export default function App(props: any) {
    const {
        itemName,
        value
    } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [clickIndex, setClickIndex] = useState<string>('');
    const [tooltipData, setTooltipData] = useState<{value:number, outerRadius:number}>({
        value: 0, outerRadius: 0
    });
    // const [allData, setAllData] = useState<TPrintReportDoughnutData>(data);
    const [addWidth, setAddWidth] = useState<number>(0);
    const [decText, setDecText] = useState<number>(0);
    const [tooltipLineColor, setTooltipLineColor] = useState<string>('');
    const [average, setAverage] = useState<number>(0);
    const {unitRubricScoresData} = useControlAlertStore();
    const data = {
            target: itemName,
            data: [
                {
                    name: itemName,
                    value: value,
                }
            ],
            addWidth: 0,
            fitText: 0,
        }
    // dataPayload: {
    //     target: 'average',
    //     data: [
    //         {
    //             name: 'average',
    //             value: 0,
    //         }
    //     ],
    //     addWidth: 40,
    //     fitText: 40,
    // }
    
    React.useEffect(()=>{
    },[])
    
    const cx = 20;
    const cy = 20;
    const textmainCss:React.CSSProperties = {
        width: '26px',
        height: '17px',
        backgroundColor: '#ffffff',
        fill: '#0948CB',
    }
  const text1Css:React.CSSProperties = {
    width: '54px',
    height: '24px',
    fontFamily: 'GothamRounded',
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: '-0.98px',
    
}
const text2Css:React.CSSProperties = {
    width: '54px',
    height: '24px',
    fontFamily: 'GothamRounded',
    fontSize: '10px',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: '-0.7px',
}

  return (
    <PieChart width={50} height={50}>
        <circle 
            cx={cx+5}
            cy={cy+5}
            fill={'#E5ECFD'}
            r={25}
        />
        <circle 
            cx={cx+5}
            cy={cy+5}
            fill={'#fff'}
            r={20}
        />
            {/* const currentR = radiusDatas[dataIndex] */}
            <Pie key={data.target}
                className="pie-button-effect-none"
              activeIndex={0}
              activeShape={renderActiveShape}
              data={data.data}
              cx={cx}
              cy={cy}
              innerRadius={20}
              outerRadius={25}
              fill={'#222'}
              dataKey="value"
            />
        <text x={cx} y={cy} dy={0} textAnchor="middle" style={textmainCss} width={26} height={17} 
        className="shadow-[1px_1px_5px_rgba(0,0,0,0.16)]">
            <tspan x={cx} y={cy} dy={10} textAnchor="middle" style={text1Css}>
                {Math.round(data.data[0].value*10)/10}
            </tspan>
            <tspan x={cx+18} y={cy} dy={10} style={text2Css}>%</tspan>
        </text>

        
    </PieChart>
  );
}
