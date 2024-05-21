<template>
  <div>
    <n-tree
    block-line
    :data="option.value.dataset"
    :default-expanded-keys="option.value.defaultExpandedKeys"
    expand-on-click
    :node-props="nodeProps"
    default-expand-all
  />
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
import { TreeOption } from 'naive-ui'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const option = shallowReactive({
  value: {
    dataset: props.chartConfig.option.dataset,
    defaultExpandedKeys:props.chartConfig.option.defaultExpandedKeys
  }
})

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick () {
      console.log('选择',option);
      // 存储到联动数据
      useChartInteract(
        props.chartConfig,
        useChartEditStore,
        { [ComponentInteractParamsEnum.DATA]: option.key },
        InteractEventOn.CHANGE
      )
    },

  }
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
