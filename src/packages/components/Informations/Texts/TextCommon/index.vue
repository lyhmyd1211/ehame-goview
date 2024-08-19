<template>
  <div class="go-text-box" :class="{scroll}">
    <div class="content" :class="{isMultiEllipsis:chartConfig.option.ellipsis===2}" :style="{width:chartConfig.option.ellipsis?'100%':'auto'}">
      <n-tooltip trigger="hover" v-if="chartConfig.option.tooltip" width="trigger">
        <template #trigger>
          <span style="cursor: pointer" class="text" :class="{isEllipsis:chartConfig.option.ellipsis===1}" v-if="link" @click="click">{{ option.dataset }}</span>
          <span  v-else class="text" :class="{isEllipsis:chartConfig.option.ellipsis===1}">{{ option.dataset }}</span>
        </template>
        {{ option.dataset }}
      </n-tooltip>
      <template v-else>
        <span style="cursor: pointer" class="text" :class="{isEllipsis:chartConfig.option.ellipsis===1}" v-if="link" @click="click">{{ option.dataset }}</span>
        <pre  v-else class="text" :class="{isEllipsis:chartConfig.option.ellipsis===1}" >{{option.dataset}}</pre>
      </template>
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

const {
  linkHead,
  link,
  fontColor,
  fontSize,
  letterSpacing,
  paddingY,
  paddingX,
  textAlign,
  alignItems,
  borderWidth,
  borderColor,
  borderRadius,
  writingMode,
  backgroundColor,
  fontWeight,
  mEllipsisNum,
  scroll
} = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: configOption.dataset
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
  align-items: v-bind('alignItems||"center"');
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
  .isEllipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
  }
  .isMultiEllipsis{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: v-bind('mEllipsisNum');
    padding-bottom: 0;
  }
  &.scroll{
    overflow: auto;
  }
  :deep(n-popover__content){
    max-height: 500px;
    overflow: auto;
  }
  pre{
    font-family: auto;
    text-wrap: wrap;
  }
}
</style>
