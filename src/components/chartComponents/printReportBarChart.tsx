import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from "recharts";
import useControlAlertStore from "../../store/useControlAlertStore";


// custom bar
    const getPath = (x: number, y: number, width: number, height: number) => {
        return `M ${x} ${y} L ${x+width} ${y} C ${x+width+height} ${y} ${x+width+height} ${y+height} ${x+width} ${y+height} L ${x} ${y+height} L ${x} ${x+height} Z`;
    };
  
  const RemakeBar: React.FunctionComponent<any> = (props: any) => {
        // console.log("triangle =",props)
        const { fill, x, width, payload } = props;
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
        const { x, payload } = props;
        const customBarY = [10, 32, 54, 76, 98, 120];
        return (
        <g>
            <text 
            textAnchor="end"
            fontFamily="NotoSansCJKKR"
            // fontSize={12}
            fontSize={'2.902mm'}
            fontWeight={400}
            fill="#222"
            height={'18px'}
            dy={9}
            x={x} y={customBarY[payload.index]}>{payload.value}</text>
        </g>
        );
    };
export default function App() {
    const {unitRubricScoresData, reportSelectUnit} = useControlAlertStore();
    const [ data, setData] = React.useState<TBarChartsData[]>([]);
    React.useEffect(()=>{
       setData(unitRubricScoresData.barChartData) 
    },[unitRubricScoresData, reportSelectUnit])
    // custom bar labels
    const CustomizedBarLabel = (props:any) => {
        const customBarY = [10, 32, 54, 76, 98, 120]
        const { value, index, viewBox } = props;
        return <text
            x={viewBox.width+viewBox.x+10}
            y={customBarY[index]}
            dy={10}
        >{value}%</text>
    }
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
      className="export-report-wr-bar-titles"
    >
      <CartesianGrid strokeDasharray="3 3" 
        height={140}
        horizontal={false}
      />
      <XAxis type="number" axisLine={false}
      max={100}
      ticks={['0','10','20','30','40','50','60','70','80','90','100']}
      tickSize={0}
      tickFormatter={()=>''}
      domain={[0,100]}
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
