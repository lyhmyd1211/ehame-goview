<template>
  <n-select
    v-model:value="option.value.selectValue"
    :options="option.value.dataset"
    :style="`width:${w}px;`"
    @update:value="onChange"
    class="go-chart-select"
    :class="{'custom-bg-select':chartConfig.option.customBg}"
    :to="false"
    :render-option="renderOption"
    :filterable="chartConfig.option.filterable"
    :consistent-menu-width='false'
  />
</template>

<script setup lang="ts">
import type { VNode } from 'vue'
import type { SelectOption } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import { PropType, toRefs, ref, shallowReactive, watch, onMounted, reactive,h as hi } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartDataFetch, useChartInteract } from '@/hooks'
import { InteractEventOn } from '@/enums/eventEnum'
import { ComponentInteractParamsEnum } from './interact'
import cbg1 from '@/assets/images/select/1.png'
import cbg2 from '@/assets/images/select/2.png'
import cbg3 from '@/assets/images/select/3.png'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const {bgColor,fontColor,borderColor,borderActiveColor,bg1,bg2,bg3}  = toRefs(props.chartConfig.option)
const { w, h } = toRefs(props.chartConfig.attr)
const bg = reactive({
  urlBg1:`url(${cbg1})`,
  urlBg2:`url(${cbg2})`,
  urlBg3:`url(${cbg3})`,
}) 

const option = shallowReactive({
  value: {
    selectValue: props.chartConfig.option.selectValue,
    dataset: props.chartConfig.option.dataset
  }
})
onMounted(()=>{
   
})

const renderOption = ({ node, option }: { node: VNode, option: SelectOption }) =>{
  return hi(NTooltip,{placement:'left'}, {
          trigger: () => node,
          default: () => `${option.label}`
        })
}

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
// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: string) => {
  option.value.dataset = newData
})
// 手动更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option.value = newData
    onChange(newData.selectValue)
    bg.urlBg1 = `url('${props.chartConfig.option.bg1?props.chartConfig.option.bg1:cbg1}')`
    bg.urlBg2 = `url('${props.chartConfig.option.bg2?props.chartConfig.option.bg2:cbg2}')`
    bg.urlBg3 = `url('${props.chartConfig.option.bg3?props.chartConfig.option.bg3:cbg3}')`
  
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
@include deep() {
  .n-base-selection{
    min-height: 10px
  }
  
  .n-base-selection-label {
    height: v-bind('h + "px"');
    display: flex;
    align-items: center;
    background-color: v-bind('bgColor');
    .n-base-selection-input{
      color:v-bind('fontColor');
    }
  }
  .n-base-selection:not(.n-base-selection--disabled):hover .n-base-selection__state-border{
      border:v-bind('"1px solid "+borderActiveColor');
      box-shadow: none
  }
  .n-base-selection:not(.n-base-selection--disabled).n-base-selection--active .n-base-selection__state-border{
    border:v-bind('"1px solid "+borderActiveColor');
    box-shadow: none
  }
  .n-base-selection:not(.n-base-selection--disabled).n-base-selection--focus .n-base-selection__state-border{
    border:v-bind('"1px solid "+borderActiveColor');
    box-shadow: none
  }
  .n-base-selection .n-base-selection-label .n-base-selection-label__render-label{
    color:v-bind('fontColor');
  }
  .n-base-selection-active{
    .n-base-selection-label{
      background-color: v-bind('bgColor');
    }
  }
  .n-base-selection__border{
    border: v-bind('"1px solid "+borderColor')
  }
  
  .n-base-selection:not(.n-base-selection-disabled).n-base-selection--active .n-base-selection-label {
    background-color: v-bind('bgColor');
  }
  .n-base-select-menu{
    background-color: v-bind('bgColor');
   
  }
  
  .n-base-select-option{
    color:v-bind('fontColor');
  }
  .v-binder-follower-content{
    width: 100%;
  }
 
}


</style>
<style lang="scss">
.custom-bg-select{
    .n-base-select-menu .n-base-select-option.n-base-select-option--selected.n-base-select-option--pending::before{
      background-color: rgba(0,0,0,0);
    }
    .n-base-select-menu .n-base-select-option.n-base-select-option--pending::before{
      background-color: rgba(0,255,234,0.1);
      left: 0;
      right: 0;
    }
    .n-base-selection-label {
      background-image: v-bind('bg.urlBg1');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .n-base-select-menu .n-base-select-option.n-base-select-option--selected{
      background-image: v-bind('bg.urlBg3');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }

    .n-base-select-option{
      background-image: v-bind('bg.urlBg2');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-top: 5px;
    }
    .n-base-selection__border{
      border: none;
    }
    .n-base-select-menu__empty{
      background-image: v-bind('bg.urlBg2');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  } 
</style>