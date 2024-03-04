
import React from "react";
import { PieChart, Pie, Sector } from "recharts";

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

  return (
    <g>
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
export default function App(props: any) {
    const {
        itemName,
        value
    } = props;
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
    fontWeight: '700',
    fontStyle: 'bold',
    lineHeight: 'normal',
    letterSpacing: '-0.98px',
    textAlign: 'center',
    
}
const text2Css:React.CSSProperties = {
    width: '54px',
    height: '24px',
    fontFamily: 'GothamRounded',
    fontSize: '10px',
    fontWeight: 700,
    fontStyle: 'bold',
    lineHeight: 'normal',
    letterSpacing: '-0.7px',
    textAlign: 'center',
}
const percentValue = Math.round(data.data[0].value*10)/10;
const checkValueLength = percentValue.toString().length;
const percentX = checkValueLength===3 ? cx+18 : (checkValueLength===2 ? cx+15 : cx+11)
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
                {percentValue}
            </tspan>
            <tspan x={percentX} y={cy} dy={10} style={text2Css}>%</tspan>
        </text>

        
    </PieChart>
  );
}
