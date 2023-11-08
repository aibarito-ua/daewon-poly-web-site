
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Tooltip, Legend } from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";


const data1 = [
  { name: "Group A", value: 90 },
//   { name: "Group 1", value: 75 },
//   { name: "Group 2", value: 40 },
];
const data2 = [
    { name: "Group B", value: 10 },
  //   { name: "Group 1", value: 75 },
  //   { name: "Group 2", value: 40 },
  ];
// const data:TAllDoughnutDatas = [
//     {
//         target: 'conventions',
//         data: [
//             {
//                 name: 'conventions',
//                 value: 10,
//                 selectName: '',
//                 fillColor: '#db5757',
//                 fillBorderColor: '#be1f1f'
//             }
//         ],
//         addWidth: 40,
//         fitText: 40,
//         toolLineColor: '#be1f1f',
//     },
//     {
//         target: 'sentence fluency',
//         data: [
//             {
//                 name: 'sentence fluency',
//                 value: 10,
//                 selectName: '',
//                 fillColor: '#6865cc',
//                 fillBorderColor: '#433fa7'
//             }
//         ],
//         addWidth: 55,
//         fitText: 55,
//         toolLineColor: '#433fa7'
//     },
//     {
//         target: 'word choice',
//         data: [
//             {
//                 name: 'word choice',
//                 value: 10,
//                 selectName: '',
//                 fillColor: '#30c194',
//                 fillBorderColor: '#12986f'
//             }
//         ],
//         addWidth: 40,
//         fitText: 40,
//         toolLineColor: '#12986f'
//     },
//     {
//         target: 'voice',
//         data: [
//             {
//                 name: 'voice',
//                 value: 10,
//                 selectName: '',
//                 fillColor: '#aa6bd4',
//                 fillBorderColor: '#863fb5'
//             }
//         ],
//         addWidth: 10,
//         fitText: 14,
//         toolLineColor: '#863fb5'
//     },
//     {
//         target: 'organization',
//         data: [
//             {
//                 name: 'organization',
//                 value: 10,
//                 selectName: '',
//                 fillColor: '#f6914d',
//                 fillBorderColor: '#ee711e'
//             }
//         ],
//         addWidth: 40,
//         fitText: 40,
//         toolLineColor: '#ee711e'
//     },
//     {
//         target: 'ideas',
//         data: [
//             {
//                 name: 'ideas',
//                 value: 90,
//                 selectName: '',
//                 fillColor: '#588ee1',
//                 fillBorderColor: '#1f61c8'
//             }
//         ],
//         addWidth: 10,
//         fitText: 14,
//         toolLineColor: '#1f61c8'
//     },
// ]
const renderActiveShape = (props: any) => {
    // console.log('props: ',props)
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    // midAngle,
    innerRadius,
    outerRadius,
    // startAngle,
    // endAngle,
    
    fill,
    payload,
    percent,
    value
  } = props;
  const midAngle = 45;
  const startAngle = 90;
  const endAngle = 90-value/100*360;
  const radiusMid = outerRadius-innerRadius;
const cornerRadius = radiusMid/2;
const trackRadius = innerRadius + cornerRadius;
  return (
    <g>
        <circle cx={cx} cy={cy}
            r={trackRadius}
            fill="none"
            stroke="#f5f5f5"
            strokeWidth={10}
        />
        {payload.selectName!=='' && (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle+0.5}
                endAngle={endAngle-0.5}
                fill={payload.fillBorderColor}
                cornerRadius={cornerRadius}
            />
        )}
        {payload.selectName!=='' && (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius+2}
                outerRadius={outerRadius-2}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={cornerRadius}
            />
        )}
        {payload.selectName==='' && (
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
        )}
    </g>
  );
};

