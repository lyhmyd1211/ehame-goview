<template>
  <n-collapse-item title="事件响应" name="1" >
    <template #header-extra>
      <label>点击事件</label>
    </template>
    <n-card
      class="n-card-shallow"
      size="small"
    >
    <setting-item-box name="弹框id" :alone="true">
      <n-input v-model:value="trueData.option.modalId" @change="inputChange"></n-input>  
      <n-space>
        <n-checkbox v-model:checked="trueData.option.modalClose">
          关闭按钮
        </n-checkbox>
      </n-space>
     
    </setting-item-box>
    </n-card>
  </n-collapse-item>
</template>

<script lang="ts" setup>
import { VNodeChild, computed, ref } from 'vue'
import { SelectOption, SelectGroupOption } from 'naive-ui'
import { SettingItemBox, SettingItem, CollapseItem } from '@/components/Pages/ChartItemSetting'
import { CreateComponentType, CreateComponentGroupType, ChartFrameEnum } from '@/packages/index.d'
import { RequestParamsTypeEnum, RequestDataTypeEnum } from '@/enums/httpEnum'
import { InteractEventOn, COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { icon } from '@/plugins'
import noData from '@/assets/images/canvas/noData.png'
import { goDialog } from '@/utils'
import { useTargetData } from '../../../hooks/useTargetData.hook'

const { CloseIcon, AddIcon, HelpOutlineIcon } = icon.ionicons5
const { targetData,chartEditStore } = useTargetData()
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
const requestParamsTypeList = [RequestParamsTypeEnum.PARAMS, RequestParamsTypeEnum.HEADER]
const getId = ref()

const inputChange = (v:string)=>{
  trueData.value.option.modalId = v

}

// const inputChange = (v:string)=>{
//   targetData.value.events.advancedEvents = {...targetData.value.events.advancedEvents,
//     vnodeMounted:`
//       "e.el.addEventListener('click', () => {
//         components[${v}].ctx.chartConfig.option.isShow = !components[${v}].ctx.chartConfig.option.isShow
//       }, false)"
//     `
//   }
// }


</script>

<style lang="scss" scoped>
.mill-chart-target-data {
  :deep(pre) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.n-input-group {
  height: 30px;
}

.no-data {
  flex-direction: column;
  width: 100%;
  img {
    width: 120px;
  }
}

:deep(.n-base-selection .n-base-selection-label) {
  height: 32px;
}
</style>
