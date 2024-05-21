<template>
  <!-- <collapse-item name="展开配置" :expanded="true">
    <setting-item-box name="默认值" :alone="true">
      <n-tree-select
        cascade
        checkable
        :options="optionData.dataset"
        @update:value="handleUpdateValue"
      />
    </setting-item-box>
  </collapse-item> -->
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { TreeSelectOption } from 'naive-ui';


const handleUpdateValue = ( value: Array<string> ,
        option: TreeSelectOption | null | Array<TreeSelectOption | null>)=>{
  props.optionData.defaultExpandedKeys = value
}

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>
