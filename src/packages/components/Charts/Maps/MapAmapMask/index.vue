<template>
  <div>
    <div ref="vChartRef" class='amap-main' :style="transformStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, toRefs, watch, computed, onMounted, nextTick } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch, useChartInteract } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { JSONParse, getAdministrativeLevel, getUUID, getUpperLevelCode, isArray } from '@/utils'
import { ComponentInteractParamsEnum } from './interact'
import { InteractEventOn } from '@/enums/eventEnum'
import { useAmap } from './hooks/useAmap.hooks'
import { useOfflineAmap } from './hooks/useOfflineMap.hooks'
import { useMarker } from './hooks/useMarker.hooks'
import { useMaskandPolygon } from './hooks/useMaskandPolygon.hooks'
import { debounce } from 'lodash'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})


const curApiCode = ref()
const vChartRef = ref<HTMLElement>()
const fnArr = ref()
const changeMap = (code:string)=>{
  useChartInteract(
    // 固定参数
    props.chartConfig,
    // 固定参数
    useChartEditStore,
    // 定义的类型和对应的值
    { [ComponentInteractParamsEnum.DATA]: code },
    // 事件类型
    InteractEventOn.ZOOM
  )
  curApiCode.value = code
}


const changePlusMap = (code:string)=>{
  useChartInteract(
    // 固定参数
    props.chartConfig,
    // 固定参数
    useChartEditStore,
    // 定义的类型和对应的值
    { [ComponentInteractParamsEnum.DATA]: code },
    // 事件类型
    InteractEventOn.ZOOMPlus
  )
}


const changeReduceMap = (code:string)=>{
  useChartInteract(
    // 固定参数
    props.chartConfig,
    // 固定参数
    useChartEditStore,
    // 定义的类型和对应的值
    { [ComponentInteractParamsEnum.DATA]: code },
    // 事件类型
    InteractEventOn.ZoomReduce
  )
}
const chartEditStore = useChartEditStore()
const mapIns = ref()
const AMapIns = ref()
const addPolygonFn = ref()
const markerPo = ref()
const dataHandleFn = ref()
const curHoverPolygon = ref()

// let fn = null
// if (props.chartConfig.option.mapOptions.isOffLine) {
//   fn = useOfflineAmap
// }else{
//   fn = useAmap
// }
let fn = props.chartConfig.option.mapOptions.isOffLine?useOfflineAmap:useAmap
const {transformStyle,beingZoom,initMap} = fn(props.chartConfig,vChartRef,changeMap,changePlusMap,changeReduceMap,curHoverPolygon)




const init = (dataset:any)=>{
  // try {
      initMap(props.chartConfig.option.mapOptions,(map:any,AMap:any)=>{
        mapIns.value = map
        AMapIns.value = AMap
        const {add} = useMaskandPolygon(mapIns.value,AMapIns.value,props.chartConfig,beingZoom,curHoverPolygon)
        addPolygonFn.value = add
        let code = curApiCode.value||props.chartConfig.option.mapRegion.curAreaInfo.adcode
        addPolygonFn?.value(code,props.chartConfig.option.dataset.markers?null:props.chartConfig.option.dataset)
        const {marker,dataHandle} = useMarker(props.chartConfig.option,AMapIns.value,mapIns.value,initMap)
        markerPo.value = marker.value
        markerPo.value&&addPoint(getAdministrativeLevel(code))
        dataHandleFn.value = dataHandle
      })
    // } catch (error) {
    //   console.log(error)
    // }
}

const index = ref()
const cLevel = ref()
const addPoint = (curLevel:number)=>{
  if (curLevel ===3) {
    index.value = chartEditStore.componentList.findIndex(i=>i.id===markerPo.value.id_district)
  }else
  if (curLevel ===2) {
    index.value = chartEditStore.componentList.findIndex(i=>i.id===markerPo.value.id_city)
  }else{
    index.value = chartEditStore.componentList.findIndex(i=>i.id===markerPo.value.id) 
  }
  cLevel.value = curLevel
}

watch(()=>chartEditStore.componentList[index.value]?.option.dataset,debounce((d)=>{
  dataHandleFn.value&&dataHandleFn.value(props.chartConfig.option.dataset,[chartEditStore.componentList[index.value]],cLevel.value)
  },300),{
    deep:true,
  })




watch(
  () => props.chartConfig.option.dataset,
  newData => {
    let code = curApiCode.value||props.chartConfig.option.mapRegion.curAreaInfo.adcode
    if (newData&&JSON.stringify(newData)!=='{}') {
      if (newData.features&&newData.features.length>1) {
        code = getUpperLevelCode(newData.features[0].properties.adcode)
      }else if(newData.features){
        code = newData.features[0].properties.adcode
      }
    }
    // mapIns.value&&mapIns.value.clearMap()
    if (addPolygonFn.value) {
      addPolygonFn.value(code,newData.markers?null:newData)
    }

    if (markerPo.value) {
      addPoint(getAdministrativeLevel(code))
    }
  },
  {
    deep: true,
    immediate:false
  }
)

onMounted(()=>{
    init(props.chartConfig.option.dataset)
})

// 预览
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  props.chartConfig.option.dataset = {...JSONParse(newData)}
})
</script>

<style lang="scss" scoped>
  .amap-main{
    height: 100%;
    background-color:rgba(0,0,0,0)!important;
    background-image: none!important;
  }

</style>
