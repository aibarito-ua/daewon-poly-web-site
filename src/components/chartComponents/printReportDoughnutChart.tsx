
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
export default function App() {
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
    const data = unitRubricScoresData.averageChartData.dataPayload
    React.useEffect(()=>{
    },[])
    const radiusDatas = [
        { innerRadius: 44, outerRadius: 68 },
    ]
    
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
    const decDump = decText;
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
    const pathX = sx-18;
    const pathY = sy-24;
    const pathX_right = pathX + addDump;
    const pathX_left = pathX - addDump;
    
    return (
        <g>
            <path stroke="none" fill="#fff" 
            d={`M ${pathX+34.85430145263672} ${pathY+42.68537902832031} L ${pathX+32.26688766479492} ${pathY+39.48196029663086} L ${pathX+31.96669960021973} ${pathY+39.11030197143555} L ${pathX+31.48894882202148} ${pathY+39.11030197143555} L ${pathX_left+13.00049877166748} ${pathY+39.11030197143555} C ${pathX_left+9.794979095458984} ${pathY+39.11030197143555} ${pathX_left+6.781349182128906} ${pathY+37.86209106445312} ${pathX_left+4.514759063720703} ${pathY+35.59561157226562} C ${pathX_left+2.248229265213013} ${pathY+33.32919311523438} ${pathX_left+0.9999991655349731} ${pathY+30.31586265563965} ${pathX_left+0.9999991655349731} ${pathY+27.11070251464844} L ${pathX_left+0.9999991655349731} ${pathY+12.99960231781006} C ${pathX_left+0.9999991655349731} ${pathY+9.794442176818848} ${pathX_left+2.248229265213013} ${pathY+6.781112194061279} ${pathX_left+4.514759063720703} ${pathY+4.514692306518555} C ${pathX_left+6.781349182128906} ${pathY+2.248212099075317} ${pathX_left+9.794979095458984} ${pathY+1.000002145767212} ${pathX_left+13.00049877166748} ${pathY+1.000002145767212} L ${pathX_right+57.0005989074707} ${pathY+1.000002145767212} C ${pathX_right+60.20571899414062} ${pathY+1.000002145767212} ${pathX_right+63.21905899047852} ${pathY+2.248202085494995} ${pathX_right+65.48552703857422} ${pathY+4.51467227935791} C ${pathX_right+67.75199890136719} ${pathY+6.781142234802246} ${pathX_right+69.00019836425781} ${pathY+9.794482231140137} ${pathX_right+69.00019836425781} ${pathY+12.99960231781006} L ${pathX_right+69.00019836425781} ${pathY+27.11070251464844} C ${pathX_right+69.00019836425781} ${pathY+30.31582260131836} ${pathX_right+67.75199890136719} ${pathY+33.32916259765625} ${pathX_right+65.48552703857422} ${pathY+35.59563064575195} C ${pathX_right+63.21905899047852} ${pathY+37.86210250854492} ${pathX_right+60.20571899414062} ${pathY+39.11030197143555} ${pathX_right+57.0005989074707} ${pathY+39.11030197143555} L ${pathX+38.21965789794922} ${pathY+39.11030197143555} L ${pathX+37.74190902709961} ${pathY+39.11030197143555} L ${pathX+37.44171905517578} ${pathY+39.48196029663086} L ${pathX+34.85430145263672} ${pathY+42.68537902832031} Z`}/>
            <path  stroke="none" fill={tooltipLineColor} 
            d={`M ${pathX+34.85429763793945} ${pathY+41.09388732910156} L ${pathX+37.26416397094727} ${pathY+38.11030578613281} L ${pathX_right+57.0005989074707} ${pathY+38.11030578613281} C ${pathX_right+59.9386100769043} ${pathY+38.11030578613281} ${pathX_right+62.70083236694336} ${pathY+36.96612930297852} ${pathX_right+64.77841949462891} ${pathY+34.88852691650391} C ${pathX_right+66.85601806640625} ${pathY+32.81092834472656} ${pathX_right+68.00019836425781} ${pathY+30.0487174987793} ${pathX_right+68.00019836425781} ${pathY+27.11069488525391} L ${pathX_right+68.00019836425781} ${pathY+12.99959564208984} C ${pathX_right+68.00019836425781} ${pathY+10.06158447265625} ${pathX_right+66.85601806640625} ${pathY+7.299362182617188} ${pathX_right+64.77841949462891} ${pathY+5.221773147583008} C ${pathX_right+62.70083236694336} ${pathY+3.144173145294189} ${pathX_right+59.9386100769043} ${pathY+1.999995470046997} ${pathX_right+57.0005989074707} ${pathY+1.999995470046997} L ${pathX_left+13.00049877166748} ${pathY+1.999995470046997} C ${pathX_left+10.06207656860352} ${pathY+1.999995470046997} ${pathX_left+7.29956579208374} ${pathY+3.144184350967407} ${pathX_left+5.221854686737061} ${pathY+5.221806526184082} C ${pathX_left+3.144210338592529} ${pathY+7.299351215362549} ${pathX_left+1.999999165534973} ${pathY+10.06155109405518} ${pathX_left+1.999999165534973} ${pathY+12.99959564208984} L ${pathX_left+1.999999165534973} ${pathY+27.11069488525391} C ${pathX_left+1.999999165534973} ${pathY+30.04874038696289} ${pathX_left+3.144210338592529} ${pathY+32.81095123291016} ${pathX_left+5.221854686737061} ${pathY+34.88849639892578} C ${pathX_left+7.29956579208374} ${pathY+36.96610641479492} ${pathX+10.06207656860352} ${pathY+38.11030578613281} ${pathX+13.00049877166748} ${pathY+38.11030578613281} L ${pathX+32.44443130493164} ${pathY+38.11030578613281} L ${pathX+34.85429763793945} ${pathY+41.09388732910156} 
                M ${pathX+34.85429763793945} ${pathY+44.00032806396484} C ${pathX+34.73189926147461} ${pathY+44.00032806396484} ${pathX+34.60950088500977} ${pathY+43.95285034179688} ${pathX+34.51589965820312} ${pathY+43.85790634155273} L ${pathX+31.48894309997559} ${pathY+40.11030578613281} L ${pathX_left+13.00049877166748} ${pathY+40.11030578613281} C ${pathX_left+5.82029914855957} ${pathY+40.11030578613281} ${pathX_left+(-8.178710686479462e-07)} ${pathY+34.29000473022461} ${pathX_left+(-8.178710686479462e-07)} ${pathY+27.11069488525391} L ${pathX_left+(-8.178710686479462e-07)} ${pathY+12.99959564208984} C ${pathX_left+(-8.178710686479462e-07)} ${pathY+5.820295333862305} ${pathX_left+5.82029914855957} ${pathY+(-4.542032911558636e-06)} ${pathX_left+13.00049877166748} ${pathY+(-4.542032911558636e-06)} L ${pathX_right+57.0005989074707} ${pathY+(-4.542032911558636e-06)} C ${pathX_right+64.17990112304688} ${pathY+(-4.542032911558636e-06)} ${pathX_right+70.00019836425781} ${pathY+5.820295333862305} ${pathX_right+70.00019836425781} ${pathY+12.99959564208984} L ${pathX_right+70.00019836425781} ${pathY+27.11069488525391} C ${pathX_right+70.00019836425781} ${pathY+34.29000473022461} ${pathX_right+64.17990112304688} ${pathY+40.11030578613281} ${pathX_right+57.0005989074707} ${pathY+40.11030578613281} L ${pathX+38.21965408325195} ${pathY+40.11030578613281} L ${pathX+35.19269943237305} ${pathY+43.85790634155273} C ${pathX+35.09909820556641} ${pathY+43.95285034179688} ${pathX+34.97669982910156} ${pathY+44.00032806396484} ${pathX+34.85429763793945} ${pathY+44.00032806396484} Z`}/>
            
            <text 
                x={sx-decDump}
                y={sy}
                textAnchor={textAnchor}
                fill="#333"
            >{`${clickIndex}: ${tooltipData.value}`}</text>
        </g>
    )

}

  return (
    <PieChart width={140} height={140}>
        
            {/* const currentR = radiusDatas[dataIndex] */}
            <Pie key={data.target}
                className="pie-button-effect-none"
              activeIndex={0}
              activeShape={renderActiveShape}
              data={data.data}
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
                {Math.round(data.data[0].value*10)/10}
            </tspan>
            <tspan x={cx+30} y={cy} dy={10} style={text2Css}>%</tspan>
        </text>

        
    </PieChart>
  );
}
