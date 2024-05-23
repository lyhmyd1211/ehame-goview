<template>
  <collapse-item name="展开配置" :expanded="true">
    <setting-item-box name="弹出框标题" :alone="true">
      <n-input v-model:value="optionData.modalTitle"></n-input>
    </setting-item-box>
  </collapse-item>
</template>

<script lang="ts" setup>
import { PropType,Ref } from 'vue'
import { CollapseItem, SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  },
  targetData:{
    type:Object as PropType<CreateComponentType | CreateComponentGroupType>
  }
})

</script>
