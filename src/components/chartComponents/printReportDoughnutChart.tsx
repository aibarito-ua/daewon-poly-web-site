
import React from "react";
import { PieChart, Pie, Sector } from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";

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
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    value
  } = props;
  const startAngle = 90;
  const endAngle = 90-value/100*360;
  const radiusMid = outerRadius-innerRadius;
  const cornerRadius = radiusMid/2;
  const trackRadius = innerRadius + cornerRadius;
  // end point
  const radiusP = (outerRadius+innerRadius)/2;
  const startP = scoreToCoordinates(cx,cy,0,radiusP)
  const endP = scoreToCoordinates(cx,cy,value,radiusP)
  return (
    <g>
        <defs>
        <linearGradient id="colorUv" x1="1" y1="1" x2="0" y2="0">
            <stop offset="30%" stopColor="#588ee1" stopOpacity={1} />
            <stop offset="90%" stopColor="#c9defc" stopOpacity={1} />
        </linearGradient>
        </defs>
        <circle cx={cx} cy={cy}
            r={trackRadius}
            fill="#deebff"
            stroke="#f5f5f5"
        />
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle+5}
            endAngle={endAngle-5}
            fill={'url(#colorUv)'}
            
            cornerRadius={cornerRadius}
        />
        <circle
            fill="#fff"
            cx={startP.scoreX}
            cy={startP.scoreY}
            r={3}
        />
        <circle
            fill="#fff"
            cx={endP.scoreX}
            cy={endP.scoreY}
            r={3}
        />
    </g>
  );
};
export default function App() {
    const [average, setAverage] = React.useState<number>(0);
    const {unitRubricScoresData, reportSelectUnit} = useControlAlertStore();
    React.useEffect(()=>{
      let allScore = 0;
      const data = unitRubricScoresData.hexagonChartData.map((item)=>{
          allScore += item.data[0].value;
          return item;
      });
      const avg = parseFloat((allScore/data.length).toFixed(1));
      setAverage(avg);
    },[reportSelectUnit, unitRubricScoresData]);
    
    const cx = 65;
    const cy = 65;
    const textmainCss:React.CSSProperties = {
        width: '80px',
        height: '80px',
        backgroundColor: '#ffffff',
        fill: '#222222',
    }
    const text1Css:React.CSSProperties = {
      width: '54px',
      height: '24px',
      textShadow: '2px 2px 0 rgba(0,0,0,0.16)',
      fontFamily: 'GothamRounded',
      fontSize: '20px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      lineHeight: 1.2,
      letterSpacing: 'normal',
    };
    const text2Css:React.CSSProperties = {
      width: '54px',
      height: '24px',
      textShadow: '2px 2px 0 rgba(0,0,0,0.16)',
      fontFamily: 'GothamRounded',
      fontSize: '14px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      lineHeight: 1.2,
      letterSpacing: 'normal',
    }

  return (
    <PieChart width={140} height={140}>
        
            {/* const currentR = radiusDatas[dataIndex] */}
            <Pie key={'print-report-average'}
                className="pie-button-effect-none"
              activeIndex={0}
              activeShape={renderActiveShape}
              data={[{
                name: 'average',
                value: average
              }]}
              cx={cx}
              cy={cy}
              innerRadius={60}
              outerRadius={70}
              fill={'#222'}
              dataKey="value"
            />
        <text x={cx} y={cy} dy={0} textAnchor="middle" style={textmainCss} width={80} height={80} 
        className="shadow-[1px_1px_5px_rgba(0,0,0,0.16)]">
            <tspan x={cx} y={cy} dy={10} textAnchor="middle" style={text1Css}>
                {Math.round(average*10)/10}
            </tspan>
            <tspan x={cx+30} y={cy} dy={10} style={text2Css}>%</tspan>
        </text>

        
    </PieChart>
  );
}
