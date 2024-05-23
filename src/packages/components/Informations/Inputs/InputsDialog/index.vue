<template>
  <div>
    <div class="dialog-modal-virtual" :style="`width:${w-2}px;height:${h-2}px;line-height:${h}px`" 
     >
    模态弹出框
    </div>
    <n-modal v-model:show="modalData.isShow" display-directive="show"  preset="card" :title="option.value.modalTitle">
      <suspense>
        <suspense-index :group-data="groupData"></suspense-index>
      </suspense>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, ref, shallowReactive, watch, computed, onMounted } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartDataFetch } from '@/hooks'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle, colorCustomMerge } from '@/utils'
import { PublicModalGroupConfigClass } from '@/packages/public'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '@/views/preview/utils'
import { CreateComponentGroupType } from '@/packages/index.d'
import { useLifeHandler,useChartDataPondFetch } from '@/hooks'
import {PreviewRenderGroup} from '@/views/preview/components/PreviewRenderGroup'
import suspenseIndex from './suspenseIndex.vue'
import { ModalListType } from '@/store/modules/chartEditStore/chartEditStore.d'
// import PreCom from '@/views/preview/components/PreviewRenderList'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  },
  groupData:{
    type:Object as PropType<PublicModalGroupConfigClass>
  }
})
const chartEditStore = useChartEditStore()
// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = chartEditStore.getEditCanvasConfig.chartThemeSetting
  return chartThemeSetting
})

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(chartEditStore.editCanvasConfig.chartCustomThemeColorInfo)
  return colorCustomMergeData[chartEditStore.editCanvasConfig.chartThemeColor]
})

const { w, h } = toRefs(props.chartConfig.attr)
const modalData = computed<ModalListType>(()=>{
  let data = chartEditStore.getModalList.filter(i=>i.modalId===props.groupData?.modalId)
  if (data.length>0) {
    return data[0]
  }else{
    return {
      postData:{},
      modalId:'',
      isShow:false
    }
  }
})


const option = shallowReactive({
  value: {
    componentList:props.groupData?.modalComponent,
    dataset: props.chartConfig.option.dataset,
    modalTitle:props.chartConfig.option.modalTitle
  }
})


// defineExpose({
//   showModal,
//   hideModal
// })

onMounted(() => {
  console.log('chartConfig',props.groupData);
})

const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)

// 手动更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option.value = newData
  },
  {
    // immediate: true,
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
  // border:1px dashed green;
  color: #cdcdcd;
  font-size: 42px;
  font-weight: 600;
  background-color: #fff;
  margin: 1px;
}
</style>
