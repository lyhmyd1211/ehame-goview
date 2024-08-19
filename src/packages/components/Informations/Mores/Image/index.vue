<template>
  <div :style="getStyle(borderRadius)">
    <n-tooltip trigger="hover" v-if="chartConfig.option.isTooltip" >
        <template #trigger>
          <n-image
            :style="{cursor: chartConfig.option.isFnBtn?'pointer':'auto'}"
            :object-fit="fit"
            preview-disabled
            :src="option.dataset"
            :fallback-src="requireErrorImg()"
            :width="w"
            :height="h"
            lazy
            @click.stop="iconClick"
          />
        </template>
        {{ chartConfig.option.tooltipName }}
      </n-tooltip>
    <n-image
      v-else
      :style="{cursor: chartConfig.option.isFnBtn?'pointer':'auto'}"
      :object-fit="fit"
      preview-disabled
      :src="option.dataset"
      :fallback-src="requireErrorImg()"
      :width="w"
      :height="h"
      lazy
      @click.stop="iconClick"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs, toRaw } from 'vue'
import { requireErrorImg } from '@/utils'
import { useChartDataFetch, useChartInteract } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ComponentInteractParamsEnum } from './interact'
import { InteractEventOn } from '@/enums/eventEnum'
import { ModalListType } from '@/store/modules/chartEditStore/chartEditStore'
import {downBlobFile, handleBlobFile} from '@/api/other'
import { customizeHttp } from '@/api/http'
import dayjs from 'dayjs'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { dataset, fit, borderRadius } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: ''
})

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: 'hidden'
  }
}
const chartEditStore = useChartEditStore()

const fetchFn = async (url) => {
  let name = url.split('=')[1] + dayjs().format('YYYYMMDD')
  // downBlobFile(url,{},'test.xlsx')
  const res = await customizeHttp(toRaw({requestUrl:url,requestDataType:('1' as any),requestHttpType:('get' as any),requestParamsBodyType:('none' as any),requestSQLContent:{sql:''},requestParams:({Body:{json:''}} as any),requestContentType:0,requestIntervalUnit:('second' as any)}), toRaw(chartEditStore.getRequestGlobalConfig),true)
    if (res) {
      try {
        handleBlobFile(res,name+'.xlsx')
      } catch (error) {
        console.error(error)
      }
    }
  }




const iconClick = ()=>{
  if (props.chartConfig.option.modalId) {
    let data:ModalListType  = {
      modalId:props.chartConfig.option.modalId,
      isShow:!props.chartConfig.option.modalClose,
      postData:props.chartConfig.option.data
    } 
    chartEditStore.setModalList(data)
  }

  if(props.chartConfig.option.isFnBtn){
    fetchFn(props.chartConfig.option.apiUrl+props.chartConfig.option.apiParam)
  }

  clickEvent(props.chartConfig.option.data)
  
}

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

// 编辑更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData
  },
  {
    immediate: true
  }
)

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  
  if (props.chartConfig.option.isFnBtn) {
    props.chartConfig.option.apiParam = newData.apiParam
    option.dataset = newData.dataset
    props.chartConfig.option.dataset = newData.dataset
  }else{
    option.dataset = newData
    props.chartConfig.option.dataset = newData
  }
})
</script>
