<template>
  <div class="go-chart-configurations-setting" v-if="trueData">
    <!-- 名称 -->
    <name-setting :chartConfig="trueData.chartConfig"></name-setting>
    <!-- 尺寸 -->
    <size-setting :isGroup="trueData.isGroup" :chartAttr="trueData.attr"></size-setting>
    <!-- 位置 -->
    <position-setting :chartAttr="trueData.attr" :canvasConfig="chartEditStore.getEditCanvasConfig" />
    <!-- 滤镜 -->
    <styles-setting :isGroup="trueData.isGroup" :chartStyles="trueData.styles" :targetData="trueData"></styles-setting>
    <!-- 自定义配置项 -->
    <component :is="trueData.chartConfig.conKey" :optionData="trueData.option" :targetData="trueData"></component>
  </div>
</template>

<script setup lang="ts">
import { NameSetting, PositionSetting, SizeSetting, StylesSetting } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '../hooks/useTargetData.hook'
import { computed } from 'vue';
const { targetData, chartEditStore } = useTargetData()
const trueData = computed(()=>{
  const selectId = chartEditStore.getTargetChart.selectId
  if (selectId&&selectId.length>0) {
    if (targetData.value?.id!==selectId[0]) {
      let data = targetData.value?.groupList?.filter(i=>i.id===selectId[0])
      if (data&&data.length>0) {
        return data[0]
      }
    }
  }
  return targetData.value
})
</script>

<style lang="scss" scoped>
@include go('chart-configurations-setting') {
}
</style>
