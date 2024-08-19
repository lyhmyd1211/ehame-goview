<template>
  <v-chart
    ref="vChartRef"
    :init-options="initOptions"
    :theme="themeColor"
    :option="option"
    :manual-update="isPreview()"
    :update-options="{
      replaceMerge: replaceMergeArr
    }"
    autoresize
  ></v-chart>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType, onMounted, onUnmounted } from 'vue'
import VChart from 'vue-echarts'
import { useCanvasInitOptions } from '@/hooks/useCanvasInitOptions.hook'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { mergeTheme } from '@/packages/public/chart'
import config, { includes, seriesItem } from './config'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import isObject from 'lodash/isObject'
import cloneDeep from 'lodash/cloneDeep'
let timer:any = null
const props = defineProps({
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

const initOptions = useCanvasInitOptions(props.chartConfig.option, props.themeSetting)

use([DatasetComponent, CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

// dataset 无法变更条数的补丁
watch(
  () => props.chartConfig.option.dataset,
  (newData: { dimensions: any }, oldData) => {
    try {
      if (!isObject(newData) || !('dimensions' in newData)) return
      if (Array.isArray(newData?.dimensions)) {
        const seriesArr = []
        for (let i = 0; i < newData.dimensions.length - 1; i++) {
          seriesArr.push(cloneDeep(seriesItem))
        }
        replaceMergeArr.value = ['series']
        props.chartConfig.option.series = seriesArr
        nextTick(() => {
          replaceMergeArr.value = []
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  {
    deep: false
  }
)


const ival = ref()
const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore,(nData)=>{
  if (vChartRef.value?.getDom().clientHeight!==0) {
    props.chartConfig.option.dataset = nData
      clearInterval(timer)
      watch(()=>props.chartConfig.option.isScroll,(newData)=>{
      if (newData) {
        timer = setInterval(function () {
                // 每次向后滚动scrollNum个
                props.chartConfig.option.dataZoom[0].endValue -= props.chartConfig.option.scrollNum;
                if (props.chartConfig.option.dataZoom[0].startValue-props.chartConfig.option.scrollNum<0) {
                  props.chartConfig.option.dataZoom[0].startValue = 0
                }else{
                  props.chartConfig.option.dataZoom[0].startValue -= props.chartConfig.option.scrollNum;
                }

                // 如果超出总数据长度，从头开始
                if (props.chartConfig.option.dataZoom[0].endValue < 0) {
                    props.chartConfig.option.dataZoom[0].endValue = props.chartConfig.option.dataset.source.length - 1;
                    props.chartConfig.option.dataZoom[0].startValue = props.chartConfig.option.dataset.source.length - props.chartConfig.option.scrollNum;
                }
                vChartRef.value?.setOption(props.chartConfig.option); 
            }, 5000);

            // 初始设置为显示最后的scrollNum个数据
            props.chartConfig.option.dataZoom[0].endValue = props.chartConfig.option.dataset.source.length - 1;
            props.chartConfig.option.dataZoom[0].startValue = props.chartConfig.option.dataset.source.length - props.chartConfig.option.scrollNum;
            vChartRef.value?.setOption(props.chartConfig.option);
      }else{
        clearInterval(timer)
      }
    
    },{
      immediate:true
    })
  }
 
})



onUnmounted(() => {
  clearInterval(timer)
})


</script>
