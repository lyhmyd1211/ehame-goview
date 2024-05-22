<template>
  <div :class="`go-preview ${chartEditStore.editCanvasConfig.previewScaleType}`" @mousedown="dragCanvas">
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="go-preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="go-preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle" v-if="show">
            <!-- 渲染层 -->
            <div
              class="chart-item"
              :class="animationsClass(groupData?.styles.animations)"
              :key="groupData?.id"
              :style="{
                ...getComponentAttrStyle(groupData?.attr, 0),
                ...getTransformStyle(groupData?.styles),
                ...getStatusStyle(groupData?.status),
                ...getPreviewConfigStyle(groupData?.preview),
                ...getBlendModeStyle(groupData?.styles) as any,
                ...getSizeStyle(groupData?.attr)
              }"
            >
              <!-- 分组 -->
              <preview-render-group
                v-if="groupData?.isGroup"
                :groupData="(groupData.modalComponent as CreateComponentGroupType)"
                :groupIndex="0"
                :themeSetting="themeSetting"
                :themeColor="themeColor"
              ></preview-render-group>

              <!-- 单组件 -->
              <component
                v-else
                :is="groupData?.modalComponent?.chartConfig.chartKey"
                :id="groupData?.modalComponent?.id"
                :chartConfig="groupData?.modalComponent"
                :themeSetting="themeSetting"
                :themeColor="themeColor"
                :style="{ 
                  ...getSizeStyle(groupData?.modalComponent?.attr),
                  ...getFilterStyle(groupData?.modalComponent?.styles)
                }"
                v-on="useLifeHandler(groupData?.modalComponent)"
              ></component>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 缩放层 -->
      <div ref="previewRef" class="go-preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle" v-if="show">
          <!-- 渲染层 -->
          <div
        class="chart-item"
        :class="animationsClass(groupData.styles.animations)"
        :key="groupData.id"
        :style="{
          ...getComponentAttrStyle(groupData.attr, 0),
          ...getTransformStyle(groupData.styles),
          ...getStatusStyle(groupData.status),
          ...getPreviewConfigStyle(groupData.preview),
          ...getBlendModeStyle(groupData.styles) as any,
          ...getSizeStyle(groupData.attr)
        }"
      >
        <!-- 分组 -->
        <preview-render-group
          v-if="groupData?.isGroup"
          :groupData="(groupData.modalComponent as CreateComponentGroupType)"
          :groupIndex="0"
          :themeSetting="themeSetting"
          :themeColor="themeColor"
        ></preview-render-group>

        <!-- 单组件 -->
        <component
          v-else
          :is="groupData?.modalComponent?.chartConfig.chartKey"
          :id="groupData?.modalComponent?.id"
          :chartConfig="groupData?.modalComponent"
          :themeSetting="themeSetting"
          :themeColor="themeColor"
          :style="{ 
            ...getSizeStyle(groupData?.modalComponent?.attr),
            ...getFilterStyle(groupData?.modalComponent?.styles)
          }"
          v-on="useLifeHandler(groupData?.modalComponent)"
        ></component>
      </div>
        </div>
      </div>
    </template>
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
defineProps({
  groupData:{
    type:Object as PropType<PublicModalGroupConfigClass >,
      required:true
  }
})

await getSessionStorageInfo()
const chartEditStore = useChartEditStore() 

setTitle(`预览-${chartEditStore.editCanvasConfig.projectName}`)

const previewRefStyle = computed(() => {
  return {
    overflow: 'hidden',
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
    ...getFilterStyle(chartEditStore.editCanvasConfig)
  }
})

const showEntity = computed(() => {
  const type = chartEditStore.editCanvasConfig.previewScaleType
  return type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
})

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
