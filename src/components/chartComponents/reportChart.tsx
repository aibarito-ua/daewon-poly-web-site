
import React, { useState } from "react";
import { PieChart, Pie, Sector, Tooltip } from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";

const textmainCss:React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: '#ffffff',
    fill: '#222222',
}
const text1Css:React.CSSProperties = {
width: '54px',
height: '24px',
// textShadow: '2px 2px 0 rgba(0,0,0,0.16)',
fontFamily: 'GothamRounded',
fontSize: '20px',
fontWeight: 'bold',
fontStyle: 'normal',
lineHeight: 1.2,
letterSpacing: 'normal',
}
const text2Css:React.CSSProperties = {
width: '54px',
height: '24px',
// textShadow: '2px 2px 0 rgba(0,0,0,0.16)',
fontFamily: 'GothamRounded',
fontSize: '14px',
fontWeight: 'bold',
fontStyle: 'normal',
lineHeight: 1.2,
letterSpacing: 'normal',
}
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    fill,
    payload,
    value,

  } = props;
    const startAngle = 90;
    const endAngle = 90-value/100*360;
    const radiusMid = outerRadius-innerRadius;
    const cornerRadius = radiusMid/2;
    const trackRadius = innerRadius + cornerRadius;
    const textLabelCss:React.CSSProperties = {
        width: '80px',
        height: '80px',
        backgroundColor: '#ffffff',
        fill: payload.fillColor,
        textTransform: 'capitalize'
    }
    const percentValue = Math.round(payload.value*10)/10;
    const percentLengthCheck = percentValue===100 ? '3': (
        percentValue >=0 && percentValue < 10 ? '1':'2'
    )
    const titleName:string[] = payload.name.split(' ')
  return (
    <g>
        <circle cx={cx} cy={cy}
            r={trackRadius}
            fill="#fff"
            stroke={payload.circleBaseLineColor}
            strokeWidth={4}
        />
        <text x={cx} y={cy} textAnchor="middle" width={104} height={28} style={textLabelCss}
        className="report-small-chart-inner-doughnut-label">{titleName.map((textTitle, textTitleIdx) => {
            const checkTextLength = titleName.length;
            const d2y = textTitleIdx * 14;
            const textValue = textTitle.replace(/^[a-z]/, char => char.toUpperCase())
            return <tspan x={cx} y={cy} key={textTitleIdx} textAnchor="middle" dy={checkTextLength>1 ? d2y-18: d2y-5}>{textValue}</tspan>
        })}</text>
        <text x={cx} y={cy} dy={0} dx={0} textAnchor="middle" style={textmainCss} width={80} height={80} 
        className="rounded-[50%] shadow-[1px_1px_5px_rgba(0,0,0,0.16)]">
            <tspan x={percentValue===100?cx:cx} y={cy} dy={19} dx={-5} textAnchor="middle" style={text1Css}>
                {percentValue}
            </tspan>
            <tspan x={percentLengthCheck === '2' ? cx+20: (
                percentLengthCheck === '3' ? cx+25 : cx+15
            )} y={cy} dy={19} dx={-5} style={text2Css}>%</tspan>
        </text>
        {payload.selectName!=='' && (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius-2}
                outerRadius={outerRadius+2}
                startAngle={startAngle+0.5}
                endAngle={endAngle-0.5}
                fill={payload.fillBorderColor}
                cornerRadius={cornerRadius}
            />
        )}
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            cornerRadius={cornerRadius}
        />
    </g>
  );
};
const CustomTooltipDIV = (props:any) => {
    const { active, payload, viewBox } = props;
    if (active && payload && payload.length) {
        const classNameStr = `custom-tooltip-${payload[0].name.replace(' ','')}`;
        const paddingLeftPX = viewBox.width >= 250 ? '10%': '25px';
        return (
          <div style={{
            width: '100%',
            height: '100%',
            paddingTop: '10px',
            paddingBottom: '15px',
            paddingLeft: paddingLeftPX,
            paddingRight: '25px'
          }} className={`${classNameStr} z-[1302]`} 
          
          >
            <div className="custom-tooltip-title z-[1302]">{`${payload[0].payload.tooltip.title}`}</div>
            <div className="custom-tooltip-content z-[1302] mt-[12px]">{`${payload[0].payload.tooltip.content}`}</div>
          </div>
        );
    } else return null;
}

