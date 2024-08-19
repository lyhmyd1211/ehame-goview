<template>
  <div class="go-text-box">
    <div  :style="`width:${w}px;height:${h}px`">
      <n-divider v-if="!chartConfig.option.dataset" :dashed="chartConfig.option.lineType==='dashed'" :vertical="chartConfig.option.orientation==='vertical'"/>
      <n-divider v-else :title-placement="chartConfig.option.titlePlacement" :dashed="chartConfig.option.lineType==='dashed'" :vertical="chartConfig.option.orientation==='vertical'">
        <template #default>
            <div class="content" style="cursor: pointer;" v-if="link" @click="click">{{ option.dataset }}</div>
            <div class="content"  v-else>{{ option.dataset }}</div>
          </template>
      </n-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { option as configOption } from './config'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType & typeof option>,
    required: true
  }
})
const { w, h } = toRefs(props.chartConfig.attr)
const {
  linkHead,
  link,
  fontColor,
  fontSize,
  letterSpacing,
  paddingY,
  paddingX,
  textAlign,
  borderWidth,
  borderColor,
  borderRadius,
  writingMode,
  backgroundColor,
  fontWeight,
  lineWidth,
  lineColor,
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset,
})

// 手动更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData
  },
  {
    immediate: true,
    deep: false
  }
)

// 预览更新
useChartDataFetch(props.chartConfig, useChartEditStore, (newData: string) => {
  option.dataset = newData
})

//打开链接
const click = () => {
  window.open(linkHead.value + link.value)
}
</script>

<style lang="scss" scoped>
@include go('text-box') {
  display: flex;
  align-items: center;
  justify-content: v-bind('textAlign');
  overflow: hidden;

  .content {
    color: v-bind('fontColor');
    padding: v-bind('`${paddingY}px ${paddingX}px`');
    font-size: v-bind('fontSize + "px"');
    letter-spacing: v-bind('letterSpacing + "px"');
    writing-mode: v-bind('writingMode');
    font-weight: v-bind('fontWeight');
    border-style: solid;
    border-width: v-bind('borderWidth + "px"');
    border-radius: v-bind('borderRadius + "px"');
    border-color: v-bind('borderColor');

    background-color: v-bind('backgroundColor');
  }

  :deep(.n-divider){
    --n-color:v-bind('lineColor')!important;
    --n-text-color: v-bind('fontColor')!important;
    --n-font-weight:v-bind('fontWeight')!important;
  }
  :deep(.n-divider__line){
    height:v-bind('lineWidth + "px"');
  }
}
</style>
