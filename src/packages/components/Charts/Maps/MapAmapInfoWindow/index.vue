<template>
  <div ref="previewRef" class="info-window go-preview-scale"  :style="{display:isPreview()?modalData.isShow?'block':'none':'block'}">
    <div class="dialog-info-virtual" :style="`width:${w-2}px;height:${h-2}px;line-height:${h}px;`" 
     v-show="!isPreview()">
    高德地图信息窗体
    </div>
    <!-- <suspenseIndex> -->
      <div ref="modalRef" style="position: relative;" v-show="modalData.isShow"></div>
    <!-- </suspenseIndex> -->
    
      <!-- <n-modal v-model:show="modalData.isShow" display-directive="show"  preset="card" :title="option.value.modalTitle" class="custom-modal" size="small" :style="[`width:${w-2+50}px;height:${h-2+63}px`,{backgroundImage:`url(${chartConfig.option.bg?chartConfig.option.bg:defaultBg})`,
        backgroundSize: chartConfig.option.bgScaleType||'100%'
      }]" :to="goDom" :class="{noHead:!showTitle}">
        
      <suspense-index>
        <div ref="modalRef" style="position: relative;"></div>
      </suspense-index>
    </n-modal> -->
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, ref, shallowReactive, watch, computed, onMounted, nextTick } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartDataFetch } from '@/hooks'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle, colorCustomMerge } from '@/utils'
import { PublicModalGroupConfigClass } from '@/packages/public'
import suspenseIndex from './suspenseIndex.vue'
import { ModalListType } from '@/store/modules/chartEditStore/chartEditStore.d'
import {isPreview} from '@/utils'
import { useStore } from '@/views/preview/hooks/useStore.hook'
import { useScale } from '@/views/preview/hooks/useScale.hook'
import { useComInstall } from '@/views/preview/hooks/useComInstall.hook'
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
useStore(chartEditStore)
const {  previewRef } = useScale(chartEditStore)
const { show } = useComInstall(chartEditStore)
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
    console.log('cur',data[0]);
    return data[0]
  }else{
    return {
      postData:{},
      modalId:'',
      isShow:false
    }
  }
})

const {
  showTitle
} = toRefs(props.chartConfig.option)

// const goDom = ref(document.getElementsByClassName('go-preview-scale')[0])

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
const modalRef = ref()
onMounted(() => {
  console.log('渲染之后');
})

watch(()=>modalData.value,()=>{
  if (modalData.value.isShow) {
    nextTick(()=>{
      console.log('object',props.groupData);
    if (props.groupData&&props.groupData.id) {
      let dom = document.getElementById(props.groupData.id)
      if (dom) {
        if (!modalRef.value.contains(dom)) {
          modalRef.value.appendChild(dom)
          dom.style.display = 'flex'
        }
       
      }
    }
   
  })
  }
})

// const head = computed(()=>{
//   return showTitle?'flex':'none'
// })

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
.info-window{
  transform-origin: top left;
}
.dialog-info-virtual{
  width: 100%;
  height: 100%;
  // min-width: 260px;
  // min-height: 300px;
  text-align: center;
  // border:1px dashed green;
  color: #cdcdcd;
  font-size: 42px;
  font-weight: 600;
  margin: 1px;

  border:1px solid #cdcdcd;
  background-color: rgba(0,0,0,0);
  // background-image: url('@/assets/images/modal/4.png');
  background-repeat: no-repeat!important;
}


</style>
<style lang="scss">
.go-preview{
  .n-modal-mask{
    // background-color: rgba(0, 0, 0, 0.9);
  }
  .n-modal .n-data-table{
    --n-merged-th-color:rgba(5, 46, 71, 1);
  --n-merged-td-color:rgba(0,0,0,0);
  --n-merged-border-color: rgba(22, 184, 175, 1);
    --n-merged-th-color-hover: rgba(0,0,0,0);
    --n-merged-td-color-hover: rgba(0,0,0,0);
    --n-merged-td-color-striped: rgba(0,0,0,0);
   
    
  }
  .n-data-table .n-data-table-th{
    color: #fff;
  }
  .n-data-table .n-data-table-td{
    color: #fff;
  }
  .noHead{
    .n-card-header{
    display: none
  }
  }
 
 
}
.custom-modal{

  &.n-modal{
    background-color: rgba(0,0,0,0);
    // background-image: url('@/assets/images/modal/4.png');
    background-repeat: no-repeat!important;
    
    border-radius: 50px;
    box-shadow:none;
    .n-card__content{
      padding: 0!important;
    
    }
   
    .n-card-header__main{
      color: rgba(221, 253, 255, 1);
      font-weight: bold;
      font-size: 30px;
      text-indent: 350px;
    }
    .n-card-header__close{
    position: absolute;
    right: 35px;
    top: 79px;
    cursor: pointer;
    z-index: 10;
    /* visibility: hidden; */
    // opacity: 0;
  }
  }
 
}


</style>
