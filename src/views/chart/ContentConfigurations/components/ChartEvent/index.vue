<template>
  <!-- 事件配置 -->
  <n-collapse class="go-mt-3" arrow-placement="right" :default-expanded-names="['1', '2']">
    <n-text depth="3">
      组件 id：
      <n-text>{{ trueData.id }}</n-text>
    </n-text>
    <chart-event></chart-event>
    <chart-event-interaction></chart-event-interaction>
    <chart-event-base-handle></chart-event-base-handle>
    <chart-event-advanced-handle></chart-event-advanced-handle>
  </n-collapse>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChartEventInteraction } from './components/ChartEventInteraction'
import { ChartEventAdvancedHandle } from './components/ChartEventAdvancedHandle'
import { ChartEventBaseHandle } from './components/ChartEventBaseHandle'
import {ChartEvent} from './components/ChartEvent'
import { useTargetData } from '../hooks/useTargetData.hook'

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
const showModal = ref(false)
</script>
