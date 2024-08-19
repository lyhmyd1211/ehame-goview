<template>
    <!-- 缩放层 -->
    <div ref="previewRef" class="go-preview-scale">
      <!-- 展示层 -->
      <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed,PropType } from 'vue'
import { getEditCanvasConfigStyle, getSessionStorageInfo, keyRecordHandle, dragCanvas } from '@/views/preview/utils'
import { useComInstall } from '@/views/preview/hooks/useComInstall.hook'
import { useScale } from '@/views/preview/hooks/useScale.hook'
import { useStore } from '@/views/preview/hooks/useStore.hook'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import type { ChartEditStorageType } from '@/views/preview/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType,CreateComponentGroupType } from '@/packages/index.d'
import { animationsClass,setTitle, getFilterStyle, getTransformStyle, getBlendModeStyle, colorCustomMerge } from '@/utils'
import {PreviewRenderGroup} from '@/views/preview/components/PreviewRenderGroup'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '@/views/preview/utils'
import { PublicConfigClass,PublicModalGroupConfigClass } from '@/packages/public'
import { useLifeHandler,useChartDataPondFetch } from '@/hooks'
// const localStorageInfo: ChartEditStorageType = getSessionStorageInfo() as ChartEditStorageType

// await getSessionStorageInfo()
const chartEditStore = useChartEditStore() 
useStore(chartEditStore)
const { entityRef, previewRef } = useScale(chartEditStore)
const { show } = useComInstall(chartEditStore)

// 开启键盘监听
keyRecordHandle()
</script>

<style lang="scss" scoped>
@include go('preview') {
  position: relative;
  height: calc(100vh - 90px);
  width: 100%;
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
  .chart-item{
    position: absolute
  }
}
</style>
