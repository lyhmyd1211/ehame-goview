<template>
  <!-- Echarts 全局设置 -->
  <global-setting :optionData="optionData"></global-setting>
  <setting-item-box name="维度">
      <setting-item name="柱型个数">
        <n-input-number v-model:value="optionData.len" :min="1" size="small" @change="numChange"></n-input-number>
      </setting-item>
    </setting-item-box>
  <CollapseItem v-for="(item, index) in seriesList" :key="index" :name="`柱状图-${index + 1}`" :expanded="true">
    <SettingItemBox name="图形">
      <SettingItem name="宽度">
        <n-input-number
          v-model:value="item.barWidth"
          :min="1"
          :max="100"
          size="small"
          placeholder="自动计算"
        ></n-input-number>
      </SettingItem>
      <SettingItem name="圆角">
        <n-input-number v-model:value="item.itemStyle.borderRadius" :min="0" size="small"></n-input-number>
      </SettingItem>
    </SettingItemBox>
    <setting-item-box name="标签">
      <setting-item>
        <n-space>
          <n-switch v-model:value="item.label.show" size="small" />
          <n-text>展示标签</n-text>
        </n-space>
      </setting-item>
      <setting-item name="大小">
        <n-input-number v-model:value="item.label.fontSize" size="small" :min="1"></n-input-number>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="item.label.color"></n-color-picker>
      </setting-item>
      <setting-item name="位置">
        <n-select
          v-model:value="item.label.position"
          :options="[
            { label: 'center', value: 'center' },
            { label: 'top', value: 'top' },
            { label: 'left', value: 'left' },
            { label: 'right', value: 'right' },
            { label: 'bottom', value: 'bottom' },
            { label: 'inside', value: 'inside' },
            { label: 'insideTop', value: 'insideTop' },
            { label: 'insideBottom', value: 'insideBottom' },
            { label: 'insideLeft', value: 'insideLeft' },
            { label: 'insideRight', value: 'insideRight' }
          ]"
        />
      </setting-item>
      <SettingItem name="旋转角度">
        <n-input-number v-model:value="item.label.rotate" size="small" :min="-90" :max="90"></n-input-number>
      </SettingItem>
      <SettingItem name="x偏移">
        <n-input-number v-model:value="item.label.offset[0]" size="small" ></n-input-number>
      </SettingItem>
      <SettingItem name="y偏移">
        <n-input-number v-model:value="item.label.offset[1]" size="small" ></n-input-number>
      </SettingItem>
    </setting-item-box>
  </CollapseItem>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const numChange = (val:number)=>{
  props.optionData.series = []
  for (let index = 0; index < val; index++) {
    props.optionData.series.push({...props.optionData.seriesItem})
  }
}


const seriesList = computed(() => {
  console.log('props.optionData.series',props.optionData.series);
  return props.optionData.series
})
</script>