export default function App() {
    const {reportSelectedOverallPieChart, reportSelectFinder} = useControlAlertStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const [clickIndex, setClickIndex] = useState<string>('');
    const [tooltipData, setTooltipData] = useState<{value:number, outerRadius:number}>({
        value: 0, outerRadius: 0
    });
    const [allData, setAllData] = useState<TAllDoughnutDatas>([]);
    const [legendData, setLegendData] = useState<TCircleLegendItems[]>([]);
    const [addWidth, setAddWidth] = useState<number>(0);
    const [decText, setDecText] = useState<number>(0);
    const [tooltipLineColor, setTooltipLineColor] = useState<string>('');
    const [average, setAverage] = useState<number>(0);
    const labelNames = [
        'ideas',
        'organization',
        'voice',
        'word choice',
        'sentence fluency',
        'conventions'
    ];
    const radiusDatas = [
        { innerRadius: 60, outerRadius: 70 },
        { innerRadius: 75, outerRadius: 85 },
        { innerRadius: 90, outerRadius: 100 },
        { innerRadius: 105, outerRadius: 115 },
        { innerRadius: 120, outerRadius: 130 },
        { innerRadius: 135, outerRadius: 145 }
    ]
    React.useEffect(()=>{
        
        console.log('pie chart reportSelectedOverallPieChart =',reportSelectedOverallPieChart)
        const dumpData:TAllDoughnutDatas = JSON.parse(JSON.stringify(reportSelectedOverallPieChart));
        let dumyLegendData:TCircleLegendItems[]=[];
        const length = dumpData.length
        let sum_val = 0;
        for (let i = 0; i < length; i++) {
            sum_val += dumpData[i].data[0].value;
            let dumyLegendItem:TCircleLegendItems = {
                circleColor: dumpData[i].data[0].fillColor,
                circleLabel: dumpData[i].target,
                eventValue: dumpData[i].data[0].value,
                innerRadius: radiusDatas[i].innerRadius,
                key: `report-legend-pie-chart-${dumpData[i].target}`
            }
            dumyLegendData.push(dumyLegendItem);
        }
        
        dumyLegendData.sort((a,b) => {
            return labelNames.indexOf(a.circleLabel)-labelNames.indexOf(b.circleLabel)
        });
        console.log('dumyLegendData =',dumyLegendData)
        setLegendData(dumyLegendData)
        const avr = sum_val/length;
        console.log('avr =',avr)
        setAverage(avr)
        setAllData(reportSelectedOverallPieChart);
    },[reportSelectedOverallPieChart, reportSelectFinder])
    
    
    
    // const avr = 90;
    const cx = 145;
    const cy = 145;
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
    
}
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

