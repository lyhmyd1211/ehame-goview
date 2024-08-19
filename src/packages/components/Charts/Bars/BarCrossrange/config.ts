import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { BarCrossrangeConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis', 'grid']
export const seriesItem = {
  type: 'bar',
  barWidth: null,
  label: {
    show: true,
    position: 'right',
    color: '#fff',
    fontSize: 12
  },
  roundCap: true,
  itemStyle: {
    color: function (params) {
      let colorList = [
        '#c4ebad','#6be6c1','#a0a7e6','#96dee8','#3fb1e3'
      ];
      let colorItem = colorList[params.dataIndex%5];
      return colorItem;
    },
    borderRadius: 10
  }
}
export const scroll = {
  isScroll:false,
  scrollNum:5
}
export const option = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'shadow'
    }
  },
  xAxis: {
    show: true,
    type: 'value'
  },
  yAxis: {
    show: true,
    type: 'category'
  },
  dataset: { ...dataJson },
  series: [seriesItem, seriesItem],
  dataZoom: [
    //滑动条
    {
      yAxisIndex: 0, //这里是从X轴的0刻度开始
      show: true, //是否显示滑动条，不影响使用
      type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
      startValue: 0, // 从头开始。
      endValue: 4, // 一次性展示5个。
      textStyle:{
        color:'#fff'
      },
      zoomLock:true,
      right:5,
      brushSelect:false
    },
  ],

}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BarCrossrangeConfig.key
  public chartConfig = cloneDeep(BarCrossrangeConfig)
  // 图表配置项
  public option = {...echartOptionProfixHandle(option, includes),...scroll}
}
