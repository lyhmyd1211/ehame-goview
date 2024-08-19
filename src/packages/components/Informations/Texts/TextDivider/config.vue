<template>
  <collapse-item name="线段样式" :expanded="true">
    <setting-item-box name="线段类型" :alone="true">
      <setting-item>
        <n-select v-model:value="optionData.lineType" size="small" :options="lineTypeOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="标题位置" :alone="true">
      <setting-item>
        <n-select v-model:value="optionData.titlePlacement" size="small" :options="titlePlacementOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="布局方式" :alone="true">
      <setting-item>
        <n-select v-model:value="optionData.orientation" size="small" :options="orientationOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="样式">
      <setting-item name="宽度">
        <n-input-number
          v-model:value="optionData.lineWidth"
          size="small"
          :min="0"
          placeholder="宽度"
        ></n-input-number>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.lineColor"></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="文字样式" :expanded="true">
    <setting-item-box name="文字">
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.fontColor"></n-color-picker>
      </setting-item>
      <setting-item name="字体大小">
        <n-input-number v-model:value="optionData.fontSize" size="small" placeholder="字体大小"></n-input-number>
      </setting-item>
      <setting-item name="字体粗细">
        <n-select v-model:value="optionData.fontWeight" size="small" :options="fontWeightOptions" />
      </setting-item>
      <setting-item name="X轴内边距">
        <n-input-number v-model:value="optionData.paddingX" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>
      <setting-item name="Y轴内边距">
        <n-input-number v-model:value="optionData.paddingY" size="small" placeholder="输入内边距"></n-input-number>
      </setting-item>

      <setting-item name="水平对齐">
        <n-select v-model:value="optionData.textAlign" size="small" :options="textAlignOptions" />
      </setting-item>
      <setting-item name="文本方向">
        <n-select v-model:value="optionData.writingMode" size="small" :options="verticalOptions" />
      </setting-item>

      <setting-item name="字间距">
        <n-input-number v-model:value="optionData.letterSpacing" size="small" placeholder="输入字间距"></n-input-number>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="边框">
      <setting-item name="宽度">
        <n-input-number
          v-model:value="optionData.borderWidth"
          size="small"
          :min="0"
          placeholder="宽度"
        ></n-input-number>
      </setting-item>
      <setting-item name="颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.borderColor"></n-color-picker>
      </setting-item>
      <setting-item name="圆角">
        <n-input-number
          v-model:value="optionData.borderRadius"
          size="small"
          :min="0"
          placeholder="圆角"
        ></n-input-number>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="背景" :alone="true">
      <setting-item name="背景颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.backgroundColor"></n-color-picker>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="标题信息" :expanded="true">
    <setting-item-box name="文字" :alone="true">
      <setting-item>
        <n-input v-model:value="optionData.dataset" type="textarea" size="small"></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="链接" :alone="true">
      <setting-item>
        <n-input-group>
          <n-select
            v-model:value="optionData.linkHead"
            size="small"
            :style="{ width: '80%' }"
            :options="linkHeadOptions"
          />
          <n-input v-model:value="optionData.link" size="small"></n-input>
          <n-button :disabled="!optionData.link" secondary size="small" @click="handleLinkClick">跳转</n-button>
        </n-input-group>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option, WritingModeEnum, WritingModeObject, FontWeightEnum, FontWeightObject,LineTypeEnum,LineTypeObject,OrientationEnum,OrientationObject,TitlePlacementEnum,TitlePlacementObject } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const textAlignOptions = [
  { label: '左对齐', value: 'start' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'end' }
]

const verticalOptions = [
  {
    label: WritingModeEnum.HORIZONTAL,
    value: WritingModeObject[WritingModeEnum.HORIZONTAL]
  },
  {
    label: WritingModeEnum.VERTICAL,
    value: WritingModeObject[WritingModeEnum.VERTICAL]
  }
]
const fontWeightOptions = [
  {
    label: FontWeightEnum.NORMAL,
    value: FontWeightObject[FontWeightEnum.NORMAL]
  },
  {
    label: FontWeightEnum.BOLD,
    value: FontWeightObject[FontWeightEnum.BOLD]
  }
]
const lineTypeOptions = [
  {
    label: LineTypeEnum.DASHED,
    value: LineTypeObject[LineTypeEnum.DASHED]
  },
  {
    label: LineTypeEnum.SOLID,
    value: LineTypeObject[LineTypeEnum.SOLID]
  }
]
const titlePlacementOptions = [
  {
    label: TitlePlacementEnum.LEFT,
    value: TitlePlacementObject[TitlePlacementEnum.LEFT]
  },
  {
    label: TitlePlacementEnum.CENTER,
    value: TitlePlacementObject[TitlePlacementEnum.CENTER]
  },
  {
    label: TitlePlacementEnum.RIGHT,
    value: TitlePlacementObject[TitlePlacementEnum.RIGHT]
  }
]

const orientationOptions = [
{
    label: OrientationEnum.HORIZONTAL,
    value: OrientationObject[OrientationEnum.HORIZONTAL]
  },
  {
    label: OrientationEnum.VERTICAL,
    value: OrientationObject[OrientationEnum.VERTICAL]
  }
]

const handleLinkClick = () => {
  window.open(props.optionData.linkHead + props.optionData.link)
}
const linkHeadOptions = [
  { label: 'http://', value: 'http://' },
  { label: 'https://', value: 'https://' }
]
</script>
