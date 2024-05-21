<template>
  <div>
    <n-input  v-model="option.value.selectValue"></n-input>
    <Charts></Charts>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, ref, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartInteract } from '@/hooks'
import { InteractEventOn } from '@/enums/eventEnum'
import { ComponentInteractParamsEnum } from './interact'
import { useChartDataFetch } from '@/hooks'
import Charts from './charts.vue'


const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const option = shallowReactive({
  value: {
    selectValue: props.chartConfig.option.selectValue,
    dataset: props.chartConfig.option.dataset
  }
})

// 监听事件改变
const onChange = (v: string) => {
  // 存储到联动数据
  useChartInteract(
    props.chartConfig,
    useChartEditStore,
    { [ComponentInteractParamsEnum.DATA]: v },
    InteractEventOn.CHANGE
  )
}


const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)

// 手动更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option.value = newData
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
@include deep() {
  .n-base-selection-label {
    display: flex;
    align-items: center;
  }
}
</style>