export default function App() {
    
    const [average, setAverage] = useState<number>(0);

    const [tooltipPosition, setTooltipPosition] = useState<{x:number, y:number}>({x:0,y:0});
    const {
        unitRubricScoresData,
        reportSelectUnit,
    } = useControlAlertStore();
    
    const [allData, setAllData] = useState<THexagonDoughnutData[]>([]);
    
    React.useEffect(()=>{
        const data = unitRubricScoresData.hexagonChartData;
        console.log('data ===',data)
        const dumpData:THexagonDoughnutData[] = JSON.parse(JSON.stringify(data));
        setAllData(dumpData);
        
        let dumpAvr = 0;
        for (let i =0; i < dumpData.length; i++) {
            dumpAvr += dumpData[i].data[0].value;
        }
        const avg = parseFloat((dumpAvr/dumpData.length).toFixed(1));
        console.log('avg =',avg)
        setAverage(avg)
    },[reportSelectUnit, unitRubricScoresData])

    // const avr = 90;
    
    
    const mouseOnEvent = (e:any)=>{
        console.log('mouse on e==',e.selectName)
        let dumpAllData:THexagonDoughnutData[] = JSON.parse(JSON.stringify(allData));
        for (let i = 0; i < dumpAllData.length; i++) {
            const currentPayloadData = dumpAllData[i].data[0];
            if (currentPayloadData.name === e.name) {
                setTooltipPosition({x: e.cx, y:e.cy})
                dumpAllData[i].data[0].selectName=e.name
            } else {
                dumpAllData[i].data[0].selectName=''
            }
        }
        setAllData(dumpAllData);
    }
    const mouseOffEvent = (e:any) => {
        console.log('mouse off e==',e.selectName)
        let dumpAllData:THexagonDoughnutData[] = JSON.parse(JSON.stringify(allData));
        for (let i = 0; i < dumpAllData.length; i++) {
            dumpAllData[i].data[0].selectName=''
        }
        setAllData(dumpAllData)
    }
    const rad = 117.5
    const radAddX = 58.75
    const radAddY = 101.76
    const stDotX = 165;
    const stDotY = 170;
    const polygonDotArr = [
        {cx:stDotX, cy:stDotY-rad},
        {cx:stDotX+radAddY, cy:stDotY-radAddX},
        {cx:stDotX+radAddY, cy:stDotY+radAddX},
        {cx:stDotX, cy:stDotY+rad},
        {cx:stDotX-radAddY, cy:stDotY+radAddX},
        {cx:stDotX-radAddY, cy:stDotY-radAddX},
    ]
  return (
    
    <PieChart width={330} height={360} className="flex flex-1 z-[1302]">
        <circle cx={stDotX} cy={stDotY}
            r={117.5}
            fill="none"
            stroke="#ecf2ff"
            strokeWidth={45}
        />
        {allData.map((dataItem, dataIndex)=>{
            const polygonDot = polygonDotArr[dataIndex]
            return <Pie key={dataItem.target}
                className="pie-button-effect-none"
              activeIndex={0}
              activeShape={renderActiveShape}
              data={dataItem.data}
              cx={polygonDot.cx}
              cy={polygonDot.cy}
              innerRadius={48}
              outerRadius={56}
              fill={dataItem.data[0].fillColor}
              dataKey="value"
                onMouseOver={mouseOnEvent}
              onMouseLeave={mouseOffEvent}
              
            />
        })}
        <text x={stDotX} y={stDotY}
        textAnchor="middle"
        dy={-25}
        fontFamily="GothamRounded"
        fontWeight={500}
        fontSize={17}
        fill="#222"
        >{`Unit ${reportSelectUnit}`}</text>
        <text x={stDotX} y={stDotY}
        dy={-5}
        fontFamily="GothamRounded"
        fontWeight={500}
        fontSize={17}
        fill="#222"
        textAnchor="middle"
        >{`Overall Score`}</text>
        <text x={stDotX} y={stDotY} width={190} height={80}
        dx={5} dy={35}
        textAnchor="middle"
        fontFamily="GothamRounded"
        fontWeight={700}
        fontSize={35}
        fill="#333"
        style={{textShadow: '2px 2px 0 rgba(0,0,0,0.16)'}}
        >{average}
        <tspan 
        fontSize={28}
        >%</tspan>
        </text>
        <Tooltip position={{x:tooltipPosition.x+55, y:tooltipPosition.y-60}}  content={<CustomTooltipDIV/>}/>
        
    </PieChart>
  );
}
