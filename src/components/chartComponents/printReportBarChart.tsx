import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";
import UnitReportModalComponent from '../toggleModalComponents/UnitReportModalComponent';
const DotIcon = (props:React.SVGAttributes<SVGElement>) => {
return (<svg {...props} viewBox="0 0 20 20" width={14} height={14}>
    
        <path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
    
    </svg>)
}
// const colors = [
//     {key: 'idea', start:'#c9defc', end: '#588ee1'},
//     {key: 'organization', start:'#ffd1b2', end: '#f6914d'},
//     {key: 'voice', start:'#efd6ff', end: '#aa6bd4'},
//     {key: 'word choice', start:'#c2f3e4', end: '#30c194'},
//     {key: 'sentence fluency', start:'#e0dfff', end: '#6865cc'},
//     {key: 'conventions', start:'#ffdcdc', end: '#db5757'},
// ]

// const data = [
//   {
//     name: "idea",
//     score: 60,
//     colors: { start:'#c9defc', end: '#588ee1'},
//     customY: 10,
//   },
//   {
//     name: "organization",
//     score: 20,
//     colors: { start:'#ffd1b2', end: '#f6914d'},
//     customY: 32,
//   },
//   {
//     name: "voice",
//     score: 60,
//     colors: { start:'#efd6ff', end: '#aa6bd4'},
//     customY: 54,
//   },
//   {
//     name: "word choice",
//     score: 100,
//     colors: { start:'#c2f3e4', end: '#30c194'},
//     customY: 76,
//   },
//   {
//     name: "sentence fluency",
//     score: 80,
//     colors: { start:'#e0dfff', end: '#6865cc'},
//     customY: 98,
//   },
//   {
//     name: "conventions",
//     score: 60,
//     colors: { start:'#ffdcdc', end: '#db5757'},
//     customY: 120
//   }
// ];
type TBarChartData = {
    name: string;
    unit1: number;
    unit2: number;
    unit3: number;
    unit4: number;
    unit5: number;
    amt: number;
}
// 1차 데이터 가공
const changeDataForm = (unitRubricScoresData:TUnitScoreData) => {
    const targetData = unitRubricScoresData.unitsData;
    let barChartData:TBarChartData[] = []
    const rubricDataLabels = [
        'ideas',
        'organization',
        'voice',
        'word choice',
        'sentence fluency',
        'conventions',
    ]
    for (let i = 0; i < rubricDataLabels.length; i++) {
        const rubricName = rubricDataLabels[i];
        const rubricScore:TBarChartData = {
            name: rubricName,
            unit1: 0, unit2: 0, unit3:0, unit4:0, unit5:0, amt:10
        };
        // unit datas for loop
        for (let j = 0; j < targetData.length; j++) {
            const unitTargetData = targetData[j];
            if (unitTargetData.unit_index===1) {
                const rubricTarget = unitTargetData.categories;
                for (let z = 0; z < rubricTarget.length; z++) {
                    const rubricTargetName = rubricTarget[z].category;
                    if (rubricTargetName === rubricName) {
                        rubricScore.unit1 = rubricTarget[z].score;
                        break;
                    }
                }
            } else if (unitTargetData.unit_index===2) {
                const rubricTarget = unitTargetData.categories;
                for (let z = 0; z < rubricTarget.length; z++) {
                    const rubricTargetName = rubricTarget[z].category;
                    if (rubricTargetName === rubricName) {
                        rubricScore.unit2 = rubricTarget[z].score;
                        break;
                    }
                }
            } else if (unitTargetData.unit_index===3) {
                const rubricTarget = unitTargetData.categories;
                for (let z = 0; z < rubricTarget.length; z++) {
                    const rubricTargetName = rubricTarget[z].category;
                    if (rubricTargetName === rubricName) {
                        rubricScore.unit3 = rubricTarget[z].score;
                        break;
                    }
                }
            } else if (unitTargetData.unit_index===4) {
                const rubricTarget = unitTargetData.categories;
                for (let z = 0; z < rubricTarget.length; z++) {
                    const rubricTargetName = rubricTarget[z].category;
                    if (rubricTargetName === rubricName) {
                        rubricScore.unit4 = rubricTarget[z].score;
                        break;
                    }
                }
            } else if (unitTargetData.unit_index===5) {
                const rubricTarget = unitTargetData.categories;
                for (let z = 0; z < rubricTarget.length; z++) {
                    const rubricTargetName = rubricTarget[z].category;
                    if (rubricTargetName === rubricName) {
                        rubricScore.unit5 = rubricTarget[z].score;
                        break;
                    }
                }
            };
        }; //unit datas for loop End
        barChartData.push(rubricScore)
    };
    console.log('barChartData =',barChartData)
    return barChartData;
}
// 2차 데이터 가공
const processChangeDataForm = (data: TBarChartData[]) => {
    const rubricDataLabels = [
        'ideas',
        'organization',
        'voice',
        'word choice',
        'sentence fluency',
        'conventions',
    ];
    const rubricDataLength = rubricDataLabels.length;
    let processData: TBarChartData[] = [];
    // const rubricAverageScore:TBarChartData = {
    //     name: rubricName,
    //     unit1: 0, unit2: 0, unit3:0, unit4:0, unit5:0, amt:10
    // };
    for (let i = 0; i < data.length; i++) {
        const targetRubricData = data[i];
    }
}

