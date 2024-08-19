<template>
  <div class="go-icon-box">
    <GoIconify :icon="((dataset || '') as string)" :color="color" :width="size" :rotate="rotate" @click.stop="iconClick"/>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { GoIconify } from '@/components/GoIconify'
import { useChartDataFetch, useChartInteract } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ModalListType } from '@/store/modules/chartEditStore/chartEditStore'
import { ComponentInteractParamsEnum } from './interact'
import { InteractEventOn } from '@/enums/eventEnum'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const clickEvent = (data:string)=>{
  useChartInteract(
    // 固定参数
    props.chartConfig,
    // 固定参数
    useChartEditStore,
    // 定义的类型和对应的值
    { [ComponentInteractParamsEnum.DATA]: data },
    // 事件类型
    InteractEventOn.CLICK
  )
}

const chartEditStore = useChartEditStore()
const iconClick = ()=>{
  if (props.chartConfig.option.modalId) {
    let data:ModalListType  = {
    modalId:props.chartConfig.option.modalId,
    isShow:true,
    postData:props.chartConfig.option.data
  } 
  chartEditStore.setModalList(data)
  }
  
  clickEvent(props.chartConfig.option.data)
}

const { w, h } = toRefs(props.chartConfig.attr)
const { dataset, color, size, rotate } = toRefs(props.chartConfig.option)
useChartDataFetch(props.chartConfig, useChartEditStore,(newData)=>{
  props.chartConfig.option.dataset = newData
})
</script>

<style lang="scss" scoped>
@include go('icon-box') {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('`${w}px`');
  height: v-bind('`${h}px`');
}
</style>
