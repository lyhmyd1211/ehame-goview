<template>
  <div>
    <div class="dialog-modal-virtual" :style="`width:${w-2}px;height:${h-2}px;line-height:${h}px`" 
     >
    模态弹出框
    </div>
    <n-modal v-model:show="isShow">
      <component :is="option.value.componentId"></component>
    </n-modal>
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
import { loadingStart, loadingFinish, loadingError, setComponentPosition, JSONParse } from '@/utils'
import { DragKeyEnum } from '@/enums/editPageEnum'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const { w, h } = toRefs(props.chartConfig.attr)
const isShow = ref<Boolean>(false)
const showModal = ()=>{
  isShow.value  = true
}

const hideModal = ()=>{
  isShow.value  = false
}

const option = shallowReactive({
  value: {
    componentId:props.chartConfig.option.componentId,
    dataset: props.chartConfig.option.dataset,
    defaultExpandedKeys:props.chartConfig.option.defaultExpandedKeys
  }
})



defineExpose({
  showModal,
  hideModal
})

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
.dialog-modal-virtual{
  width: 100%;
  height: 100%;
  // min-width: 260px;
  // min-height: 300px;
  text-align: center;
  border:1px dashed green;
}
</style>