// custom bar
    const getPath = (x: number, y: number, width: number, height: number) => {
        return `M ${x} ${y} L ${x+width} ${y} C ${x+width+height} ${y} ${x+width+height} ${y+height} ${x+width} ${y+height} L ${x} ${y+height} L ${x} ${x+height} Z`;
    };
  
  const RemakeBar: React.FunctionComponent<any> = (props: any) => {
        // console.log("triangle =",props)
        const { fill, x, y, width, height, payload } = props;
        const pathD = getPath(x+0.5, payload.customY, width-8, 10);
        const startColor = payload.colors.start;
        const endColor = payload.colors.end;
        return <g>
            <defs>
            <linearGradient id="printReportScoreBarGradientColor" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="50%" stopColor={startColor} stopOpacity={0.6} />
                <stop offset="95%" stopColor={endColor} stopOpacity={0.6} />
            </linearGradient>
            </defs>
            <path d={pathD} stroke="none" fill={fill} />;
            </g>
    };
  
// custom tick titles
    const customizedGroupTick = (props: any) => {
        const { index, x, y, payload } = props;
        const customBarY = [10, 32, 54, 76, 98, 120]
    //   console.log('customized ==',props)
    //   console.log(`index: ${index}, x=${x}, y=${y}`)
    //   console.log('payload =',payload)
    // console.log('customY = ',customBarY[payload.index])
        return (
        <g>
            <text 
            textAnchor="end"
            fontFamily="Noto Sans CJK KR"
            fontSize={12}
            fontWeight={400}
            fill="#222"
            height={'18px'}
            dy={9}
            x={x} y={customBarY[payload.index]}>{payload.value}</text>
        </g>
        );
    };
// custom bar labels
    const CustomizedBarLabel = (props:any) => {
        console.log('label props =',props)
        const customBarY = [10, 32, 54, 76, 98, 120]
        const {
            x, y, fill, value, index,
            viewBox
        } = props;
        const reDy = viewBox.height/2
        return <text
            x={viewBox.width+viewBox.x+10}
            y={customBarY[index]}
            dy={10}
        >{value}%</text>
    }
export default function App() {
    const {unitRubricScoresData, reportSelectUnit, unitReportData} = useControlAlertStore();
    const [ data, setData] = React.useState<TBarChartsData[]>([]);
    // data form process 1
    // const dataAllProcess:TBarChartData[] = changeDataForm(unitRubricScoresData);
    // const data = unitRubricScoresData.barChartData;
    React.useEffect(()=>{
       setData(unitRubricScoresData.barChartData) 
       console.log('in report bar chart print =')
       console.log('unitRubricScoresData =',unitRubricScoresData)
       console.log('reportSelectUnit =',reportSelectUnit)
    },[unitRubricScoresData, reportSelectUnit])
    // const data:TBarChartData[] = processChangeDataForm(dataAllProcess);
  return (
    <BarChart
    layout={'vertical'}
    width={595}
    height={140}
    data={data}
    margin={{
      top: 0,
      right: 50,
      left: 50,
      bottom: 0
    }}
      className="font-[NotoSansCJKKR] capitalize"
    >
      <CartesianGrid strokeDasharray="3 3" 
        height={140}
        horizontal={false}
      />
      <XAxis type="number" axisLine={false} tick={true}
      ticks={['0','10','20','30','40','50','60','70','80','90','100']}
      
      tickSize={0}
      tickFormatter={()=>''}
      />
      <YAxis dataKey="name" type="category" 
      axisLine={true}
      stroke="#cccccc"
      tickLine={false}
      scale="band"
      tick={customizedGroupTick}
      interval={0}
      />
      <defs>
        {data.map((item, linearIndex) => {
            // console.log('linear item =',item)
            return<linearGradient key={linearIndex}
            id={`printReportScoreBarGradientColor${linearIndex}`}
            x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor={item.colors.start} stopOpacity={1} />
                <stop offset="70%" stopColor={item.colors.end} stopOpacity={1} />
            </linearGradient>
        })}
      </defs>
      
      <Bar
        dataKey="score"
        fill="#8884d8"
        shape={<RemakeBar />}
        label={<CustomizedBarLabel/>}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`url(#printReportScoreBarGradientColor${index})`} />
        ))}
      </Bar>
    
    </BarChart>
  );
}