const textTooltip = () => {
    const addDump = addWidth;
    const decDump = decText +12;
    const RADIAN = Math.PI / 180;
    const midAngle = 45;
    const startAngle = 90;
    const endAngle = 90-tooltipData.value/100*360;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (tooltipData.outerRadius + 10) * cos;
    const sy = cy + (tooltipData.outerRadius + 10) * sin;
    const mx = cx + (tooltipData.outerRadius + 30) * cos;
    const my = cy + (tooltipData.outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const pathX = sx-40;
    const pathY = sy-24;
    const pathX_right = pathX + addDump -10;
    const pathX_left = pathX - addDump;
    const vX = pathX_right+pathX_left
    // 소수점 변경
    const currentScore = tooltipData.value;
    const scoreReplace1 = Math.round(currentScore*10);
    const scoreResult = scoreReplace1/10;


    return (
        
        <g id="Union" filter="url(#filter0_d_620_3639)">
            <defs>
<filter id="filter0_d_620_3639" x={pathX_left} y={pathY} width={vX} height="59" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_620_3639"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_620_3639" result="shape"/>
</filter>
</defs>
        <mask id="path-1-inside-1_620_3639" fill="white">
            {/* <path stroke="none" fill="#fff"  */}
        <path fillRule="evenodd" clipRule="evenodd"
            d={
            `M${pathX_left+16} ${pathY+0}
            C${pathX_left+9.37258} ${pathY+0} ${pathX_left+4} ${pathY+5.37258} ${pathX_left+4} ${pathY+12}
            V${pathY+32}
            C${pathX_left+4} ${pathY+38.6274} ${pathX_left+9.37258} ${pathY+44} ${pathX_left+16} ${pathY+44}

            H${pathX+54}
            L${pathX+58.134} ${pathY+50.5}
            C${pathX+58.5189} ${pathY+51.1667} ${pathX+59.4811} ${pathY+51.1667} ${pathX+59.866} ${pathY+50.5}
            L${pathX+63.6188} ${pathY+44}

            H${pathX_right+102}
            C${pathX_right+108.627} ${pathY+44} ${pathX_right+114} ${pathY+38.6274} ${pathX_right+114} ${pathY+32}
            V${pathY+12}
            C${pathX_right+114} ${pathY+5.37258} ${pathX_right+108.627} ${pathY+0} ${pathX_right+102} ${pathY+0}
            H${pathY}
            Z`
            }/>
        </mask>

<path fillRule="evenodd" clipRule="evenodd"
fill="white"
d={
    `M${pathX_left+16} ${pathY+0}
    C${pathX_left+9.37258} ${pathY+0} ${pathX_left+4} ${pathY+5.37258} ${pathX_left+4} ${pathY+12}
    V${pathY+32}
    C${pathX_left+4} ${pathY+38.6274} ${pathX_left+9.37258} ${pathY+44} ${pathX_left+16} ${pathY+44}
    
    H${pathX+54}
    L${pathX+58.134} ${pathY+50.5}
    C${pathX+58.5189} ${pathY+51.1667} ${pathX+59.4811} ${pathY+51.1667} ${pathX+59.866} ${pathY+50.5}
    L${pathX+63.6188} ${pathY+44}
    
    H${pathX_right+102}
    C${pathX_right+108.627} ${pathY+44} ${pathX_right+114} ${pathY+38.6274} ${pathX_right+114} ${pathY+32}
    V${pathY+12}
    C${pathX_right+114} ${pathY+5.37258} ${pathX_right+108.627} ${pathY+0} ${pathX_right+102} ${pathY+0}
    H${pathY}
    Z`
}/>
<path fill={tooltipLineColor}
mask={"url(#path-1-inside-1_620_3639)"}
d={
`
M${pathX+54.3812} ${pathY+44}
L${pathX+56.9793} ${pathY+42.5}
C${pathX+56.4434} ${pathY+41.5718} ${pathX+55.453} ${pathY+41} ${pathX+54.3812} ${pathY+41}
V${pathX+44}

ZM${pathX+58.134} ${pathY+50.5}
L${pathX+60.7321} ${pathY+49}
L${pathX+60.7321} ${pathY+49}
L${pathX+58.134} ${pathY+50.5}

ZM${pathX+59.866} ${pathY+50.5}
L${pathX+57.2679} ${pathY+49}
L${pathX+57.2679} ${pathY+49}
L${pathX+59.866} ${pathY+50.5}

ZM${pathX+63.6188} ${pathY+44}
V${pathY+41}
C${pathX+62.547} ${pathY+41} ${pathX+61.5566} ${pathY+41.5718} ${pathX+61.0207} ${pathY+42.5}
L${pathX+63.6188} ${pathY+44}

ZM${pathX_left+7} ${pathY+12}
C${pathX_left+7} ${pathY+7.02944} ${pathX_left+11.0294} ${pathY+3} ${pathX_left+16} ${pathY+3}
V${pathY-3}
C${pathX_left+7.71573} ${pathY-3} ${pathX_left+1} ${pathY+3.71573} ${pathX_left+1} ${pathY+12}
H${pathX_left+7}

ZM${pathX_left+7} ${pathY+32}
V${pathY+12}
H${pathX_left+1}
V${pathY+32}
H${pathY+7}

ZM${pathX_left+16} ${pathY+41}
C${pathX_left+11.0294} ${pathY+41} ${pathX_left+7} ${pathY+36.9706} ${pathX_left+7} ${pathY+32}
H${pathX_left+1}
C${pathX_left+1} ${pathY+40.2843} ${pathX_left+7.71573} ${pathY+47} ${pathX_left+16} ${pathY+47}
V${pathY+41}

ZM${pathX_left+54.3812} ${pathY+41}
H${pathX_left+16}
V${pathY+47}
H${pathX+54.3812}
V${pathY+41}

ZM${pathX+60.7321} ${pathY+49}
L${pathX+56.9793} ${pathY+42.5}
L${pathX+51.7831} ${pathY+45.5}
L${pathX+55.5359} ${pathY+52}
L${pathX+60.7321} ${pathY+49}

ZM${pathX+57.2679} ${pathY+49}
C${pathX+58.0377} ${pathY+47.6667} ${pathX+59.9623} ${pathY+47.6667} ${pathX+60.7321} ${pathY+49}
L${pathX+55.5359} ${pathY+52}
C${pathX+57.0755} ${pathY+54.6667} ${pathX+60.9245} ${pathY+54.6667} ${pathX+62.4641} ${pathY+52}
L${pathX+57.2679} ${pathY+49}

ZM${pathX+61.0207} ${pathY+42.5}
L${pathX+57.2679} ${pathY+49}
L${pathX+62.4641} ${pathY+52}
L${pathX+66.2169} ${pathY+45.5}
L${pathX+61.0207} ${pathY+42.5}

ZM${pathX+102} ${pathY+41}
H${pathX+63.6188}
V${pathY+47}
H${pathX_right+102}
V${pathY+41}

ZM${pathX_right+111} ${pathY+32}
C${pathX_right+111} ${pathY+36.9706} ${pathX_right+106.971} ${pathY+41} ${pathX_right+102} ${pathY+41}
V${pathY+47}
C${pathX_right+110.284} ${pathY+47} ${pathX_right+117} ${pathY+40.2843} ${pathX_right+117} ${pathY+32}
H${pathX_right+111}

ZM${pathX_right+111} ${pathY+12}
V${pathY+32}
H${pathX_right+117}
V${pathY+12}
H${pathX_right+111}

ZM${pathX_right+102} ${pathY+3}
C${pathX_right+106.971} ${pathY+3} ${pathX_right+111} ${pathY+7.02944} ${pathX_right+111} ${pathY+12}
H${pathX_right+117}
C${pathX_right+117} ${pathY+3.71573} ${pathX_right+110.284} ${pathY-3} ${pathX_right+102} ${pathY-3}
V${pathY+3}

ZM${pathX_right+16} ${pathY+3}
H${pathX_right+102}
V${pathY-3}
H${pathX_left+16}
V${pathY+3}
Z
`
} />
<text 
    x={sx-decDump}
    y={sy+4}
    textAnchor={textAnchor}
    fill="#333"
    
>
    <tspan
    fontFamily="GothamRounded"
    fontSize={14}
    style={{textTransform:'capitalize'}}
    >{`${clickIndex}: ${scoreResult}`}</tspan>
    <tspan
    fontFamily="GothamRounded"
    fontSize={12}
    >{'%'}</tspan>
    </text>
        </g>
    )

}
const mouseOnEvent = (e:any, name?:string, eventValue?:number, legendInnerRadius?:number )=>{
    console.log('click =',e)
    console.log('click name =',e.name)
    console.log('click value =',e.value)
    console.log('active',activeIndex)
    let eName = e.name? e.name: name;
    let value= e.value? e.value: eventValue;
    setClickIndex(eName)
    //   let outerR = e.outerRadius;
    let outerR = e.innerRadius?e.innerRadius: legendInnerRadius;
      let dumpAllData:TAllDoughnutDatas = JSON.parse(JSON.stringify(allData));
      for (let i = 0; i < dumpAllData.length; i++) {
        const currentPayloadData = dumpAllData[i].data[0];
        if (currentPayloadData.name === eName) {
            
            dumpAllData[i].data[0].selectName=eName
            setTooltipLineColor(dumpAllData[i].toolLineColor)
            setDecText(dumpAllData[i].fitText);
            setAddWidth(dumpAllData[i].addWidth);
        } else {
            dumpAllData[i].data[0].selectName=''
        }
    }
    setTooltipData({outerRadius:outerR, value: value})
    setAllData(dumpAllData);
}
const mouseOffEvent = (e:any) => {
    let dumpAllData:TAllDoughnutDatas = JSON.parse(JSON.stringify(allData));
    for (let i = 0; i < dumpAllData.length; i++) {
        dumpAllData[i].data[0].selectName=''
    }
    setClickIndex('')
    setTooltipLineColor('')
    setDecText(0)
    setAddWidth(0)
    setTooltipData({value: 0, outerRadius: 0})
    setAllData(dumpAllData)
}

// Legend
const DoughnutChartLegend = () => {

    const legendJsx = legendData.sort((a,b) => {
        return labelNames.indexOf(a.circleLabel) - labelNames.indexOf(b.circleLabel)
    }).map((item, labelIndex)=> {
        const key = 'report-chart-'+item.circleLabel+'-'+labelIndex;
        
        if (item.circleLabel === 'ideas') {
            return <div className={`w-[128px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-idea`} 
                key={key}
                onMouseEnter={mouseOnEvent}
                onMouseOut={mouseOffEvent}
            ></div>
        } else if (item.circleLabel === 'organization') {
            return <div className={`w-[161px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-organization`} key={key} ></div>
        } else if (item.circleLabel === 'voice') {
            return <div className={`w-[124px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-voice`} key={key} ></div>
        } else if (item.circleLabel === 'word choice') {
            return <div className={`w-[128px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-word-choice`} key={key} ></div>
        } else if (item.circleLabel === 'sentence fluency') {
            return <div className={`w-[161px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-sentence-fluency`} key={key} ></div>
        } else if (item.circleLabel === 'conventions') {
            return <div className={`w-[124px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-conventions`} key={key} ></div>
        }
    })
    // return (
    //     <div className='flex flex-col w-[413px] h-[60px]'>
    //        <div className='flex flex-row'>
    //        {legendJsx[0]} {legendJsx[1]} {legendJsx[2]}
    //        </div>
    //        <div className='flex flex-row'>
    //        {legendJsx[3]} {legendJsx[4]} {legendJsx[5]}
    //        </div>
    //     </div>
    // )
}

// const testPercent = 100;
const mainPercent = Math.round(average*10)/10;
console.log('average =',average)
console.log('mainPercent ==',mainPercent)
// const mainPercent = Math.round(testPercent*10)/10;
const mainPercentString = mainPercent.toString();
const replaceDot = mainPercentString.replace('.','')
const checkPercentDigit = mainPercent === 100 ? '3': (
    mainPercent >= 0 && mainPercent < 10 ? '1': '2'
)
const checkDot = mainPercentString === replaceDot;

// checkMainPercent 
// 1 : 1자리 2: 2자리 3: 100 or 소수점 4 소수점
const cx2dot1 = cx+30;
const cx2dotN = cx+20;
const cx1dot1 = cx+25;
const cx1dotN = cx+15;
const percentCharacterPositionX = checkPercentDigit === '3' ? cx2dot1 : (
    checkPercentDigit === '2' ? (
        checkDot ? cx2dotN : cx2dot1
    ) : (
        checkDot ? cx1dotN : cx1dot1
    )
)

  return (
    <div>
    <PieChart width={350} height={300}>
        

        <text x={cx} y={cy} dy={12} textAnchor="middle" style={textmainCss} width={80} height={80} className="rounded-[50%] shadow-[1px_1px_5px_rgba(0,0,0,0.16)]">
            <tspan x={cx} y={cy} dy={12} textAnchor="middle" style={text1Css}>
                {mainPercent}
            </tspan>
            <tspan x={percentCharacterPositionX} y={cy} dy={12} textAnchor="middle" style={text2Css}>%</tspan>
        </text>
        {allData.map((dataItem, dataIndex)=>{
            const currentR = radiusDatas[dataIndex]
            return <Pie key={dataItem.target}
                className="pie-button-effect-none"
              activeIndex={0}
              activeShape={renderActiveShape}
              data={dataItem.data}
              cx={cx}
              cy={cy}
              innerRadius={currentR.innerRadius}
              outerRadius={currentR.outerRadius}
              fill={dataItem.data[0].fillColor}
              dataKey="value"
              onMouseEnter={(e) =>mouseOnEvent(e)}
              onMouseOut={mouseOffEvent}
            //   onClick={}
            />

        })}
        
        {clickIndex!=='' && textTooltip()}
    </PieChart>
        <div className='flex flex-col w-[413px] h-[60px]'>
           <div className='flex flex-row'>
                <div className={`w-[128px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-idea hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[0].circleLabel, legendData[0].eventValue, legendData[0].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
                <div className={`w-[161px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-organization hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[1].circleLabel, legendData[1].eventValue, legendData[1].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
                <div className={`w-[124px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-voice hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[2].circleLabel, legendData[2].eventValue, legendData[2].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
           </div>
           <div className='flex flex-row'>
                <div className={`w-[128px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-word-choice hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[3].circleLabel, legendData[3].eventValue, legendData[3].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
                <div className={`w-[161px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-sentence-fluency hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[4].circleLabel, legendData[4].eventValue, legendData[4].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
                <div className={`w-[124px] h-[30px] bg-no-repeat bg-origin-border bg-contain bg-report-pie-chart-legend-item-conventions hover:cursor-pointer`} 
                    onMouseEnter={(e)=>mouseOnEvent(e, legendData[5].circleLabel, legendData[5].eventValue, legendData[5].innerRadius)}
                    onMouseOut={mouseOffEvent}
                ></div>
           </div>
        </div>
    </div>
  );
}
