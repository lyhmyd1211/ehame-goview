<template>
  <div
    class="chart-item"
    v-for="(item, index) in componentList"
    :class="animationsClass(item.styles.animations)"
    :key="item.id"
    :style="{
      ...getComponentAttrStyle(item.attr, index),
      ...getTransformStyle(item.styles),
      ...getStatusStyle(item.status),
      ...getPreviewConfigStyle(item.preview),
      ...getBlendModeStyle(item.styles) as any,
      ...getSizeStyle(item.attr),
      visibility:!item.isModal?'visible':'hidden'
    }"
  >
    <!-- 分组 -->
    <preview-render-group
      v-if="item.isGroup"
      :groupData="(item as CreateComponentGroupType)"
      :groupIndex="index"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
    ></preview-render-group>

    <!-- 单组件 -->
    <component
      v-else
      :is="item.chartConfig.chartKey"
      :id="item.id"
      :chartConfig="item"
      :themeSetting="themeSetting"
      :themeColor="themeColor"
      :style="{ 
        ...getSizeStyle(item.attr),
        ...getFilterStyle(item.styles)
      }"
      v-on="useLifeHandler(item)"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted } from 'vue'
import { useChartDataPondFetch } from '@/hooks'
import { PreviewRenderGroup } from '../PreviewRenderGroup/index'
import { CreateComponentGroupType } from '@/packages/index.d'
import { chartColors } from '@/settings/chartThemes/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle, colorCustomMerge } from '@/utils'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '../../utils'
import { useLifeHandler } from '@/hooks'
import { storeToRefs } from 'pinia'



// 初始化数据池
const chartEditStore = useChartEditStore()
const props = defineProps({
  componentList: {
    type: Array as PropType<any>,
    required: true
  }
})

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting = chartEditStore.editCanvasConfig.chartThemeSetting
  return chartThemeSetting
})

// 配置项
const themeColor = computed(() => {
  const colorCustomMergeData = colorCustomMerge(chartEditStore.editCanvasConfig.chartCustomThemeColorInfo)
  return colorCustomMergeData[chartEditStore.editCanvasConfig.chartThemeColor]
})


</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
