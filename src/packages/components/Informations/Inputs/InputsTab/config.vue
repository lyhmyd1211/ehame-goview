<template>
  <collapse-item name="标签页配置" :expanded="true">
    <setting-item-box name="标签类型" :alone="true">
      <n-select size="small" v-model:value="optionData.tabType" :options="tabTypeOptions" />
    </setting-item-box>
    <setting-item-box name="默认值" :alone="true">
       <n-select size="small" v-model:value="optionData.tabLabel" value-field="label" :options="optionData.dataset" />
    </setting-item-box>
    <setting-item-box name="样式" >
      <SettingItem name="字体样式">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.fontColor"></n-color-picker>
      </SettingItem>
      <SettingItem name="激活样式">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.activeColor"></n-color-picker>
      </SettingItem>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="内容绑定" :expanded="true" >
    <n-text :depth="3">输入组件ID绑定到面板，全为空则不展示面板</n-text>
    <SettingItemBox :name="'面板-'+(index+1)" v-for="(item, index) in optionData.dataset" :key="index">
      <n-input v-model:value="optionData.paneId[index]"></n-input>
    </SettingItemBox>
  </collapse-item>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox,SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'

defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const tabTypeOptions = [
  {
    label: '线条',
    value: 'bar'
  },
  {
    label: '分段',
    value: 'segment'
  }
]
</script>
