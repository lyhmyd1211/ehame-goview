<template>
  <div
    :class="animationsClass(groupData.styles.animations)"
    :id="groupData.id"
    :ref="groupData.id"
    :style="{
      ...getSizeStyle(groupData.attr),
      ...getFilterStyle(groupData.styles),
    }"
  >
    <div
      class="chart-item"
      v-for="item in groupData.groupList"
      :class="animationsClass(item.styles.animations)"
      :key="item.id"
      :style="{
      ...getComponentAttrStyle(item.attr, groupIndex),
      ...getStatusStyle(item.status),
      ...getPreviewConfigStyle(item.preview),
      ...getBlendModeStyle(item.styles) as any
    }"
    >
    <template v-if="item.key==='MapAmapInfoWindow'">
      <component
        v-show="!item.isModalInstance"
        :is="item.chartConfig.chartKey"
        :id="item.id"
        :ref="item.id"
        :chartConfig="item"
        :groupData="groupData"
        :themeSetting="themeSetting"
        :themeColor="themeColor"
         @click="componentClick(item)"
        :style="{
          ...getSizeStyle(item.attr),
          ...getFilterStyle(item.styles),
        }"
        v-on="useLifeHandler(item)"
      ></component>
    </template>
     <template v-else>
      <component
        v-show="!item.isModalInstance"
        :is="item.chartConfig.chartKey"
        :id="item.id"
        :ref="item.id"
        :chartConfig="item"
        :groupData="groupData"
        :themeSetting="themeSetting"
        :themeColor="themeColor"
         @click="componentClick(item)"
        :style="{
          ...getSizeStyle(item.attr),
          ...getFilterStyle(item.styles),
          ...getTransformStyle(item.styles)
        }"
        v-on="useLifeHandler(item)"
      ></component>
     </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CreateComponentGroupType } from '@/packages/index.d'
import { animationsClass, getFilterStyle, getTransformStyle, getBlendModeStyle } from '@/utils'
import { getSizeStyle, getComponentAttrStyle, getStatusStyle, getPreviewConfigStyle } from '../../utils'
import { useLifeHandler } from '@/hooks'
import { ModalListType, useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const props = defineProps({
  groupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true
  },
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  groupIndex: {
    type: Number,
    required: true
  }
})
const chartEditStore = useChartEditStore()
const componentClick = (item:any)=>{
  if (!item.option.replaceCommonEvent&&item.option.modalId) {
    let data:ModalListType  = {
    modalId:item.option.modalId,
    postData:item
  } 
    chartEditStore.setModalList(data)
  }
}
</script>

<style lang="scss" scoped>
.chart-item {
  position: absolute;
}
</style>
