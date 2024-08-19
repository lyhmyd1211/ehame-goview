<template>
  <div :class="`go-preview ${chartEditStore.editCanvasConfig.previewScaleType}`" >
      <!-- 缩放层 -->
      <div ref="previewRef" class="go-preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle" >
          <!-- 渲染层 -->
          <preview-render-list :component-list="componentList"></preview-render-list>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, setTitle } from '@/utils'
import { getEditCanvasConfigStyle, getSessionStorageInfo, keyRecordHandle, dragCanvas } from './utils'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

// const localStorageInfo: ChartEditStorageType = getSessionStorageInfo() as ChartEditStorageType

const chartEditStore = useChartEditStore() 

setTitle(`预览-${chartEditStore.editCanvasConfig.projectName}`)

const previewRefStyle = computed(() => {
  return {
    overflow: 'hidden',
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
    ...getFilterStyle(chartEditStore.editCanvasConfig)
  }
})

const props = defineProps({
  componentList: {
    type: Array as PropType<any>,
    required: true
  }
})


// 开启键盘监听
keyRecordHandle()
</script>

<style lang="scss" scoped>
@include go('preview') {
  position: relative;
  height: 100vh;
  width: 100vw;
  @include background-image('background-image');
  &.fit,
  &.full {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .go-preview-scale {
      transform-origin: center center;
    }
  }
  &.scrollY {
    overflow-x: hidden;
    .go-preview-scale {
      transform-origin: left top;
    }
  }
  &.scrollX {
    overflow-y: hidden;
    .go-preview-scale {
      transform-origin: left top;
    }
  }
  .go-preview-entity {
    overflow: hidden;
  }
}
</style>
