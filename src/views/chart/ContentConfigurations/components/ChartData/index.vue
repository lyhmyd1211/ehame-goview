<template>
  <div class="go-chart-configurations-data" v-if="trueData">
    <setting-item-box name="请求方式" :alone="true">
      <n-select v-model:value="trueData.request.requestDataType" :disabled="isNotData" :options="selectOptions" />
    </setting-item-box>
    <!-- 静态 -->
    <chart-data-static v-if="trueData.request.requestDataType === RequestDataTypeEnum.STATIC"></chart-data-static>
    <!-- 动态 -->
    <chart-data-ajax v-if="trueData.request.requestDataType === RequestDataTypeEnum.AJAX"></chart-data-ajax>
    <!-- 数据池 -->
    <chart-data-pond v-if="trueData.request.requestDataType === RequestDataTypeEnum.Pond"></chart-data-pond>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { loadAsyncComponent } from '@/utils'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { RequestDataTypeEnum } from '@/enums/httpEnum'
import { ChartFrameEnum } from '@/packages/index.d'
import { useTargetData } from '../hooks/useTargetData.hook'
import { SelectCreateDataType, SelectCreateDataEnum } from './index.d'

const ChartDataStatic = loadAsyncComponent(() => import('./components/ChartDataStatic/index.vue'))
const ChartDataAjax = loadAsyncComponent(() => import('./components/ChartDataAjax/index.vue'))
const ChartDataPond = loadAsyncComponent(() => import('./components/ChartDataPond/index.vue'))

const { targetData,chartEditStore } = useTargetData()
const trueData = computed(()=>{
  const selectId = chartEditStore.getTargetChart.selectId
  if (selectId&&selectId.length>0) {
    if (targetData.value?.id!==selectId[0]) {
      let data = targetData.value?.groupList?.filter(i=>i.id===selectId[0])
      if (data&&data.length>0) {
        return data[0]
      }
    }
  }
  return targetData.value
})

// 选项
const selectOptions: SelectCreateDataType[] = [
  {
    label: SelectCreateDataEnum.STATIC,
    value: RequestDataTypeEnum.STATIC
  },
  {
    label: SelectCreateDataEnum.AJAX,
    value: RequestDataTypeEnum.AJAX
  },
  {
    label: SelectCreateDataEnum.Pond,
    value: RequestDataTypeEnum.Pond
  }
]

// 无数据源
const isNotData = computed(() => {
  return (
    trueData.value.chartConfig?.chartFrame === ChartFrameEnum.STATIC ||
    typeof trueData.value?.option?.dataset === 'undefined'
  )
})
</script>
